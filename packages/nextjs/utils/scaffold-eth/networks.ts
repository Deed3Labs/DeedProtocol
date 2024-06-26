import { Address } from "viem";
import * as chains from "viem/chains";
import CONFIG from "~~/config";
import { TokenModel } from "~~/models/token.model";

export interface TChainAttributes {
  // color | [lightThemeColor, darkThemeColor]
  color: string | [string, string];
  // Used to fetch price by providing mainnet token address
  // for networks having native currency other than ETH
  stableCoin: TokenModel;
  storageAddress: Address;
  deedMintingFeeDollar: number;
  blockExplorer?: string;
  deedSubgraph?: string;
  ipfsGateway?: string;
}

export const NETWORKS_EXTRA_DATA: Record<string, TChainAttributes> = {
  [chains.localhost.id]: {
    color: "#7d7d7d",
    storageAddress: "0xaA373895fe4f752ecF17e1F4D90217C4c48CbA05",
    deedMintingFeeDollar: 0,
    stableCoin: {
      address: "0x0000000000",
      decimals: 18,
      symbol: "ETH",
    },
    deedSubgraph: "http://localhost:8000/subgraphs/name/Deed3",
    ipfsGateway: "http://localhost:8080/ipfs/",
  },
  [chains.arbitrum.id]: {
    color: "#28a0f0",
    storageAddress: "0x84F1d8D4B10b1C56e032aE09bCA57f393638cd4E",
    deedMintingFeeDollar: 500,
    stableCoin: {
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      decimals: 6,
      symbol: "USDC",
    },
    ipfsGateway: "https://ipfs.io/ipfs/",
    blockExplorer: "https://arbiscan.io/",
  },
  [chains.sepolia.id]: {
    color: "#2bbdf7",
    storageAddress: "0xD30aee396a54560581a3265Fd2194B0edB787525",
    deedMintingFeeDollar: 500,
    stableCoin: {
      address: "0x2B4987D22648CB0B7C062b03d91147478A95b52b",
      decimals: 18,
      symbol: "DAI",
    },
    ipfsGateway: "https://ipfs.io/ipfs/",
    blockExplorer: "https://blockscout.com/xdai/mainnet",
  },
  [chains.polygon.id]: {
    color: "#5f4bb6",
    storageAddress: "0xD0cC723ED8FEE1eaDFf8CB0883A244b16163361B",
    deedMintingFeeDollar: 500,
    ipfsGateway: "https://ipfs.io/ipfs/",
    stableCoin: {
      address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      decimals: 6,
      symbol: "USDC",
      coinGeckoId: "usd-coin",
    },
    blockExplorer: "https://polygonscan.com/",
  },
  [chains.mainnet.id]: {
    color: "#ff8b9e",
    storageAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
    deedMintingFeeDollar: 0,
    stableCoin: {
      address: "0x0000000000",
      decimals: 18,
      symbol: "ETH",
    },
  },
  // [chains.hardhat.id]: {
  //   color: "#b8af0c",
  //   nativeCurrencyTokenAddress: "0x0000000000",
  //   storageAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
  //   deedMintingFeeDollar: 0,
  //   stableCoin: {
  //     address: "0x0000000000",
  //     decimals: 18,
  //     symbol: "ETH",
  //   },
  // },
  // [chains.goerli.id]: {
  //   color: "#0975F6",
  //   nativeCurrencyTokenAddress: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
  //   storageAddress: "0x52e6102B7C22eeC7A68B11Dd71faC7D6D9AEcf50",
  //   deedMintingFeeDollar: 500,
  //   stableCoin: {
  //     address: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
  //     decimals: 18,
  //     symbol: "USDC",
  //   },
  // },
  // [chains.gnosis.id]: {
  //   color: "#48a9a6",
  //   storageAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
  //   deedMintingFeeDollar: 0,
  //   stableCoin: {
  //     address: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
  //     decimals: 18,
  //     symbol: "USDC",
  //   },
  // },
  // [chains.polygonMumbai.id]: {
  //   color: "#92D9FA",
  //   storageAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
  //   deedMintingFeeDollar: 0,
  //   stableCoin: {
  //     address: "0x0000000000",
  //     decimals: 18,
  //     symbol: "USDC",
  //   },
  // },
  // [chains.optimismGoerli.id]: {
  //   color: "#f01a37",
  //   storageAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
  //   deedMintingFeeDollar: 0,
  //   stableCoin: {
  //     address: "0x0000000000",
  //     decimals: 18,
  //     symbol: "USDC",
  //   },
  // },
  // [chains.optimism.id]: {
  //   color: "#f01a37",
  //   storageAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
  //   deedMintingFeeDollar: 0,
  //   stableCoin: {
  //     address: "0x0000000000",
  //     decimals: 18,
  //     symbol: "USDC",
  //   },
  // },
  // [chains.arbitrumGoerli.id]: {
  //   color: "#28a0f0",
  //   storageAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
  //   deedMintingFeeDollar: 0,
  //   nativeCurrencyTokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  // },
  // [chains.arbitrum.id]: {
  //   color: "#28a0f0",
  //   nativeCurrencyTokenAddress: "0x0000000000",
  //   storageAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
  //   deedMintingFeeDollar: 0,
  //   stableCoin: "0x0000000000",
  // },
  // [chains.fantom.id]: {
  //   color: "#1969ff",
  //   nativeCurrencyTokenAddress: "0x0000000000",
  //   storageAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
  //   deedMintingFeeDollar: 0,
  //   stableCoin: "0x0000000000",
  // },
  // [chains.fantomTestnet.id]: {
  //   color: "#1969ff",
  //   nativeCurrencyTokenAddress: "0x0000000000",
  //   storageAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
  //   deedMintingFeeDollar: 0,
  //   stableCoin: "0x0000000000",
  // },
  // [chains.scrollSepolia.id]: {
  //   color: "#fbebd4",
  //   nativeCurrencyTokenAddress: "0x0000000000",
  //   storageAddress: "0x91B0d67D3F47A30FBEeB159E67209Ad6cb2cE22E",
  //   deedMintingFeeDollar: 0,
  //   stableCoin: "0x0000000000",
  // },
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

export function getTargetNetwork(): chains.Chain & TChainAttributes {
  const configuredNetwork = CONFIG.targetNetwork;
  return {
    ...configuredNetwork,
    ...NETWORKS_EXTRA_DATA[configuredNetwork.id],
  };
}
