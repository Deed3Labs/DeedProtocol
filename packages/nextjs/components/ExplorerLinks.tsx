import { usePathname, useSearchParams } from "next/dist/client/components/navigation";
import Link from "next/link";

const ExplorerLinks = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const type = searchParams.get("type");
  return (
    <div className="grid grid-flow-col-dense auto-cols-auto grid-cols-4 px-1 gap-2 lg:gap-6 text-4xl sm:text-6xl m-8 font-['Coolvetica'] font-extra-condensed font-bold uppercase">
      <Link
        className={`${
          (type !== "all" && type) || pathname === "/agent-explorer" ? "opacity-40" : ""
        } link-default`}
        href="/property-explorer?type=all"
      >
        All
      </Link>
      <Link
        className={`${type !== "sale" ? "opacity-40" : ""} link-default`}
        href="/property-explorer?type=sale"
      >
        For Sale
      </Link>
      <Link
        className={`${type !== "lease" ? "opacity-40" : ""} link-default`}
        href="/property-explorer?type=lease"
      >
        For Lease
      </Link>
      <Link
        className={`${pathname !== "/agent-explorer" ? "opacity-40" : ""} link-default`}
        href="/agent-explorer"
      >
        Agent Directory
      </Link>
    </div>
  );
};

export default ExplorerLinks;
