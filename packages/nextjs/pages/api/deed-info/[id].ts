import axios from "axios";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import { Address, Hex, createPublicClient, getContract, hexToString, http } from "viem";
import { goerli } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { IpfsFileModel } from "~~/models/ipfs-file.model";

interface AuthToken extends JwtPayload {
  verified_credentials: [{ address: Address; email: string }];
}

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
  const client = createPublicClient({ chain: goerli, transport: http() });

  // Get the contract instance.
  const contract = getContract({
    address: deedNFT.address,
    abi: deedNFT.abi,
    publicClient: client,
  });

  // Extract the JWT token from the authorization header.
  const jwtToken = req.headers.authorization;
  let walletAddress = undefined;
  let hasPrivilege = false;
  let deedOwner: string;

  try {
    deedOwner = await contract.read.ownerOf([id as any]);
  } catch (error: any) {
    if (error.toString().includes("ERC721NonexistentToken")) {
      return res.status(404).send(`Error: Deed ${id} not found`);
    }
    return res.status(500).send(`Error while fetching deed ${id} (${error})`);
  }

  if (jwtToken) {
    // Decode the JWT token to get the wallet address.
    const decoded = jwtDecode<AuthToken>(jwtToken);
    walletAddress = decoded.verified_credentials[0].address;
    const isValidator = await contract.read.hasValidatorRole({
      account: walletAddress,
    });

    const isOwner = deedOwner === walletAddress;
    hasPrivilege = isValidator || isOwner;
  }

  // Get the deed information from the contract.
  const tokenUri = await contract.read.tokenURI([id as any]);
  const asciiIpfs = hexToString(tokenUri as Hex);
  // Construct the file path for the IPFS file. And apply the pinata gateway token if the user has the privilege.
  const filePath = `${process.env.NEXT_PINATA_GATEWAY}/ipfs/${asciiIpfs}?pinataGatewayToken=${
    hasPrivilege ? process.env.NEXT_PINATA_GATEWAY_KEY : ""
  }`;

  const response = await fetch(filePath);
  if (response.status !== 200) {
    res.status(response.status).send(`Error while fetching deed ${id} (${response.statusText})`);
    return;
  }

  const deedInfo = (await response.json()) as DeedInfoModel;
  deedInfo.id = +id;
  deedInfo.owner = deedOwner;

  if (!hash) {
    // Send the JSON data as the response.
    res.status(200).send(deedInfo);
    return;
  }

  let found = false;
  // find the hash in the deedInfo
  [
    ...Object.values(deedInfo.otherInformation),
    ...Object.values(deedInfo.ownerInformation),
    ...Object.values(deedInfo.propertyDetails),
  ].forEach(field => {
    if (!found && field.hash === hash) {
      downloadFile(field, res);
      found = true;
      return;
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
