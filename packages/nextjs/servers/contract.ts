import { createPublicClient, getContract, http } from "viem";
import { arbitrum, gnosis, goerli, localhost, polygon } from "viem/chains";
import { mainnet, sepolia } from "wagmi";
import CONFIG from "~~/config";
import deployedContracts from "~~/contracts/deployedContracts";
import logger from "~~/services/logger.service";

export const getClient = (host: string, chainId: number | string) => {
  let chain;
  chainId = Number(chainId);
  if (chainId === sepolia.id) {
    chain = sepolia;
  } else if (chainId === mainnet.id) {
    chain = mainnet;
  } else if (chainId === arbitrum.id) {
    chain = arbitrum;
  } else if (chainId === polygon.id) {
    chain = polygon;
  } else if (chainId === gnosis.id) {
    chain = gnosis;
  } else if (chainId === goerli.id) {
    chain = goerli;
  } else if (chainId === localhost.id) {
    chain = localhost;
  } else {
    throw new Error(`ChainId not supported (${chainId})`);
  }
  let rpcUrl;
  if ("alchemy" in chain.rpcUrls) {
    rpcUrl = `${chain.rpcUrls.alchemy.http[0]}/${CONFIG.alchemyApiKey}`;
  } else {
    rpcUrl = chain.rpcUrls.default.http[0];
  }
  return createPublicClient({
    chain: chain,
    transport: http(rpcUrl, {
      fetchOptions: {
        headers: { Origin: host },
      },
    }),
  });
};

export const getDeedOwner = async (host: string, id: number, chainId: number) => {
  // Get the contract instance.
  const contract = getContractInstance(host, chainId, "DeedNFT");
  try {
    return await contract.read.ownerOf([id as any]);
  } catch (error: any) {
    if (error.toString().includes("ERC721NonexistentToken")) {
      logger.error({ message: `Error: Deed ${id} not found in chain`, error });
      return undefined;
    } else {
      logger.error({ message: "Error while fetching deed in chain", error });
      return undefined;
    }
  }
};

export const getContractInstance = (
  host: string,
  chainId: number | string,
  name: keyof (typeof deployedContracts)[42161],
) => {
  chainId = Number(chainId);
  const deedNFT = deployedContracts[+chainId as keyof typeof deployedContracts][name];

  return getContract({
    address: deedNFT.address,
    abi: deedNFT.abi,
    publicClient: getClient(host, chainId),
  });
};
