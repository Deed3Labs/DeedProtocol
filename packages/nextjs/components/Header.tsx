import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { DynamicWidget } from "@dynamic-labs/sdk-react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

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
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const type = searchParams.get("type");
  const navLinks = (
    <>
      <Link
        className={(type !== "all" && type) || pathname === "/agent-explorer" ? "opacity-40" : ""}
        href="/property-explorer?type=all"
      >
        All
      </Link>
      <Link className={type !== "sale" ? "opacity-40" : ""} href="/property-explorer?type=sale">
        For Sale
      </Link>
      <Link className={type !== "lease" ? "opacity-40" : ""} href="/property-explorer?type=lease">
        For Lease
      </Link>
      <Link className={pathname !== "/agent-explorer" ? "opacity-40" : ""} href="/agent-explorer">
        Agent Directory
      </Link>
    </>
  );

  return (
    <>
      <div className="sticky top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-[2000] shadow-md shadow-neutral px-0 sm:px-2 mb-4">
        <div className="navbar-start w-auto lg:w-1/2">
          <div className="lg:hidden dropdown" ref={burgerMenuRef}>
            <label
              tabIndex={0}
              className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
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
                {navLinks}
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
        </div>
        <div className="navbar-end flex-grow mr-4">
          <DynamicWidget
            buttonClassName="btn btn-neutral"
            innerButtonComponent={<div className="btn btn-neutral">Connect</div>}
          />
          <FaucetButton />
        </div>
      </div>
      <ul className="hidden lg:flex lg:flex-nowrap px-1 gap-6 text-2xl font-['KronaOne'] m-8">{navLinks}</ul>
    </>
  );
};
