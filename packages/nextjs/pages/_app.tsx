import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../components/Layout";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
  ReservoirKitProvider,
  ReservoirKitProviderOptions,
  darkTheme as reservoirDarkTheme,
} from "@reservoir0x/reservoir-kit-ui";
import { LogLevel, ReservoirClientOptions, reservoirChains } from "@reservoir0x/reservoir-sdk";
import NextNProgress from "nextjs-progressbar";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import useFeesClient from "~~/clients/fees.client";
import CONFIG from "~~/config";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.scss";
import { isDev } from "~~/utils/is-dev";

config.autoAddCss = false;

const ScaffoldEthApp = (props: AppProps) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { isDarkMode } = useDarkMode();

  const { fees } = useFeesClient();

  useEffect(() => {
    if (!CONFIG.dynamicEnvironementId) {
      throw new Error("Missing environment ID");
    }
  }, []);

  useEffect(() => {
    setIsDarkTheme(isDarkMode);
  }, [isDarkMode]);

  const reservoirOptions: ReservoirClientOptions & ReservoirKitProviderOptions = {
    apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
    chains: [
      {
        ...reservoirChains[
          (process.env.NEXT_PUBLIC_TARGET_NETWORK ?? "sepolia") as keyof typeof reservoirChains
        ],
        active: true,
      },
    ],
    logLevel: isDev() ? LogLevel.Verbose : LogLevel.Warn,
    automatedRoyalties: fees?.global_automatedRoyalties,
    normalizeRoyalties: fees?.global_normalizeRoyalties,
    marketplaceFees: fees?.global_marketplaceFees,
    source: "app.deed3.io",
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <NextNProgress
        options={{
          showSpinner: false,
        }}
      />
      <WagmiConfig config={wagmiConfig}>
        {process.env.NEXT_PUBLIC_OFFLINE ? (
          <ReservoirKitProvider theme={reservoirDarkTheme()} options={reservoirOptions}>
            <RainbowKitProvider chains={appChains.chains} theme={darkTheme()}>
              <Layout {...props} />
            </RainbowKitProvider>
          </ReservoirKitProvider>
        ) : (
          <DynamicContextProvider
            theme={isDarkTheme ? "dark" : "light"}
            settings={{
              initialAuthenticationMode: "connect-and-sign",
              environmentId: CONFIG.dynamicEnvironementId,
              appName: CONFIG.appName,
              walletConnectors: [EthereumWalletConnectors],
              // evmNetworks: [
              //   {
              //     ...network,
              //     chainId: network.id,
              //     networkId: network.id,
              //     iconUrls: [],
              //     blockExplorerUrls: network.blockExplorer ? [network.blockExplorer] : [],
              //     rpcUrls: Object.keys(network.rpcUrls).map(key => network.rpcUrls[key].http[0]),
              //   },
              // ],
            }}
          >
            <DynamicWagmiConnector>
              <ReservoirKitProvider theme={reservoirDarkTheme()} options={reservoirOptions}>
                <Layout {...props} />
              </ReservoirKitProvider>
            </DynamicWagmiConnector>
          </DynamicContextProvider>
        )}
      </WagmiConfig>
    </>
  );
};

export default ScaffoldEthApp;
