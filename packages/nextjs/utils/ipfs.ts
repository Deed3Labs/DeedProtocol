import { readFile } from "./file";
import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK({ pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_TOKEN });
export const uploadFile = async (file: File) => {
  const fileContent = readFile(file);
  const res = await pinata.pinJSONToIPFS(fileContent, {
    pinataMetadata: {
      name: file.name,
    },
    pinataOptions: {
      wrapWithDirectory: true,
    },
  });
  return res.IpfsHash;
};

export const uploadJson = async (object: any) => {
  const res = await pinata.pinJSONToIPFS(object);
  return res.IpfsHash;
};

export const retrieveFromHash = <T = any>(hash: string) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${hash}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_KEY}"`,
  ).then(res => res.json() as T);
};
