import Link from "next/link";
import { useRouter } from "next/router";
import { TransactionReceipt } from "viem";
import {
  ChatBubbleBottomCenterTextIcon,
  EllipsisHorizontalIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import useDeedMint from "~~/hooks/contracts/deed-nft/useDeedMint.hook";
import { DeedInfoModel } from "~~/models/deed-info.model";
import logger from "~~/services/logger.service";
import { parseContractEvent } from "~~/utils/contract";
import { notification } from "~~/utils/scaffold-eth";

interface Props {
  deedData: DeedInfoModel;
  isOwner?: boolean;
  isValidator?: boolean;
  refresh: () => void;
}

const PropertyOverview = ({ deedData, isOwner, isValidator, refresh }: Props) => {
  const router = useRouter();
  const { writeAsync: writeMintDeedAsync } = useDeedMint(receipt => onDeedMinted(receipt));

  const handleChatClick = () => {
    if (isOwner) {
      window.open("mailto:dev@deed3.io", "_blank");
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/validation/${deedData.id}`;
    navigator.clipboard.writeText(url);
    notification.info("Link copied to clipboard");
  };

  const handleMint = async () => {
    await writeMintDeedAsync(deedData);
  };

  const onDeedMinted = async (txnReceipt: TransactionReceipt) => {
    const payload = parseContractEvent(txnReceipt, "DeedNFT", "DeedNFTMinted");
    if (!payload) {
      logger.error({ message: "Error parsing DeedNFTMinted event", txnReceipt });
      return;
    }
    const { deedId } = payload;
    notification.success(`Deed NFT Minted with id ${deedId}`);
    await router.push(`/validation/${deedId}`);
  };

  return (
    <div className="flex flex-row border border-white border-opacity-10 p-6 gap-6 flex-wrap">
      {deedData?.propertyDetails && (
        <>
          <div className="w-80 h-80 bg-[#141414] flex-grow">
            {/* Image or Map component should go here */}
          </div>
          <div className="flex flex-col gap-6 mt-4 flex-grow justify-between">
            <div className="flex flex-row">
              <div className="text-secondary">Status</div>
              <div className="ml-2 h-6 badge bg-[#ffdc19] text-primary-content rounded-xl">
                Pending validation
              </div>
            </div>
            <div className="text-5xl font-['Coolvetica'] font-extra-condensed font-bold uppercase">
              {deedData.propertyDetails.propertyAddress}
            </div>
            <div className="flex flex-row gap-8 items-center">
              <div className="flex flex-col">
                <div className="text-[10px] font-normal text-zinc-400 uppercase tracking-widest">
                  Owner
                </div>
                <Address address={deedData.owner} size="base" />
              </div>
              <div className="flex flex-col">
                <div className="text-[10px] font-normal text-zinc-400 uppercase tracking-widest">
                  Validator
                </div>
                <Address address="The Deed & Title Co." size="base" />
              </div>
              <button
                className="btn btn-outline w-12 p-3 rounded-md"
                onClick={() => handleChatClick()}
              >
                <ChatBubbleBottomCenterTextIcon className="w-full" />
              </button>
            </div>
            <hr className="border-border"></hr>
            <div className="flex flex-row w-full items-center justify-between">
              <div className="flex flex-row">
                <button
                  className="btn btn-link no-underline text-secondary"
                  onClick={() => handleShare()}
                >
                  <ShareIcon className="h-4" />
                  Share
                </button>
                <button
                  className="btn btn-link no-underline text-secondary"
                  onClick={() => refresh()}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.39 9.82125C15.39 13.05 12.6337 15.8062 9.24748 15.8062C5.86123 15.8062 3.10498 13.05 3.10498 9.82125C3.10498 6.51375 5.86123 3.83625 9.24748 3.83625H12.0037"
                      stroke="#A0A0A0"
                      strokeWidth="0.7875"
                    />
                    <path
                      d="M8.91016 1.15875L12.6902 3.915L8.91016 6.67125"
                      stroke="#A0A0A0"
                      strokeWidth="0.7875"
                    />
                  </svg>
                  Refresh
                </button>
              </div>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn m-1">
                  <EllipsisHorizontalIcon className="h-6" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link href={`/registration/${deedData.id}`}>
                      <a>Edit</a>
                    </Link>
                  </li>
                  {/* Additional dropdown items... */}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyOverview;
