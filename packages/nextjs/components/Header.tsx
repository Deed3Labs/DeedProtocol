import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { RainbowKitCustomConnectButton } from "./scaffold-eth/RainbowKitCustomConnectButton";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Bars3Icon, HomeModernIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useKeyboardShortcut } from "~~/hooks/useKeyboardShortcut";
import useWallet from "~~/hooks/useWallet";
import logger from "~~/services/logger.service";

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const { primaryWallet, connectWallet } = useWallet();
  const { query, pathname } = useRouter();
  const { id } = query;
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isActive = (href: string) => {
    return router.asPath.includes(href);
  };

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => {
      setIsDrawerOpen(false);
    }, []),
  );

  useKeyboardShortcut(["/"], ev => {
    if (ev.target === searchRef.current) return;
    searchRef.current?.focus();
    ev.preventDefault();
  });

  useEffect(() => {
    if (primaryWallet?.address) {
      logger.setWallet(primaryWallet.address);
    }
  }, [primaryWallet?.address]);

  useEffect(() => {
    if (router.query.login) {
      connectWallet();
    }
  }, [router.query]);

  const isPropertyId = useMemo(() => {
    return search.length === 24 || !Number.isNaN(Number(search));
  }, [search]);

  const handleExplorerClicked = () => {
    setSearch("");
    router.push(`/property-explorer?type=all&search=${search}`);
  };

  const handleDetailsClicked = () => {
    setSearch("");
    router.push(`/overview/${search}`);
  };

  const nav = useMemo(
    () => (
      <>
        <div className="w-full flex flex-col gap-0">
          <div className="flex flex-grow items-center w-full pr-6">
            <input
              ref={searchRef}
              type="search"
              className="hidden lg:flex input border-white border-opacity-10 border-1 text-white/30 text-[13px] font-normal w-full lg:w-80"
              placeholder="Quickly search the entire site"
              onChange={ev => setSearch(ev.target.value)}
              value={search}
            />
            <kbd className="hidden lg:flex bd bg-neutral-focus -ml-11 justify-center items-center text-sm font-normal w-8 h-8 rounded-xl">
              /
            </kbd>
          </div>
          <div className={`hidden lg:dropdown w-full  ${search ? "dropdown-open" : ""}`}>
            <ul className="w-full p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box">
              <li>
                <a onClick={handleExplorerClicked}>
                  <HomeModernIcon className="w-4" /> Explorer ({search})
                </a>
              </li>
              {isPropertyId && (
                <li>
                  <a onClick={handleDetailsClicked}>
                    <MapPinIcon className="w-4" />
                    Details ({search})
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <Link
          className={`text-[11px] sm:text-[11px] uppercase tracking-widest link-default ${
            isActive("explorer")
              ? "text-white pointer-events-none"
              : "text-white/30 hover:text-white"
          }`}
          href="/property-explorer?type=all"
        >
          Explore
        </Link>
        <Link
          className={`text-[11px] sm:text-[11px] uppercase tracking-widest link-default ${
            isActive("/registration/new")
              ? "text-white pointer-events-none"
              : "text-white/30 hover:text-white"
          }`}
          href="/registration/new"
        >
          Register
        </Link>
        <Link
          target="_blank"
          href="https://docs.deedprotocol.org/"
          className="text-[11px] sm:text-[11px] text-white/30 hover:text-white uppercase tracking-widest link-default"
        >
          Docs
        </Link>
        {/* <Link href="/property-explorer?type=lease">About</Link> */}
      </>
    ),
    [pathname, id, search],
  );

  return (
    <>
      <div className="sticky top-0 navbar bg-[#0e0e0e] flex-shrink-0 justify-between z-20 w-full py-4 px-1.5 sm:pl-5 sm:pr-4">
        <div className="flex navbar-start w-full xl:w-1/2">
          <div className="lg:hidden dropdown border-0" ref={burgerMenuRef}>
            <label
              tabIndex={0}
              className={`ml-0 btn bg-[#0e0e0e] ${
                isDrawerOpen ? "hover:bg-[#0e0e0e]" : "hover:bg-[#0e0e0e]"
              }`}
              onClick={() => {
                setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
              }}
            >
              <Bars3Icon className="h-1/2" />
            </label>
            {isDrawerOpen && (
              <ul
                tabIndex={0}
                className="menu menu-compact bg-[#0e0e0e] dropdown-content left-0 mt-2 px-3.5 pb-5 border-y border-white border-opacity-10 flex flex-col w-screen gap-4 sm:gap-3"
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
              >
                {nav}
              </ul>
            )}
          </div>
          <Link
            href="/"
            passHref
            className="lg:flex gap-1 ml-2 sm:ml-4 mr-0 hover:!no-underline flex items-start"
          >
            <svg
              width="121"
              height="34"
              viewBox="0 0 121 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onDoubleClick={() => {
                router.push("/admin");
              }}
            >
              <path
                d="M5.43 28H2.4V10.81H0.27V8.08H7.59V10.81H5.43V28ZM15.7716 28H12.7116V18.73H11.3616V28H8.30156V8.08H11.3616V16H12.7116V8.08H15.7716V28ZM22.5298 28H16.7098V8.08H22.3498V10.81H19.7098V16.18H22.0198V18.94H19.7098V25.27H22.5298V28ZM29.7783 28H25.9383V8.08H29.7783C32.1483 8.08 33.3183 9.28 33.3183 11.68V24.22C33.3183 26.86 32.0883 28 29.7783 28ZM28.9383 25.27H29.5683C30.0183 25.27 30.2583 24.7 30.2583 23.56V12.37C30.2583 11.32 29.9583 10.81 29.3583 10.81H28.9383V25.27ZM40.0786 28H34.2586V8.08H39.8986V10.81H37.2586V16.18H39.5686V18.94H37.2586V25.27H40.0786V28ZM46.5532 28H40.7332V8.08H46.3732V10.81H43.7332V16.18H46.0432V18.94H43.7332V25.27H46.5532V28ZM51.0478 28H47.2078V8.08H51.0478C53.4178 8.08 54.5878 9.28 54.5878 11.68V24.22C54.5878 26.86 53.3578 28 51.0478 28ZM50.2078 25.27H50.8378C51.2878 25.27 51.5278 24.7 51.5278 23.56V12.37C51.5278 11.32 51.2278 10.81 50.6278 10.81H50.2078V25.27ZM62.602 20.44H61.342V28H58.282V8.08H62.602C64.762 8.08 65.572 9.25 65.572 11.23V17.32C65.572 19.3 64.762 20.44 62.602 20.44ZM61.342 10.81V17.83H61.972C62.452 17.83 62.692 17.47 62.692 16.84V11.59C62.692 11.05 62.452 10.81 61.972 10.81H61.342ZM69.3094 28H66.3094V8.08H70.6594C72.8194 8.08 73.5994 9.25 73.5994 11.23V15.7C73.5994 17.02 72.9694 17.92 71.9794 18.1V18.22C72.9694 18.37 73.6594 18.97 73.6594 20.62V28H70.6594V20.35C70.6594 19.81 70.4494 19.51 69.9694 19.51H69.3094V28ZM70.6594 16.03V11.59C70.6594 11.05 70.4194 10.81 69.9094 10.81H69.3094V17.02H69.9094C70.4194 17.02 70.6594 16.66 70.6594 16.03ZM81.7732 12.01V24.25C81.7732 26.86 80.4532 28.15 78.1132 28.15C75.7132 28.15 74.3932 26.74 74.3932 24.22V11.95C74.3932 9.43 75.7432 7.96 78.0832 7.96C80.4232 7.96 81.7732 9.46 81.7732 12.01ZM78.7732 24.46V11.68C78.7732 11.08 78.5332 10.78 78.0832 10.78C77.6332 10.78 77.4232 11.08 77.4232 11.68V24.46C77.4232 25.06 77.6332 25.36 78.0832 25.36C78.5332 25.36 78.7732 25.06 78.7732 24.46ZM87.3734 28H84.3434V10.81H82.2134V8.08H89.5334V10.81H87.3734V28ZM97.3005 12.01V24.25C97.3005 26.86 95.9805 28.15 93.6405 28.15C91.2405 28.15 89.9205 26.74 89.9205 24.22V11.95C89.9205 9.43 91.2705 7.96 93.6105 7.96C95.9505 7.96 97.3005 9.46 97.3005 12.01ZM94.3005 24.46V11.68C94.3005 11.08 94.0605 10.78 93.6105 10.78C93.1605 10.78 92.9505 11.08 92.9505 11.68V24.46C92.9505 25.06 93.1605 25.36 93.6105 25.36C94.0605 25.36 94.3005 25.06 94.3005 24.46ZM102.535 24.46V19.87H105.385V24.25C105.385 26.86 104.155 28.15 101.815 28.15C99.4151 28.15 98.1551 26.74 98.1551 24.22V11.83C98.1551 9.22 99.3551 7.96 101.785 7.96C104.095 7.96 105.385 9.07 105.385 11.8V15.22H102.535V11.68C102.535 11.08 102.295 10.78 101.845 10.78C101.395 10.78 101.185 11.08 101.185 11.68V24.46C101.185 25.09 101.335 25.36 101.815 25.36C102.295 25.36 102.535 25.09 102.535 24.46ZM113.619 12.01V24.25C113.619 26.86 112.299 28.15 109.959 28.15C107.559 28.15 106.239 26.74 106.239 24.22V11.95C106.239 9.43 107.589 7.96 109.929 7.96C112.269 7.96 113.619 9.46 113.619 12.01ZM110.619 24.46V11.68C110.619 11.08 110.379 10.78 109.929 10.78C109.479 10.78 109.269 11.08 109.269 11.68V24.46C109.269 25.06 109.479 25.36 109.929 25.36C110.379 25.36 110.619 25.06 110.619 24.46ZM120.413 28H114.473V8.08H117.533V25.21H120.413V28Z"
                fill="white"
              />
            </svg>
            <span className="!hover:no-underline font-normal uppercase text-[11px] sm:text-[11px] text-[#ffc867]">
              Beta
            </span>
          </Link>
          <div className="hidden lg:block w-full">
            <div className="flex px-1 text-opacity-60 gap-6 font-medium mx-8 items-center">
              {nav}
            </div>
          </div>
        </div>
        <div className="navbar-end flex-grow mr-2 sm:mr-5">
          {process.env.NEXT_PUBLIC_OFFLINE ? (
            <RainbowKitCustomConnectButton />
          ) : (
            <DynamicWidget
              buttonClassName="dynamic-shadow-dom bg-[#0e0e0e] text-[11px] font-normal uppercase tracking-widest"
              innerButtonComponent={
                <div className="dynamic-shadow-dom bg-[#0e0e0e] text-[11px] font-normal uppercase tracking-widest">
                  Login
                </div>
              }
            />
          )}
        </div>
      </div>
    </>
  );
};
