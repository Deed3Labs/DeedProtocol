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
import logger from "~~/services/logger.service";
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
    // Log all the environment variables
    const envVarkeys = [
      "NEXT_PUBLIC_ALCHEMY_API_KEY",
      "NEXT_PUBLIC_MAPBOX_TOKEN",
      "NEXT_PINATA_API_KEY",
      "NEXT_PINATA_API_SECRET",
      "NEXT_PINATA_GATEWAY_KEY",
      "NEXT_PINATA_GATEWAY",
      "NEXT_PUBLIC_IGNORE_BUILD_ERROR",
      "NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID",
      "NEXT_DYNAMIC_PUBLIC_KEY",
      "NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID",
      "NEXT_MANGODB_CONNECTION_STRING",
      "NEXT_STRIPE_SECRET_KEY",
      "NEXT_PUBLIC_PAYMENT_LINK",
      "NEXT_PUBLIC_RESERVOIR_API_KEY",
      "NEXT_PUBLIC_VERBOSE",
      "NEXT_PUBLIC_TARGET_NETWORK",
    ];

    logger.info(
      "Environment variables:",
      JSON.stringify(envVarkeys.map(key => `${key}: ${process.env[key]}`)),
    );

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
          (process.env.NEXT_PUBLIC_TARGET_NETWORK ?? "polygon") as keyof typeof reservoirChains
        ],
        active: true,
      },
    ],
    logLevel: isDev() ? LogLevel.Verbose : LogLevel.Warn,
    automatedRoyalties: fees?.global_automatedRoyalties,
    normalizeRoyalties: fees?.global_normalizeRoyalties,
    marketplaceFees: fees?.global_marketplaceFees,
    source: "deed3.io",
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
