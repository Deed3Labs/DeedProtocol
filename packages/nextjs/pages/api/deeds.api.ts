import "./base";
import { isArray } from "lodash-es";
import { NextApiRequest, NextApiResponse } from "next";
import { ExplorerPageSize } from "~~/constants";
import { DeedDb } from "~~/databases/deeds.db";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { PropertiesFilterModel } from "~~/models/properties-filter.model";
import { authentify, getWalletAddressFromToken, testEncryption } from "~~/servers/auth";
import { getContractInstance, getDeedOwner } from "~~/servers/contract";
import { getObjectFromIpfs } from "~~/servers/ipfs";
import logger from "~~/services/logger.service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(await testEncryption(res))) return;
  try {
    switch (req.method) {
      case "GET":
        if (req.query.id) {
          if (Number.isNaN(+req.query.id)) {
            return await getDeedFromDatabase(req, res);
          } else {
            return await getDeedFromChain(req, res);
          }
        } else {
          return await searchDeeds(req, res);
        }
      case "POST":
        return await saveDeed(req, res);
      default:
        return res.status(405).send("Method not allowed");
    }
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Server Error");
  }
};

export default withErrorHandler(handler);

/**
 * Retrieve the deed information from the chain.
 */
async function getDeedFromChain(req: NextApiRequest, res: NextApiResponse, forceId?: any) {
  const { chainId } = req.query;
  const id = forceId ?? req.query.id;
  if (!chainId || Number.isNaN(chainId) || Array.isArray(chainId)) {
    return res.status(400).send("Error: chainId of type number is required");
  }

  if (!id || Number.isNaN(+id)) {
    return res.status(400).send("Error: id of type number is required");
  }

  const contract = getContractInstance(req.headers.host ?? "", chainId, "DeedNFT");

  // Get the deed information from the contract.
  const tokenHash = await contract.read.tokenURI([id as any]);

  const tokenMetadataResponse = await getObjectFromIpfs(tokenHash);
  if (!tokenMetadataResponse) {
    res.status(500).send(`Error while fetching deed ${id} with hash ${tokenHash}`);
    return;
  }

  // Fetch owner
  const deedOwner = await getDeedOwner(req.headers.host ?? "", +id, +chainId);

  // Fetch isValidated
  const deedInfo = await contract.read.getDeedInfo([id as any]);

  const deedInfoMetadata = tokenMetadataResponse as unknown as DeedInfoModel;
  deedInfoMetadata.mintedId = Number(id);
  deedInfoMetadata.ownerInformation.walletAddress = deedOwner!;
  deedInfoMetadata.isValidated = deedInfo.isValidated;

  return res.status(200).json(deedInfoMetadata);
}

/**
 * Retrieve the deed information from the database.
 */
async function getDeedFromDatabase(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || isArray(id)) {
    return res.status(400).send("Error: id of type number is required");
  }

  const deed = await DeedDb.getDeed(id);

  if (deed?.mintedId) return getDeedFromChain(req, res, deed.mintedId);

  if (!deed) {
    return res.status(404).send(`Error: Deed ${id} not found in drafts`);
  }

  if (!(await authentify(req, res, [deed.ownerInformation.walletAddress!, "Validator"]))) {
    return;
  }

  return res.status(200).json(deed);
}

/**
 * Add a new deed information to the database.
 */
