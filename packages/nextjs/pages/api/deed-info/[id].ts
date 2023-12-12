import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import { Hex, createPublicClient, getContract, hexToString, http } from "viem";
import { goerli } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";
import AuthToken from "~~/models/auth-token";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { IpfsFileModel } from "~~/models/ipfs-file.model";
import scaffoldConfig from "~~/scaffold.config";
import { jwtDecode } from "~~/services/jwt-util";

// This function handles the API request for fetching the deed information.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is GET.
  try {
    switch (req.method) {
      case "GET":
        get(req, res);
        break;
      default:
        return res.status(405).send("Method not allowed");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
}

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  // Extract the tokenId and chainId from the query parameters.
  const { id, chainId, hash } = req.query;

  if (!chainId || Number.isNaN(chainId))
    return res.status(400).send("Error: chainId of type number is required");

  if (!id || Number.isNaN(id)) return res.status(400).send("Error: id of type number is required");

  // Get the deployed DeedNFT contract.
  const deedNFT = deployedContracts[+chainId as keyof typeof deployedContracts].DeedNFT;

  // Create a public client for interacting with the blockchain.
  const client = createPublicClient({
    chain: goerli,
    transport: http(`${goerli.rpcUrls.alchemy.http[0]}/${scaffoldConfig.alchemyApiKey}`),
  });

  // Get the contract instance.
  const contract = getContract({
    address: deedNFT.address,
    abi: deedNFT.abi,
    publicClient: client,
  });

  // Extract the JWT token from the authorization header.
  const jwtToken = req.headers.authorization;
  let walletAddress = undefined;
  let canAccess = false;
  let deedOwner: string;

  try {
    deedOwner = await contract.read.ownerOf([id as any]);
  } catch (error: any) {
    if (error.toString().includes("ERC721NonexistentToken")) {
      return res.status(404).send(`Error: Deed ${id} not found`);
    }
    return res.status(500).send(`Error while fetching deed ${id} (${error})`);
  }

  // If the JWT token is not present, then check if the deed has been published (validated)
  const deedInfo = await contract.read.getDeedInfo([id as any]);
  canAccess = deedInfo.isValidated;

  if (!canAccess && jwtToken) {
    // Decode the JWT token to get the wallet address.
    let decoded: AuthToken;
    try {
      decoded = jwtDecode<AuthToken>(jwtToken);
    } catch (error) {
      res.status(401).send(`Error: Invalid JWT token`);
      return;
    }

    walletAddress = decoded.verified_credentials[0].address;
    const isValidator = await contract.read.hasValidatorRole({
      account: walletAddress,
    });

    const isOwner = deedOwner === walletAddress;
    canAccess = isValidator || isOwner;
  }

  if (!canAccess) {
    return res.status(401).send(`Error: AccessControlUnauthorizedAccount to view deed ${id}`);
  }

  // Get the deed information from the contract.
  let tokenHash = await contract.read.tokenURI([id as any]);
  if (tokenHash.startsWith("0x")) {
    tokenHash = hexToString(tokenHash as Hex);
  }

  // Construct the file path for the IPFS file. And apply the pinata gateway token if the user has the privilege.
  const filePath = `${process.env.NEXT_PINATA_GATEWAY}/ipfs/${tokenHash}?pinataGatewayToken=${process.env.NEXT_PINATA_GATEWAY_KEY}`;

  const response = await fetch(filePath);
  if (response.status !== 200) {
    res.status(response.status).send(`Error while fetching deed ${id} (${response.statusText})`);
    return;
  }

  const deedInfoMetadata = (await response.json()) as DeedInfoModel;
  deedInfoMetadata.id = +id;
  deedInfoMetadata.owner = deedOwner;
  deedInfoMetadata.isValidated = deedInfo.isValidated;

  if (!hash) {
    // Send the JSON data as the response.
    res.status(200).send(deedInfoMetadata);
    return;
  }

  let found = false;
  // find the hash in the deedInfo
  [
    ...Object.values(deedInfoMetadata.otherInformation),
    ...Object.values(deedInfoMetadata.ownerInformation),
    ...Object.values(deedInfoMetadata.propertyDetails),
  ].forEach((field: IpfsFileModel | IpfsFileModel[]) => {
    if (found) return;
    const item = Array.isArray(field) ? field.find(x => x.hash === hash) : (field as IpfsFileModel);
    if (!item) return;
    if (item.hash === hash) {
      found = true;
      if (item.restricted && !canAccess) {
        res.status(401).send(`Error: Unauthorized to view file ${item.name} for deed ${id}`);
        return;
      }
      downloadFile(item, res);
    }
  });

  if (!found) {
    res.status(404).send(`Error: File ${hash} not found for deed ${id}`);
  }
};

const downloadFile = async (file: IpfsFileModel, res: NextApiResponse) => {
  const filePath = `${process.env.NEXT_PINATA_GATEWAY}/ipfs/${file.hash}?pinataGatewayToken=${process.env.NEXT_PINATA_GATEWAY_KEY}`;
  const { data } = await axios.get<Readable>(filePath, {
    responseType: "stream",
  });

  const filename = file.name || file.hash;

  res.setHeader("Content-Type", file.type);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  data.pipe(res);
};
