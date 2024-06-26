import pinataSDK from "@pinata/sdk";
import { IPFSHTTPClient, Options, create } from "ipfs-http-client";
import { Hex, hexToString, toHex } from "viem";
import logger from "~~/services/logger.service";

const config: Options = process.env.NEXT_PUBLIC_OFFLINE
  ? {
      host: "127.0.0.1",
      port: 5001,
    }
  : {
      url: `https://api.thegraph.com/ipfs/api/v0`,
    };
export const pinata = new pinataSDK(
  process.env.NEXT_PINATA_API_KEY,
  process.env.NEXT_PINATA_API_SECRET,
);
export const ipfsClient = create(config);

export const pushObjectToIpfs = async (obj: object | string): Promise<string> => {
  if (process.env.NEXT_PUBLIC_OFFLINE) {
    let json;
    if (!(typeof obj === "string")) {
      json = JSON.stringify(obj);
    } else {
      json = obj;
    }
    const response = await ipfsClient.add(json);
    const cid = response.cid.toString();
    logger.debug("New IPFS at address", cid);
    return toHex(cid);
  } else {
    const response = await pinata.pinJSONToIPFS(obj);
    logger.debug("New IPFS at address", response.IpfsHash);
    return response.IpfsHash;
  }
};

export async function getObjectFromIpfs<TResult = string>(
  hash: string,
  configOverride?: IPFSHTTPClient,
) {
  if (process.env.NEXT_PUBLIC_OFFLINE) {
    if (hash.startsWith("0x")) {
      hash = hexToString(hash as Hex);
    }

    // eslint-disable-next-line no-restricted-syntax
    for await (const value of (configOverride ?? ipfsClient).cat(hash)) {
      const decodedSplit = new TextDecoder("utf-8")
        .decode(value)
        .trim()
        .split("\x00")
        .filter(x => !!x); // Only one result

      const ipfsResult = decodedSplit[decodedSplit.length - 1];
      try {
        const parsed = JSON.parse(ipfsResult) as TResult;
        if (typeof parsed === "object") {
          return parsed;
        }
      } catch {
        // eslint-disable-next-line no-empty
      }
      return ipfsResult; // Return the raw string
    }
  } else {
    if (hash.startsWith("0x")) {
      hash = hexToString(hash as Hex);
    }

    const filePath = getIpfsUrl(hash);
    return await (await fetch(filePath)).json();
  }

  return undefined; // No result
}

export function getIpfsUrl(hash: string) {
  if (process.env.NEXT_PUBLIC_OFFLINE) {
    return `http://${config.host}:${config.port}/ipfs/${hash}`;
  } else {
    let gateway = process.env.NEXT_PINATA_GATEWAY;

    if (!gateway?.endsWith("/")) {
      gateway += "/";
    }
    return `${gateway}ipfs/${hash}?pinataGatewayToken=${process.env.NEXT_PINATA_GATEWAY_KEY}`;
  }
}
