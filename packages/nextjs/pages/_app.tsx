import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { useDarkMode } from "usehooks-ts";
import { BackToTop } from "~~/components/BackToTop";
import ErrorBoundary from "~~/components/ErrorBoundary";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import scaffoldConfig from "~~/scaffold.config";
import "~~/styles/globals.scss";

config.autoAddCss = false;

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  // This variable is required for initial client side rendering of correct theme for RainbowKit
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (!scaffoldConfig.dynamicEnvironementId) {
      throw new Error("Missing environment ID");
    }
  }, []);

  useEffect(() => {
    setIsDarkTheme(isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      <NextNProgress />
      <DynamicContextProvider
        theme={isDarkTheme ? "dark" : "light"}
        settings={{
          environmentId: scaffoldConfig.dynamicEnvironementId,
          appName: scaffoldConfig.appName,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <DynamicWagmiConnector>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="relative flex flex-col flex-1">
              <ErrorBoundary>
                <Component {...pageProps} />
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
          <Toaster />
          <BackToTop />
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </>
  );
};

export default ScaffoldEthApp;
