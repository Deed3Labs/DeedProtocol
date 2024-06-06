import { AppProps } from "next/app";
import { RainbowKitCustomConnectButton } from "./scaffold-eth/RainbowKitCustomConnectButton";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Toaster } from "react-hot-toast";
import { BackToTop } from "~~/components/BackToTop";
import ErrorBoundary from "~~/components/ErrorBoundary";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { GlobalStoreProvider } from "~~/contexts/global-store.context";
import { PropertiesFilterProvider } from "~~/contexts/property-filter.context";

const Layout = ({ pageProps, Component }: AppProps) => {
  // const connectBtnRef = useRef<HTMLInputElement>(null);
  // useEffect(() => {
  //   setInterval(() => {
  //     const connected = document
  //       .querySelector("#dynamic-widget")
  //       ?.shadowRoot?.querySelector('[data-testid="AccountControl"]');
  //     if (connected) return;
  //     const modal = document
  //       .querySelector('[data-testid="dynamic-modal-shadow"]')
  //       ?.shadowRoot?.querySelector(".modal");
  //     if (modal) return;
  //     const el =
  //       connectBtnRef?.current?.children[0]?.shadowRoot?.querySelector<HTMLButtonElement>("button");
  //     if (el) {
  //       el.click();
  //     }
  //   }, 500);
  // }, []);
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">
          <GlobalStoreProvider>
            <ErrorBoundary>
              <PropertiesFilterProvider>
                <Component {...pageProps} />
              </PropertiesFilterProvider>
            </ErrorBoundary>
          </GlobalStoreProvider>
        </main>
        <Footer />
      </div>
      <Toaster />
      <BackToTop />
      <div className="container pt-10 !hidden">
        {process.env.NEXT_PUBLIC_OFFLINE ? (
          <RainbowKitCustomConnectButton />
        ) : (
          <DynamicWidget
            buttonClassName="dynamic-shadow-dom"
            innerButtonComponent={
              <div className="dynamic-shadow-dom btn-base-300 text-[11px] font-normal uppercase tracking-widest">
                Login
              </div>
            }
          />
        )}
      </div>
    </>
  );
};

export default Layout;
