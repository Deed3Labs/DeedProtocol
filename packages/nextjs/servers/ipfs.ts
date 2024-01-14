import { Hex, hexToString } from "viem";

export const getFileFromHash = async (hash: string) => {
  if (hash.startsWith("0x")) {
    hash = hexToString(hash as Hex);
  }

  const filePath = `${process.env.NEXT_PINATA_GATEWAY}/ipfs/${hash}?pinataGatewayToken=${process.env.NEXT_PINATA_GATEWAY_KEY}`;
  return await fetch(filePath);
};
