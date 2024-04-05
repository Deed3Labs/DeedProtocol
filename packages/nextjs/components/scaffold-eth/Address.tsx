import { useEffect, useState } from "react";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { isAddress } from "viem";
import { hardhat } from "viem/chains";
import { useEnsAvatar, useEnsName } from "wagmi";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { getBlockExplorerAddressLink, getTargetNetwork, notification } from "~~/utils/scaffold-eth";

interface TAddressProps {
  address?: string;
  disableAddressLink?: boolean;
  format?: "short" | "long";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  mobilesize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  label?: string;
}

const blockieSizeMap = {
  xs: 6,
  sm: 7,
  base: 8,
  lg: 9,
  xl: 10,
  "2xl": 12,
  "3xl": 15,
};

/**
 * Displays an address (or ENS) with a Blockie image and option to copy address.
 */
export const Address = ({
  address,
  disableAddressLink,
  format,
  size = "base",
  label,
}: TAddressProps) => {
  const [ens, setEns] = useState<string | undefined>();
  const [ensAvatar, setEnsAvatar] = useState<string | undefined>();
  const [addressCopied, setAddressCopied] = useState(false);

  const { data: fetchedEns } = useEnsName({
    address,
    enabled: isAddress(address ?? ""),
    chainId: 1,
  });
  const { data: fetchedEnsAvatar } = useEnsAvatar({
    name: fetchedEns,
    enabled: Boolean(fetchedEns),
    chainId: 1,
    cacheTime: 30_000,
  });

  // We need to apply this pattern to avoid Hydration errors.
  useEffect(() => {
    setEns(fetchedEns ?? undefined);
  }, [fetchedEns]);

  useEffect(() => {
    setEnsAvatar(fetchedEnsAvatar ?? undefined);
  }, [fetchedEnsAvatar]);

  // Skeleton UI
  if (!address) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  // if (!isAddress(address)) {
  //   return <span className="text-error">Wrong address</span>;
  // }
  const isValidAddress = address && isAddress(address);
  const blockExplorerAddressLink = isValidAddress
    ? getBlockExplorerAddressLink(address)
    : undefined;
  let displayAddress = isValidAddress ? address?.slice(0, 5) + "..." + address?.slice(-4) : address;

  if (isValidAddress && ens) {
    displayAddress = ens;
  } else if (format === "long") {
    displayAddress = address;
  }

  return (
  <div className="flex items-center gap-3 my-3">
    <div className="flex-shrink-0">
      <BlockieAvatar
        address={address}
        ensImage={ensAvatar}
        size={(blockieSizeMap[size] * 36) / blockieSizeMap["base"]}
      />
    </div>
    <div className="flex flex-col">
      {label && <div className="text-[10px] font-normal text-zinc-400 uppercase tracking-widest">{label}</div>}
      <div className="flex flex-row">
        {disableAddressLink || !blockExplorerAddressLink ? (
          <span className={`text-${mobilesize} sm:text-${size} font-normal`}>{displayAddress}</span>
        ) : getTargetNetwork().id === hardhat.id ? (
          <span className={`text-${mobilesize} sm:text-${size} font-normal`}>
            <Link href={blockExplorerAddressLink}>{displayAddress}</Link>
          </span>
        ) : (
          <a
            className={`text-${mobilesize} sm:text-${size} font-normal`}
            target="_blank"
            href={blockExplorerAddressLink}
            rel="noopener noreferrer"
          >
            {displayAddress}
          </a>
        )}
        {addressCopied ? (
          <CheckCircleIcon
            className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
            aria-hidden="true"
          />
        ) : (
          <CopyToClipboard
            text={address}
            onCopy={() => {
              notification.info("Copied to clipboard", {
                position: "bottom-right",
              });
              setAddressCopied(true);
              setTimeout(() => {
                setAddressCopied(false);
              }, 800);
            }}
          >
            <DocumentDuplicateIcon
              className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
              aria-hidden="true"
            />
          </CopyToClipboard>
        )}
      </div>
    </div>
  </div>
 );
};  
