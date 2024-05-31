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
  darkTheme as reservoirDarkTheme,
} from "@reservoir0x/reservoir-kit-ui";
import { LogLevel, reservoirChains } from "@reservoir0x/reservoir-sdk";
import NextNProgress from "nextjs-progressbar";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import CONFIG from "~~/config";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.scss";
import { isDev } from "~~/utils/is-dev";

config.autoAddCss = false;

const ScaffoldEthApp = (props: AppProps) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (!CONFIG.dynamicEnvironementId) {
      throw new Error("Missing environment ID");
    }
  }, []);

  useEffect(() => {
    setIsDarkTheme(isDarkMode);
  }, [isDarkMode]);

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
      {process.env.NEXT_PUBLIC_OFFLINE ? (
        <WagmiConfig config={wagmiConfig}>
          <ReservoirKitProvider theme={reservoirDarkTheme()}>
            <RainbowKitProvider chains={appChains.chains} theme={darkTheme()}>
              <Layout {...props} />
            </RainbowKitProvider>
          </ReservoirKitProvider>
        </WagmiConfig>
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
            <ReservoirKitProvider
              theme={reservoirDarkTheme()}
              options={{
                apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
                chains: [
                  {
                    ...reservoirChains.sepolia,
                    active: true,
                  },
                ],
                source: "localhost",
                automatedRoyalties: true,
                logLevel: isDev() ? LogLevel.Verbose : LogLevel.Warn,
              }}
            >
              <Layout {...props} />
            </ReservoirKitProvider>
          </DynamicWagmiConnector>
        </DynamicContextProvider>
      )}
    </>
  );
};

export default ScaffoldEthApp;
