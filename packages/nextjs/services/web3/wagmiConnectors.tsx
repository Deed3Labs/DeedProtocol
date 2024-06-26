import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import * as chains from "viem/chains";
import { configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import CONFIG from "~~/config";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

const configuredNetwork = getTargetNetwork();

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
const enabledChains =
  configuredNetwork.id === 1 ? [configuredNetwork] : [configuredNetwork, chains.mainnet];

/**
 * Chains for the app
 */
export const appChains = configureChains(
  enabledChains,
  [
    alchemyProvider({
      apiKey: CONFIG.alchemyApiKey,
    }),
    publicProvider(),
  ],
  {
    // We might not need this checkout https://github.com/scaffold-eth/scaffold-eth-2/pull/45#discussion_r1024496359, will test and remove this before merging
    stallTimeout: 3_000,
    // Sets pollingInterval if using chain's other than local hardhat chain
    ...(configuredNetwork.id !== chains.hardhat.id
      ? {
          pollingInterval: CONFIG.pollingInterval,
        }
      : {}),
  },
);

const walletsOptions = {
  chains: appChains.chains,
  projectId: CONFIG.walletConnectProjectId,
};

const wallets = [metaMaskWallet({ ...walletsOptions })];

/**
 * wagmi connectors for the wagmi context
 */
export const wagmiConnectors = connectorsForWallets([
  {
    groupName: "Supported Wallets",
    wallets,
  },
]);
