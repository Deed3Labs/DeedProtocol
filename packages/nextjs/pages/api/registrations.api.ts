import "./base";
import { isArray } from "lodash-es";
import { NextApiRequest, NextApiResponse } from "next";
import { RegistrationDb as RegistrationsDb } from "~~/databases/registrations.db";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { authentify, getWalletAddressFromToken, testEncryption } from "~~/servers/auth";
import { getContractInstance, getDeedOwner } from "~~/servers/contract";
import { getObjectFromIpfs } from "~~/servers/ipfs";
import logger from "~~/services/logger.service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(await testEncryption(res))) return;
  try {
    switch (req.method) {
      case "GET":
        if (req.query.isRestricted === "true") {
          return await getRegistrationFromDatabase(req, res);
        } else {
          return await getRegistrationFromChain(req, res);
        }
      case "POST":
        return await saveRegistration(req, res);
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
async function getRegistrationFromChain(req: NextApiRequest, res: NextApiResponse) {
  const { id, chainId } = req.query;
  if (!chainId || Number.isNaN(chainId) || Array.isArray(chainId)) {
    return res.status(400).send("Error: chainId of type number is required");
  }

  if (!id || Number.isNaN(+id)) {
    return res.status(400).send("Error: id of type number is required");
  }

  const contract = getContractInstance(chainId, "DeedNFT");

  // Get the deed information from the contract.
  const tokenHash = await contract.read.tokenURI([id as any]);

  const tokenMetadataResponse = await getObjectFromIpfs(tokenHash);
  if (!tokenMetadataResponse) {
    res.status(500).send(`Error while fetching deed ${id} with hash ${tokenHash}`);
    return;
  }

  // Fetch owner
  const deedOwner = await getDeedOwner(+id, +chainId);

  // Fetch isValidated
  const deedInfo = await contract.read.getDeedInfo([id as any]);

  const deedInfoMetadata = tokenMetadataResponse as unknown as DeedInfoModel;
  deedInfoMetadata.id = id as string;
  deedInfoMetadata.mintedId = Number(id);
  deedInfoMetadata.owner = deedOwner;
  deedInfoMetadata.isValidated = deedInfo.isValidated;

  return res.status(200).json(deedInfoMetadata);
}

/**
 * Retrieve the deed information from the database.
 */
async function getRegistrationFromDatabase(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || isArray(id)) {
    return res.status(400).send("Error: id of type number is required");
  }

  const registration = await RegistrationsDb.getRegistration(id);

  if (!registration) {
    return res.status(404).send(`Error: Deed ${id} not found in drafts`);
  }

  if (!(await authentify(req, res, [registration.owner!, "Validator"]))) {
    return;
  }

  return res.status(200).json(registration);
}

/**
 * Add a new deed information to the database.
 */
async function saveRegistration(req: NextApiRequest, res: NextApiResponse) {
  const deedInfo = JSON.parse(req.body) as DeedInfoModel;
  const walletAddress = getWalletAddressFromToken(req);

  if (!walletAddress) {
    return res.status(401).send("Error: Unauthorized");
  }

  if (!validate()) {
    return res.status(400).send("Error: deedInfo is invalid");
  }

  let existingRegistration;
  if (deedInfo.id) {
    existingRegistration = await RegistrationsDb.getRegistration(deedInfo.id);
    if (!(await authentify(req, res, [existingRegistration!.owner!]))) {
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
  }

  deedInfo.owner = walletAddress;

  const id = await RegistrationsDb.saveRegistration(deedInfo);
  if (!id) {
    return res.status(500).send("Error: Unable to save deedInfo");
  } else {
    return res.status(200).send(id);
  }
}

function validate() {
  return true;
}
