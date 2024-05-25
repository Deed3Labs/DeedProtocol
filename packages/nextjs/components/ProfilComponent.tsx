import Link from "next/link";
import { Address } from "./scaffold-eth";
import {
  ChatBubbleBottomCenterTextIcon,
  EllipsisHorizontalIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import useIsOwner from "~~/hooks/useIsOwner.hook";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { notification } from "~~/utils/scaffold-eth";

interface Props {
  onRefresh: () => void;
  handleMint: () => void;
  deedData: DeedInfoModel;
  handleValidate: () => void;
}

export default function ProfileComponent({
  deedData,
  onRefresh,
  handleMint,
  handleValidate,
}: Props) {
  const isOwner = useIsOwner(deedData);
  const isValidator = useIsValidator();
  const handleChatClick = () => {
    if (isOwner) {
      const subject = encodeURIComponent(
        `${deedData.propertyDetails.propertyAddress.toUpperCase()} || ${deedData.owner}`,
      );
      window.open(`mailto:validation@deed3.io?subject=${subject}`, "_blank");
    } else {
      // Alert the user that they are not the owner and therefore cannot send the email
      alert("You are not the owner of this property and cannot send the email.");
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/validation/${deedData.id}`;
    navigator.clipboard.writeText(url);
    notification.info("Link copied to clipboard");
  };
  return (
    <>
      <div className="flex flex-row gap-4 items-center">
        <Address address={deedData.owner} label="Owner" size="base" />
        <Address address="The Deed & Title Co." label="Validator" size="base" />
        <button
          className="btn btn-sm sm:btn-sm border border-white border-opacity-10 w-8 p-2 sm:p-1.5 rounded-md"
          onClick={() => handleChatClick()}
        >
          <ChatBubbleBottomCenterTextIcon className="w-full sm:w-4" />
        </button>
      </div>

      <button className="btn btn-secondary btn-lg capitalize w-full my-4 text-sm">
        View owner profile
      </button>

      <hr className="my-0 border-white opacity-10" />
      {/* Buttons */}
      <div className="flex flex-row w-full items-center justify-between">
        <div className="flex flex-row">
          <button
            className="btn btn-link no-underline text-[2.2vw] sm:text-[12px] text-zinc-400 font-normal uppercase tracking-wide"
            onClick={() => handleShare()}
          >
            <ShareIcon className="h-4" />
            Share
          </button>
          <button
            className="btn btn-link no-underline text-[2.2vw] sm:text-[12px] text-zinc-400 font-normal uppercase tracking-wide"
            onClick={() => onRefresh()}
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
          <div tabIndex={0} role="button" className="btn bg-[#0e0e0e] m-1">
            <EllipsisHorizontalIcon className="h-6" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href={`/registration/${deedData.id}`} className="link-default">
                Edit
              </Link>
            </li>
            {isValidator && (
              <>
                {deedData.mintedId ? (
                  <li>
                    <a onClick={() => handleValidate()} className="link-default">
                      {deedData.isValidated ? "Unvalidate" : "Validate"}
                    </a>
                  </li>
                ) : (
                  <li>
                    <a onClick={() => handleMint()} className="link-default">
                      Mint
                    </a>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}