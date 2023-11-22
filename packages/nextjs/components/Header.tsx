import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useKeyboardShortcut } from "~~/hooks/useKeyboardShortcut";
import logger from "~~/services/logger";

// const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
//   const router = useRouter();
//   const isActive = router.pathname === href;
//   return (
//     <Link href={href} passHref className={`${isActive ? "bg-neutral" : ""} `}>
//       {children}
//     </Link>
//   );
// };

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState<string | undefined>();
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const { primaryWallet } = useDynamicContext();

  const pathname = usePathname();

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const searchRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcut(["/"], ev => {
    if (ev.target === searchRef.current) return;
    searchRef.current?.focus();
    ev.preventDefault();
  });

  useEffect(() => {
    if (primaryWallet) {
      logger.setWallet(primaryWallet.address);
    }
  }, [primaryWallet]);

  const nav = (
    <>
      <div className="flex lg:flex-grow lg:items-center w-full lg:pr-14">
        <input
          ref={searchRef}
          className="input input-bordered border-1 w-full lg:w-80"
          placeholder="Quickly search the entire site"
          onChange={() => setSearch(searchRef.current?.value)}
          value={search}
        />
        <kbd className="hidden lg:flex bd bg-neutral-focus -ml-14 justify-center items-center w-10 h-10 rounded-xl">
          /
        </kbd>
      </div>
      <Link
        className={pathname === "/registration" ? "opacity-40 pointer-events-none" : ""}
        href="/registration"
      >
        Register
      </Link>
      <Link
        className={pathname?.includes("explorer") ? "opacity-40 pointer-events-none" : ""}
        href="/property-explorer?type=all"
      >
        Explore
      </Link>
      <Link href="https://docs.deedprotocol.org/">Docs</Link>
      <Link href="/property-explorer?type=lease">About</Link>
    </>
  );

  return (
    <>
      <div className="lg:sticky top-0 navbar bg-base-100 flex-shrink-0 justify-between z-20 shadow-md shadow-neutral px-2">
        <div className="navbar-start w-auto lg:w-1/2">
          <div className="lg:hidden dropdown" ref={burgerMenuRef}>
            <label
              tabIndex={0}
              className={`ml-1 btn btn-ghost ${
                isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"
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
                className="menu menu-compact dropdown-content mt-2 shadow bg-base-100 w-screen font-['KronaOne'] text-2xl gap-2"
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
              >
                {nav}
              </ul>
            )}
          </div>
          <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6">
            <div className="flex relative w-10 h-10">
              <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold leading-tight">Deed3.0</span>
              {/* <span className="text-xs">Decentralized real estate</span> */}
            </div>
          </Link>
          <div className="hidden lg:block w-full">
            <div className="flex px-1 text-opacity-60 gap-6 font-medium font-['Montserrat'] mx-8 items-center">
              {nav}
            </div>
          </div>
        </div>
        <div className="navbar-end flex-grow mr-4">
          <DynamicWidget
            buttonClassName="btn btn-neutral"
            innerButtonComponent={<div className="btn btn-neutral">Connect</div>}
          />
          <FaucetButton />
        </div>
      </div>
    </>
  );
};
