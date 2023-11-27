import { JwtPayload, jwtDecode } from "jwt-decode";
import { NextApiRequest, NextApiResponse } from "next";
import { Address, createPublicClient, fromHex, getContract, http } from "viem";
import { goerli } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";

interface AuthToken extends JwtPayload {
  verified_credentials: [{ address: Address; email: string }];
}

// This function handles the API request for fetching the deed information.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is GET.
  if (req.method !== "GET") return res.status(405).send("Method not allowed");

  // Check if the authorization header is present.
  if (!req.headers.authorization) return res.status(401).send("Unauthaurized");

  try {
    // Extract the tokenId and chainId from the query parameters.
    const { id, chainId } = req.query;
    // Get the deployed DeedNFT contract.
    const deedNFT = deployedContracts[5].DeedNFT;

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

    // Decode the JWT token to get the wallet address.
    const decoded = jwtDecode<AuthToken>(jwtToken);
    const walletAddress = decoded.verified_credentials[0].address;

    // const isValidator = contract.read.hasValidatorRole(walletAddress);
    const isValidator = false;
    const deedOwner = await contract.read.ownerOf([id as any]);
    console.log(deedOwner);
    console.log(walletAddress);
    const isOwner = deedOwner === walletAddress;
    if (!isValidator && !isOwner) {
      return res.status(401).send("Error: caller isn't validator");
    }
    // Get the deed information from the contract.
    const deedInfo = await contract.read.getDeedInfo([id as any]);
    const ipfsHash = fromHex(deedInfo.ipfsDetailsHash, "string");
    // Construct the file path for the IPFS file.
    const filePath = `${process.env.NEXT_PINATA_GATEWAY}/ipfs/${ipfsHash}?pinataGatewayToken=${process.env.NEXT_PINATA_GATEWAY_KEY}"`;
    // Fetch the JSON data from the file path.
    const jsonResponse = await fetchJson(filePath);

    // Send the JSON data as the response.
    res.status(200).send(jsonResponse);
    // res.status(200).send("works");

    // const readStream = await fetch(filePath);
    // const stat = fileSystem.statSync(filePath);

    // res.writeHead({
    //   "Content-Length": stat.size,
    // });
  } catch (e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
  res.status(200).end();
}

// This function fetches the JSON data from the given file path.
const fetchJson = async (filePath: string) => {
  const jsonData = await fetch(filePath);
  return jsonData.text();
};
//
//This code handles an API request for fetching the deed information. It checks if the request method is GET and if the authorization header is present. If not, it returns an error response.
//
//The code then extracts the tokenId and chainId from the query parameters. It gets the deployed DeedNFT contract and creates a public client for interacting with the blockchain.
//
//The code then decodes the JWT token to get the wallet address. It fetches the deed information from the contract and constructs the file path for the IPFS file.
//
//The code fetches the JSON data from the file path and sends it as the response. If any errors occur during the process, it logs the error and returns a server error response..</s>
