import { useCallback } from "react";
import { Address } from "./scaffold-eth";
import {
  AcceptBidModal,
  CancelBidModal,
  EditBidModal,
  useBids,
} from "@reservoir0x/reservoir-kit-ui";
import Countdown from "react-countdown";
import { ClockIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import useFeesClient from "~~/clients/fees.client";
import useContractAddress from "~~/hooks/useContractAddress";
import useIsOwner from "~~/hooks/useIsOwner.hook";
import useWallet from "~~/hooks/useWallet";
import { DeedInfoModel } from "~~/models/deed-info.model";
import logger from "~~/services/logger.service";
import { IconInfoSquare } from "~~/styles/Icons";
import { notification } from "~~/utils/scaffold-eth";

interface Props {
  deedData: DeedInfoModel;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PropertyBidOffers = ({ deedData }: Props) => {
  const deedNFTAddresss = useContractAddress("DeedNFT");
  const isOwner = useIsOwner(deedData);
  const tokenWithId = `${deedNFTAddresss}:${deedData.mintedId}`;
  const { primaryWallet } = useWallet();
  const { fees } = useFeesClient();
  const bids = useBids({
    normalizeRoyalties: true,
    token: tokenWithId,
  });

  const expiration = useCallback((bid: any) => {
    const date = new Date(bid.expiration * 1000);
    const dateString = date.toDateString();
    return <>{dateString === new Date().toDateString() ? <Countdown date={date} /> : dateString}</>;
  }, []);

  return (
    <div className="flex flex-col border border-white border-opacity-10">
      <div className="bg-base-300 w-full text-[10px] sm:text-xs uppercase p-4 flex items-center gap-2 justify-between tracking-widest">
        <div className="flex items-center gap-2">
          {IconInfoSquare}
          Offer Activity
        </div>
        <button
          className="btn btn-link"
          onClick={() => {
            bids.mutate();
          }}
        >
          <ArrowPathIcon className="w-4" />
        </button>
      </div>
      <div className="flex flex-col p-4 gap-4">
        {deedData.mintedId ? (
          bids.isLoading ? (
            <span className="loading loading-bars loading-lg my-8 mx-auto" />
          ) : (
            <>
              <hr className="my-0 border-white opacity-10" />
              <div className="flex flex-col gap-2 w-full">
                {bids.data.length ? (
                  <div>
                    <div className="text-lg">Current Offers</div>{" "}
                    {bids.data.map((bid, index) => {
                      return (
                        <div key={bid.id}>
                          <div className="w-full flex gap-2 items-center justify-between">
                            <Address address={bid.maker} />{" "}
                            <span>
                              {bid?.price?.amount?.usd
                                ? formatter.format(bid.price.amount.usd)
                                : "-"}
                            </span>
                            <div className="flex items-center">
                              <ClockIcon className="w-4 mr-1" /> {expiration(bid)}
                            </div>
                            {isOwner ? (
                              <AcceptBidModal
                                trigger={<button className="btn btn-primary">Accept</button>}
                                tokens={[
                                  {
                                    tokenId: deedData.mintedId!.toString(),
                                    collectionId: deedNFTAddresss,
                                    bidIds: [bid.id],
                                  },
                                ]}
                                onBidAccepted={() => {
                                  notification.success("Offer accepted");
                                }}
                                onClose={() => {
                                  bids.mutate();
                                }}
                                onBidAcceptError={(error, data) => {
                                  logger.error("Bid Acceptance Error", error, data);
                                  notification.error("Error while accepting the offer");
                                }}
                                feesOnTopBps={fees?.acceptBid_feesOnTopBps}
                                normalizeRoyalties={fees?.acceptBid_normalizeRoyalties}
                              />
                            ) : (
                              <>
                                {bid.maker.toLowerCase() ===
                                  primaryWallet?.address.toLowerCase() && (
                                  <div className="flex gap-2">
                                    <EditBidModal
                                      trigger={<button className="btn bg-base-300">Edit</button>}
                                      bidId={bid.id}
                                      collectionId={deedNFTAddresss}
                                      tokenId={deedData.mintedId!.toString()}
                                      onEditBidComplete={() => {
                                        notification.success("Offer edited");
                                      }}
                                      onClose={() => {
                                        bids.mutate();
                                      }}
                                      onEditBidError={(error: any, data: any) => {
                                        logger.error("Bid Edit Error", error, data);
                                        notification.error("Error while editing the bid");
                                      }}
                                      enableOnChainRoyalties={fees?.editBid_enableOnChainRoyalties}
                                      normalizeRoyalties={fees?.editBid_normalizeRoyalties}
                                    />
                                    <CancelBidModal
                                      trigger={
                                        <button className="btn bg-base-300 text-error">
                                          Cancel
                                        </button>
                                      }
                                      onCancelComplete={() => {
                                        notification.success("Offer canceled");
                                      }}
                                      onClose={() => {
                                        bids.mutate();
                                      }}
                                      onCancelError={(error, data) => {
                                        logger.error("Bid Cancelation Error", error, data);
                                        notification.error("Error while canceling the offer");
                                      }}
                                      bidId={bid.id}
                                      normalizeRoyalties={fees?.cancelBid_normalizeRoyalties}
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          {index !== bids.data.length - 1 && (
                            <hr className="my-0 border-white opacity-10" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="m-auto italic">No offers yet</div>
                )}
              </div>
            </>
          )
        ) : (
          <span className="text-warning text-lg mx-auto">This property is not minted yet</span>
        )}
      </div>
    </div>
  );
};
export default PropertyBidOffers;
