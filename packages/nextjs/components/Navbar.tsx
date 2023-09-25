import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const Navbar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const type = searchParams.get("type");

  return (
    <div className="MainFilterOptions justify-start items-center gap-6 inline-flex font-['Krona_One'] text-2xl">
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

export default Navbar;
