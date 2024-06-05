import { createPublicClient, getContract, http } from "viem";
import { gnosis, goerli, localhost, polygon } from "viem/chains";
import { mainnet, sepolia } from "wagmi";
import CONFIG from "~~/config";
import deployedContracts from "~~/contracts/deployedContracts";
import logger from "~~/services/logger.service";

export const getClient = (chainId: number | string) => {
  let chain;
  chainId = Number(chainId);
  if (chainId === sepolia.id) {
    chain = sepolia;
  } else if (chainId === mainnet.id) {
    chain = mainnet;
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
    transport: http(rpcUrl),
  });
};

export const getDeedOwner = async (id: number, chainId: number) => {
  // Get the contract instance.
  const contract = getContractInstance(chainId, "DeedNFT");
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
  chainId: number | string,
  name: keyof (typeof deployedContracts)[137],
) => {
  chainId = Number(chainId);
  const deedNFT = deployedContracts[+chainId as keyof typeof deployedContracts][name];

  return getContract({
    address: deedNFT.address,
    abi: deedNFT.abi,
    publicClient: getClient(chainId),
  });
};
