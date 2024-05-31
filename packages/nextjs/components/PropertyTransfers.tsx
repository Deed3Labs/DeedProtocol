import { useCallback, useState } from "react";
import { Address } from "./scaffold-eth";
import {
  AcceptBidModal,
  BidModal,
  BuyModal,
  CancelBidModal,
  CancelListingModal,
  EditBidModal,
  EditListingModal,
  ListModal,
  useBids,
  useListings,
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

const PropertyTransfers = ({ deedData }: Props) => {
  const deedNFTAddresss = useContractAddress("DeedNFT");
  const isOwner = useIsOwner(deedData);
  const tokenWithId = `${deedNFTAddresss}:${deedData.mintedId}`;
  const listOpenState = useState(false);
  const { primaryWallet, connectWallet } = useWallet();
  const { fees } = useFeesClient();
  const bids = useBids({
    normalizeRoyalties: true,
    token: tokenWithId,
  });
  const listings = useListings({
    token: tokenWithId,
  });

  const expiration = useCallback((bid: any) => {
    const date = new Date(bid.expiration * 1000);
    const dateString = date.toDateString();
    return <>{dateString === new Date().toDateString() ? <Countdown date={date} /> : dateString}</>;
  }, []);

  return (
    <div className="flex flex-col border border-white border-opacity-10">
      <div className="bg-secondary w-full uppercase p-4 flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          {IconInfoSquare}
          Mortgage loan offers
        </div>
        <button
          className="btn btn-link"
          onClick={() => {
            listings.mutate();
            bids.mutate();
          }}
        >
          <ArrowPathIcon className="w-4" />
        </button>
      </div>
      <div className="flex flex-col p-4 gap-4">
        {deedData.mintedId ? (
          listings.isLoading || bids.isLoading ? (
            <span className="loading loading-bars loading-lg my-8 mx-auto" />
          ) : (
            <>
              {!listings.data.length || listings.data[0].quantityRemaining === 0 ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-warning text-lg">This property is not listed</div>
                  {isOwner && (
                    <ListModal
                      trigger={<button className="btn btn-primary">List property</button>}
                      openState={listOpenState}
                      collectionId={deedNFTAddresss}
                      tokenId={deedData.mintedId!.toString()}
                      currencies={[
                        {
                          contract: "0x0000000000000000000000000000000000000000",
                          symbol: "ETH",
                        },
                      ]}
                      oracleEnabled={true}
                      onListingComplete={() => {
                        notification.success("Property listed");
                      }}
                      onGoToToken={() => {
                        notification.info("Comming soon...");
                      }}
                      onClose={() => {
                        listings.mutate();
                        bids.mutate();
                      }}
                      onListingError={(error, data) => {
                        notification.error("Error while listing the token");
                        logger.error("Transaction Error", error, data);
                      }}
                      normalizeRoyalties={fees?.list_normalizeRoyalties}
                      enableOnChainRoyalties={fees?.list_enableOnChainRoyalties}
                      feesBps={fees?.list_feesBps}
                    />
                  )}
                </div>
              ) : isOwner ? (
                <div className="flex w-full">
                  <EditListingModal
                    trigger={<button className="btn bg-secondary  flex-1">Edit listing</button>}
                    listingId={listings.data[0].id}
                    collectionId={deedNFTAddresss}
                    tokenId={deedData.mintedId!.toString()}
                    onEditListingComplete={() => {
                      notification.success("Listing edited");
                    }}
                    onEditListingError={(error: any, data: any) => {
                      notification.error("Error while editing the listing");
                      logger.error("Edit Listing Error", error, data);
                    }}
                    onClose={() => {
                      listings.mutate();
                      bids.mutate();
                    }}
                    enableOnChainRoyalties={fees?.editList_enableOnChainRoyalties}
                    normalizeRoyalties={fees?.editList_normalizeRoyalties}
                  />
                  <CancelListingModal
                    trigger={
                      <button className="btn bg-secondary text-error flex-1">Cancel listing</button>
                    }
                    listingId={listings.data[0].id}
                    onCancelComplete={() => {
                      notification.success("Listing cancelled");
                    }}
                    onClose={() => {
                      listings.mutate();
                      bids.mutate();
                    }}
                    onCancelError={(error, data) => {
                      notification.error("Error while cancelling the listing");
                      logger.error("Listing Cancel Error", error, data);
                    }}
                    normalizeRoyalties={fees?.cancelList_normalizeRoyalties}
                  />
                </div>
              ) : (
                <>
                  <div className="flex w-full items-center gap-2">
                    {listings.data[0]?.price?.amount?.usd && (
                      <div className="flex items-center justify-start w-1/2 gap-2">
                        <span className="text-lg font-bold">Price:</span>{" "}
                        <span>{formatter.format(listings.data[0]?.price?.amount?.usd)}</span>
                      </div>
                    )}
                    <BuyModal
                      defaultQuantity={1}
                      onConnectWallet={connectWallet}
                      trigger={<button className="btn btn-primary flex-1">Buy</button>}
                      token={tokenWithId}
                      onPurchaseComplete={async () => {
                        notification.success("Purchase Complete");
                      }}
                      onClose={() => {
                        listings.mutate();
                        bids.mutate();
                      }}
                      onPurchaseError={(error, data) => {
                        notification.error("Purchase Error");
                        logger.error("Reservoir Transaction Error", error, data);
                      }}
                      feesOnTopBps={fees?.buy_feesOnTopBps}
                      feesOnTopUsd={fees?.buy_feesOnTopUsd}
                      normalizeRoyalties={fees?.buy_normalizeRoyalties}
                    />
                    <div className="border-l-2 border-solid border-black h-10" />
                    <BidModal
                      trigger={<button className="btn btn-primary flex-1">Make Offer</button>}
                      tokenId={deedData.mintedId!.toString()}
                      collectionId={deedNFTAddresss}
                      onBidComplete={() => {
                        notification.success("Offer submitted");
                      }}
                      onClose={() => {
                        listings.mutate();
                        bids.mutate();
                      }}
                      onBidError={(error, data) => {
                        notification.error("Offer Submition Error");
                        logger.error("Offer Submition Error", error, data);
                      }}
                      feesBps={fees?.bid_feesBps}
                      normalizeRoyalties={fees?.bid_normalizeRoyalties}
                      oracleEnabled={true}
                    />
                  </div>
                </>
              )}
              {!!listings.data.length && (
                <>
                  <hr className="my-0 border-white opacity-10" />
                  <div className="flex flex-col gap-2 w-full">
                    {bids.data.length ? (
                      <div>
                        <div className="text-lg">Current offers</div>{" "}
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
                                      listings.mutate();
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
                                      <div className="flex">
                                        <EditBidModal
                                          trigger={
                                            <button className="btn btn-secondary">Edit</button>
                                          }
                                          bidId={bid.id}
                                          collectionId={deedNFTAddresss}
                                          tokenId={deedData.mintedId!.toString()}
                                          onEditBidComplete={() => {
                                            notification.success("Offer edited");
                                          }}
                                          onClose={() => {
                                            listings.mutate();
                                            bids.mutate();
                                          }}
                                          onEditBidError={(error: any, data: any) => {
                                            logger.error("Bid Edit Error", error, data);
                                            notification.error("Error while editing the bid");
                                          }}
                                          enableOnChainRoyalties={
                                            fees?.editBid_enableOnChainRoyalties
                                          }
                                          normalizeRoyalties={fees?.editBid_normalizeRoyalties}
                                        />
                                        <CancelBidModal
                                          trigger={
                                            <button className="btn bg-secondary text-error">
                                              Cancel
                                            </button>
                                          }
                                          onCancelComplete={() => {
                                            notification.success("Offer canceled");
                                          }}
                                          onClose={() => {
                                            listings.mutate();
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
              )}
            </>
          )
        ) : (
          <span className="text-warning text-lg mx-auto">This property is not minted yet</span>
        )}
      </div>
    </div>
  );
};
export default PropertyTransfers;
