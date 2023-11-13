import { usePathname, useSearchParams } from "next/dist/client/components/navigation";
import Link from "next/link";

export const ExplorerLinks = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const type = searchParams.get("type");
  return (
    <div className="flex flex-col lg:flex-row flex-nowrap px-1 gap-2 lg:gap-6 text-2xl font-['KronaOne'] m-8">
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
    </div>
  );
};
