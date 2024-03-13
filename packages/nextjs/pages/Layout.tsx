import { useEffect, useRef } from "react";
import { AppProps } from "next/app";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Toaster } from "react-hot-toast";
import { BackToTop } from "~~/components/BackToTop";
import ErrorBoundary from "~~/components/ErrorBoundary";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";

const Layout = ({ pageProps, Component }: AppProps) => {
  const connectBtnRef = useRef<HTMLInputElement>(null);
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
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
      <Toaster />
      <BackToTop />
      <div className="container pt-10 !hidden" ref={connectBtnRef}>
        <DynamicWidget
          buttonClassName="btn btn-neutral"
          innerButtonComponent={<div className="btn btn-neutral">Connect</div>}
        />
      </div>
    </>
  );
};

export default Layout;