async function saveDeed(req: NextApiRequest, res: NextApiResponse) {
  const deedInfo = JSON.parse(req.body) as DeedInfoModel;
  const walletAddress = getWalletAddressFromToken(req);

  if (!walletAddress) {
    return res.status(401).send("Error: Unauthorized");
  }

  const validationError = validate(deedInfo);
  if (validationError) {
    return res.status(453).send("Validation Error: " + validationError);
  }

  let existingRegistration;
  if (deedInfo.id) {
    existingRegistration = await DeedDb.getDeed(deedInfo.id);
    if (
      !(await authentify(req, res, [
        existingRegistration!.ownerInformation.walletAddress!,
        "Validator",
      ]))
    ) {
      return;
    }
  }

  const getFullAddress = (model: DeedInfoModel) => {
    const { propertyDetails } = model;
    return `${propertyDetails.propertyAddress}, ${propertyDetails.propertyCity}, ${propertyDetails.propertyState}, United States`;
  };

  if (
    !existingRegistration?.propertyDetails.propertyLatitude ||
    getFullAddress(deedInfo) !== getFullAddress(existingRegistration)
  ) {
    try {
      // Compute the lat long from address
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
          getFullAddress(deedInfo),
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
      );

      const data = await response.json();

      if (!data.features.length) {
        return res
          .status(400)
          .send("Error: Unable to get coordinates from address, please try another address.");
      }

      const coordinates = data.features[0].geometry.coordinates;

      deedInfo.propertyDetails.propertyLatitude = coordinates[1];
      deedInfo.propertyDetails.propertyLongitude = coordinates[0];
    } catch (error) {
      // If no connection we can fake location
      if (process.env.NEXT_PUBLIC_OFFLINE) {
        const center = { lat: 40, lng: -100 };
        const radius = 10;
        deedInfo.propertyDetails.propertyLatitude =
          center.lat + (Math.random() - 0.5) * (radius * 2);
        deedInfo.propertyDetails.propertyLongitude =
          center.lng + (Math.random() - 0.5) * (radius * 2);
      } else {
        return res
          .status(400)
          .send("Error: Unable to get coordinates from address, please try another address.");
      }
    }
  }

  const id = await DeedDb.saveDeed(deedInfo);
  if (!id) {
    return res.status(500).send("Error: Unable to save deedInfo");
  } else {
    return res.status(200).send(id);
  }
}

async function searchDeeds(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query as unknown as PropertiesFilterModel & {
    currentPage: string;
    pageSize: string;
  };

  const isValidator = await authentify(req, res, ["Validator"], false);

  if (query.validated !== "true" && !isValidator) {
    const walletAddress = getWalletAddressFromToken(req);
    if (walletAddress) {
      query.ownerWallet = walletAddress;
    } else {
      query.validated = "true";
    }
  }

  const registrations = await DeedDb.listDeeds(
    query,
    query.currentPage ? +query.currentPage : 0,
    query.pageSize ? +query.pageSize : ExplorerPageSize,
    !isValidator && query.validated === "all",
  );
  return res.status(200).send(registrations);
}

function validate(model: DeedInfoModel) {
  // Validate if the model is valid and if all required fields are present
  if (!model.ownerInformation.ownerName) return "Field owner name is required";
  if (model.ownerInformation.ownerType === "legal") {
    if (!model.ownerInformation.ownerPosition) return "Field owner position is required";
    if (!model.ownerInformation.ownerState) return "Field owner state is required";
    if (!model.ownerInformation.ownerEntityType) return "Field owner entity type is required";
  }
  if (!model.propertyDetails.propertyType) return "Field property type is required";
  if (!model.propertyDetails.propertyAddress) return "Field property address is required";
  if (!model.propertyDetails.propertyCity) return "Field property city is required";
  if (!model.propertyDetails.propertyState) return "Field property state is required";
  return false;
}

// /**
//  * Only used for local development since local subgraph is not usable offline
//  */
// const loadFakeProperties = async () => {
//   const properties = [];
//   const contract = getContractInstance(getTargetNetwork().id, "DeedNFT");
//   const nextId = await contract.read.nextDeedId();
//   const pageSize = Number(nextId);
//   const center = { lat: 40, lng: -100 };
//   const radius = 10;
//   const fakeAddresses = [
//     "16336 E ALAMEDA PL AURORA CO 80017-1130 USA",
//     "4500 S FOX ST ENGLEWOOD CO 80110-5621 USA",
//     "2924 ROSS DR FORT COLLINS CO 80526-1143 USA",
//     "504 FRUITVALE CT GRAND JUNCTION CO 81504-4445 USA",
//     "3801 ELK LN PUEBLO CO 81005-3093 USA",
//     "1 UTE LN GUNNISON CO 81230-9501 USA",
//     "1057 S GAYLORD ST DENVER CO 80209-4680 USA",
//     "301 N MESA ST FRUITA CO 81521-2109 USA",
//   ];
//   for (let index = 1; index < pageSize; index++) {
//     const newProperty = {
//       id: index.toString(),
//       propertyDetails: {
//         propertyImages: [],
//         propertyAddress: fakeAddresses[index % fakeAddresses.length],
//         propertyLatitude: center.lat + (Math.random() - 0.5) * (radius * 2),
//         propertyLongitude: center.lng + (Math.random() - 0.5) * (radius * 2),
//       } as unknown as PropertyDetailsModel,
//     } as DeedInfoModel;
//     properties.push(newProperty);
//   }
//   return properties;
// };
