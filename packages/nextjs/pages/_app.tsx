import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import NextNProgress from "nextjs-progressbar";
import { useDarkMode } from "usehooks-ts";
import CONFIG from "~~/config";
import "~~/styles/globals.scss";

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
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
        {/* Other meta tags */}
      </Head>
      <NextNProgress
        options={{
          showSpinner: false,
        }}
      />
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
          <Layout {...props} />
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </>
  );
};

export default ScaffoldEthApp;
