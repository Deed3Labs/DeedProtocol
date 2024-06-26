import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLinkIcon } from "@dynamic-labs/sdk-react-core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { getBlockExplorerTxLink, notification } from "~~/utils/scaffold-eth";

export const TransactionHash = ({ hash }: { hash: string }) => {
  const [addressCopied, setAddressCopied] = useState(false);

  const txExplorerLink = useMemo(() => getBlockExplorerTxLink(hash), [hash]);

  return (
    <div className="flex items-center">
      <Link href={txExplorerLink} target="_blank" className="flex flex-row items-center gap-2">
        <ExternalLinkIcon />
        {hash?.substring(0, 6)}...{hash?.substring(hash.length - 4)}
      </Link>
      {addressCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={hash as string}
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
  );
};
