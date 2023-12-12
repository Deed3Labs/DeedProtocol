import * as chains from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";

export interface TChainAttributes {
  // color | [lightThemeColor, darkThemeColor]
  color: string | [string, string];
  // Used to fetch price by providing mainnet token address
  // for networks having native currency other than ETH
  nativeCurrencyTokenAddress: string;
  stableCoinAddress: string;
  storageWalletAddress: string;
  deedMintingFee: bigint;
  blockExplorer?: string;
}

export const NETWORKS_EXTRA_DATA: Record<string, TChainAttributes> = {
  [chains.hardhat.id]: {
    color: "#b8af0c",
    nativeCurrencyTokenAddress: "0x0000000000",
    storageWalletAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0x0000000000",
  },
  [chains.mainnet.id]: {
    color: "#ff8b9e",
    nativeCurrencyTokenAddress: "0x0000000000",
    storageWalletAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0x0000000000",
  },
  [chains.sepolia.id]: {
    color: ["#5f4bb6", "#87ff65"],
    nativeCurrencyTokenAddress: "0x0000000000",
    storageWalletAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0x0000000000",
  },
  [chains.goerli.id]: {
    color: "#0975F6",
    nativeCurrencyTokenAddress: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
    storageWalletAddress: "0x52e6102B7C22eeC7A68B11Dd71faC7D6D9AEcf50",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
  },
  [chains.gnosis.id]: {
    color: "#48a9a6",
    nativeCurrencyTokenAddress: "0x0000000000",
    storageWalletAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0x0000000000",
  },
  [chains.polygon.id]: {
    color: "#2bbdf7",
    nativeCurrencyTokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    storageWalletAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0x0000000000",
  },
  [chains.polygonMumbai.id]: {
    color: "#92D9FA",
    nativeCurrencyTokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    storageWalletAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0x0000000000",
  },
  [chains.optimismGoerli.id]: {
    color: "#f01a37",
    nativeCurrencyTokenAddress: "0x0000000000",
    storageWalletAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0x0000000000",
  },
  [chains.optimism.id]: {
    color: "#f01a37",
    nativeCurrencyTokenAddress: "0x0000000000",
    storageWalletAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0x0000000000",
  },
  [chains.arbitrumGoerli.id]: {
    color: "#28a0f0",
    nativeCurrencyTokenAddress: "0x0000000000",
    storageWalletAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0x0000000000",
  },
  [chains.arbitrum.id]: {
    color: "#28a0f0",
    nativeCurrencyTokenAddress: "0x0000000000",
    storageWalletAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0x0000000000",
  },
  [chains.fantom.id]: {
    color: "#1969ff",
    nativeCurrencyTokenAddress: "0x0000000000",
    storageWalletAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0x0000000000",
  },
  [chains.fantomTestnet.id]: {
    color: "#1969ff",
    nativeCurrencyTokenAddress: "0x0000000000",
    storageWalletAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0x0000000000",
  },
  [chains.scrollSepolia.id]: {
    color: "#fbebd4",
    nativeCurrencyTokenAddress: "0x0000000000",
    storageWalletAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFee: BigInt(0),
    stableCoinAddress: "0x0000000000",
  },
};

/**
 * Gives the block explorer transaction URL.
 * @param network
 * @param txnHash
 * @dev returns empty string if the network is localChain
 */
export function getBlockExplorerTxLink(txnHash: string, chainId?: number) {
  if (!chainId) {
    chainId = getTargetNetwork().id;
  }
  const chainNames = Object.keys(chains);

  const targetChainArr = chainNames.filter(chainName => {
    const wagmiChain = chains[chainName as keyof typeof chains];
    return wagmiChain.id === chainId;
  });

  if (targetChainArr.length === 0) {
    return "";
  }

  const targetChain = targetChainArr[0] as keyof typeof chains;
  // @ts-expect-error : ignoring error since `blockExplorers` key may or may not be present on some chains
  const blockExplorerTxURL = chains[targetChain]?.blockExplorers?.default?.url;

  if (!blockExplorerTxURL) {
    return "";
  }

  return `${blockExplorerTxURL}/tx/${txnHash}`;
}

/**
 * Gives the block explorer Address URL.
 * @param network - wagmi chain object
 * @param address
 * @returns block explorer address URL and etherscan URL if block explorer URL is not present for wagmi network
 */
export function getBlockExplorerAddressLink(address: string, network?: chains.Chain) {
  if (!network) {
    network = getTargetNetwork();
  }
  const blockExplorerBaseURL = network.blockExplorers?.default?.url;
  if (network.id === chains.hardhat.id) {
    return `/blockexplorer/address/${address}`;
  }

  if (!blockExplorerBaseURL) {
    return `https://etherscan.io/address/${address}`;
  }

  return `${blockExplorerBaseURL}/address/${address}`;
}

/**
 * @returns targetNetwork object consisting targetNetwork from scaffold.config and extra network metadata
 */

export function getTargetNetwork(): chains.Chain & Partial<TChainAttributes> {
  const configuredNetwork = scaffoldConfig.targetNetwork;

  return {
    ...configuredNetwork,
    ...NETWORKS_EXTRA_DATA[configuredNetwork.id],
  };
}
