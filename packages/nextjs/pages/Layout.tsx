import { useEffect, useRef } from "react";
import { AppProps } from "next/app";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Toaster } from "react-hot-toast";
import { BackToTop } from "~~/components/BackToTop";
import ErrorBoundary from "~~/components/ErrorBoundary";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";

const Layout = ({ pageProps, Component }: AppProps) => {
  const { primaryWallet } = useDynamicContext();
  const connectBtnRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let interval;
    if (connectBtnRef.current && !primaryWallet) {
      interval = setInterval(() => {
        const el =
          connectBtnRef.current?.children[0]?.shadowRoot?.querySelector<HTMLButtonElement>(
            "button",
          );
        if (el) {
          el.click();
        }
      }, 500);
    } else if (primaryWallet) {
      clearInterval(interval);
    }
  }, [primaryWallet, connectBtnRef.current]);
  return (
    <>
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
    </>
  );

  // ) : (
  //   <div className="container pt-10">
  //     <div className="flex flex-col gap-6 mt-6 align-middle">
  //       <div className="text-2xl leading-10">Not connected to a wallet</div>
  //       <div className="text-base font-normal leading-normal">
  //         This application requires to connect before interacting with it
  //       </div>
  //       <div className="m-auto" ref={connectBtnRef}>
  //         <DynamicWidget
  //           buttonClassName="btn btn-neutral"
  //           innerButtonComponent={<div className="btn btn-neutral">Connect</div>}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Layout;
