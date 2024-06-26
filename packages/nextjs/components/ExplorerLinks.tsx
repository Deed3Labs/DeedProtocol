import { usePathname, useSearchParams } from "next/dist/client/components/navigation";
import Link from "next/link";

const ExplorerLinks = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const type = searchParams.get("type");
  return (
    <div className="flex flex-row lg:flex-row flex-nowrap justify-items-start px-1 gap-3 lg:gap-6 text-[9.8vw] sm:text-[54px] mb-6 sm:mb-8 sm:my-8 font-['Coolvetica'] font-extra-condensed font-bold uppercase">
      <Link
        className={`${
          (type !== "all" && type) || pathname === "/agent-explorer"
            ? "opacity-30 sm:opacity-30"
            : ""
        } link-default`}
        href="/property-explorer?type=all"
      >
        All
      </Link>
      <Link
        className={`${type !== "sale" ? "opacity-30 sm:opacity-30" : ""} link-default`}
        href="/property-explorer?type=sale"
      >
        For Sale
      </Link>
      <Link
        className={`${type !== "lease" ? "opacity-30 sm:opacity-30" : ""} link-default`}
        href="/property-explorer?type=lease"
      >
        For Lease
      </Link>
      <Link
        className={`${
          pathname !== "/agent-explorer" ? "opacity-30 sm:opacity-30" : ""
        } link-default`}
        href="/agent-explorer"
      >
        Agent Directory
      </Link>
    </div>
  );
};

export default ExplorerLinks;
