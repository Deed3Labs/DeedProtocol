import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { useDarkMode } from "usehooks-ts";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import "~~/styles/globals.css";

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  // This variable is required for initial client side rendering of correct theme for RainbowKit
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (!scaffoldConfig.dynamicEnvironementId) {
      throw new Error("Missing environment ID");
    }
  }, []);

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  useEffect(() => {
    setIsDarkTheme(isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      {/* <WagmiConfig client={wagmiClient}> */}
      <NextNProgress />
      {/* <RainbowKitProvider
        chains={appChains.chains}
        avatar={BlockieAvatar}
        theme={isDarkTheme ? darkTheme() : lightTheme()}
      > */}
      <DynamicContextProvider
        theme={isDarkTheme ? "dark" : "light"}
        settings={{
          environmentId: scaffoldConfig.dynamicEnvironementId!,
          appName: scaffoldConfig.appName,
          initialAuthenticationMode: "connect-and-sign",
          newToWeb3WalletChainMap: {
            primary_chain: "sepolia", // <-- Here you specify the primary chain which will select the wallet to show
            wallets: {
              // <-- With "wallets" you specify the wallets you want to show for each chain
              evm: "metamask",
            },
          },
        }}
      >
        <DynamicWagmiConnector>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="relative flex flex-col flex-1">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
          <Toaster />
        </DynamicWagmiConnector>
      </DynamicContextProvider>
      {/* </RainbowKitProvider> */}
      {/* </WagmiConfig> */}
    </>
  );
};

export default ScaffoldEthApp;
