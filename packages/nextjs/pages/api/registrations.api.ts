import { isArray } from "lodash-es";
import { NextApiRequest, NextApiResponse } from "next";
import { RegistrationDb, RegistrationDb as RegistrationsDb } from "~~/databases/registrations.db";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { authentify, getWalletAddressFromToken, testEncryption } from "~~/servers/auth";
import { getContractInstance, getDeedOwner } from "~~/servers/contract";
import { getFileFromHash } from "~~/servers/ipfs";
import logger from "~~/services/logger.service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(await testEncryption(res))) return;
  try {
    switch (req.method) {
      case "GET":
        if (req.query.isRestricted === "true" || process.env.NEXT_PUBLIC_OFFLINE) {
          return await getRegistrationFromDatabase(req, res);
        } else {
          return await getRegistrationFromChain(req, res);
        }
      case "POST":
        if (req.query.paymentReceipt) {
          return await savePaymentReceipt(req, res);
        } else {
          return await saveRegistration(req, res);
        }
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

  if (!id || Number.isNaN(id)) {
    return res.status(400).send("Error: id of type number is required");
  }

  const contract = getContractInstance(chainId, "DeedNFT");

  // Get the deed information from the contract.
  const tokenHash = await contract.read.tokenURI([id as any]);

  const tokenMetadataResponse = await getFileFromHash(tokenHash);
  if (tokenMetadataResponse.status !== 200) {
    res
      .status(tokenMetadataResponse.status)
      .send(`Error while fetching deed ${id} (${tokenMetadataResponse.statusText})`);
    return;
  }

  // Fetch owner
  const deedOwner = await getDeedOwner(+id, +chainId);

  // Fetch isValidated
  const deedInfo = await contract.read.getDeedInfo([id as any]);

  const deedInfoMetadata = (await tokenMetadataResponse.json()) as DeedInfoModel;
  deedInfoMetadata.id = id as string;
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

  if (deedInfo.id) {
    const reg = await RegistrationsDb.getRegistration(deedInfo.id);
    if (!(await authentify(req, res, [reg!.owner!]))) {
      return;
    }
  }

  deedInfo.owner = walletAddress;

  const id = await RegistrationsDb.saveRegistration(deedInfo);
  if (!id) {
    return res.status(500).send("Error: Unable to save deedInfo");
  } else {
    return res.status(200).send(id);
  }
}

async function savePaymentReceipt(req: NextApiRequest, res: NextApiResponse) {
  const { id, paymentReceipt } = req.query;

  if (!id || isArray(id)) {
    return res.status(400).send("Error: id of type number is required");
  }

  const deedInfo = await RegistrationDb.getRegistration(id);

  if (!deedInfo) {
    return res.status(404).send(`Error: Deed ${id} not found`);
  }

  if (!(await authentify(req, res, [deedInfo.owner!, "Validator"]))) {
    return;
  }

  deedInfo.paymentInformation.receipt = paymentReceipt as string;
  await RegistrationDb.saveRegistration(deedInfo);

  return res.status(200).send("success");
}

function validate() {
  return true;
}
