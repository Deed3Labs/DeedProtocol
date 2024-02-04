import { Hex, hexToString } from "viem";

export const getFileFromHash = async (hash: string) => {
  if (hash.startsWith("0x")) {
    hash = hexToString(hash as Hex);
  }

  let gateway = process.env.NEXT_PINATA_GATEWAY;

  if (gateway?.endsWith("/")) {
    gateway = gateway.substring(0, gateway.length - 1);
  }

  const filePath = `${gateway}/ipfs/${hash}?pinataGatewayToken=${process.env.NEXT_PINATA_GATEWAY_KEY}`;
  return await fetch(filePath);
};
