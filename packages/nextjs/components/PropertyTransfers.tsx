import { useState } from "react";
import { Address } from "./scaffold-eth";
import {
  AcceptBidModal,
  BidModal,
  BuyModal,
  CancelListingModal,
  ListModal,
  useBids,
  useListings,
} from "@reservoir0x/reservoir-kit-ui";
import { noop } from "lodash-es";
import { ClockIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import useContractAddress from "~~/hooks/useContractAddress";
import useIsOwner from "~~/hooks/useIsOwner.hook";
import { DeedInfoModel } from "~~/models/deed-info.model";
import logger from "~~/services/logger.service";
import { IconInfoSquare } from "~~/styles/Icons";
import { notification } from "~~/utils/scaffold-eth";

interface Props {
  deedData: DeedInfoModel;
  onRefresh: () => void;
}

const PropertyTransfers = ({ deedData, onRefresh }: Props) => {
  const deedNFTAddresss = useContractAddress("DeedNFT");
  const isOwner = useIsOwner(deedData);
  const tokenWithId = `${deedNFTAddresss}:${deedData.mintedId}`;
  const listOpenState = useState(false);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const bids = useBids({
    normalizeRoyalties: true,
    token: tokenWithId,
  });
  const listings = useListings({
    token: tokenWithId,
  });

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
        {listings.isLoading || bids.isLoading ? (
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
                    tokenId={deedData.mintedId?.toString()}
                    currencies={[
                      {
                        contract: "0x0000000000000000000000000000000000000000",
                        symbol: "ETH",
                      },
                    ]}
                    oracleEnabled={true}
                    onGoToToken={() => {
                      listOpenState[1](false);
                    }}
                    onListingComplete={() => {
                      setPendingRefresh(true);
                    }}
                    onClose={() => {
                      if (pendingRefresh) {
                        listings.mutate();
                        bids.mutate();
                        setPendingRefresh(false);
                      }
                    }}
                    onListingError={(error, data) => {
                      notification.error("Error while listing the token");
                      logger.error("Transaction Error", error, data);
                    }}
                  />
                )}
              </div>
            ) : isOwner ? (
              <CancelListingModal
                trigger={<button className="btn bg-secondary text-error">Cancel listing</button>}
                listingId={listings.data[0].id}
                onCancelComplete={() => {
                  notification.success("Listing cancelled");
                  setPendingRefresh(true);
                }}
                onClose={() => {
                  listings.mutate();
                  bids.mutate();
                }}
                onCancelError={(error, data) => {
                  notification.error("Error while cancelling the listing");
                  logger.error("Listing Cancel Error", error, data);
                }}
              />
            ) : (
              <>
                <div className="flex w-full items-center gap-2">
                  {listings.data[0]?.price?.amount?.usd && (
                    <div className="flex items-center justify-start w-1/2 gap-2">
                      <span className="text-lg font-bold">Price:</span>{" "}
                      <span>${(listings.data[0].price.amount.usd / 100) * 100}</span>
                    </div>
                  )}
                  <BuyModal
                    defaultQuantity={1}
                    onConnectWallet={noop}
                    trigger={<button className="btn btn-primary flex-1">Buy</button>}
                    token={tokenWithId}
                    onPurchaseComplete={async () => {
                      setPendingRefresh(true);
                      listings.mutate();
                      bids.mutate();
                      notification.success("Purchase Complete");
                    }}
                    onClose={() => {
                      if (pendingRefresh) {
                        onRefresh();
                        setPendingRefresh(false);
                      }
                    }}
                    onPurchaseError={(error, data) => {
                      notification.error("Purchase Error");
                      logger.error("Reservoir Transaction Error", error, data);
                    }}
                  />
                  <div className="border-l-2 border-solid border-black h-10" />
                  <BidModal
                    trigger={<button className="btn btn-primary flex-1">Make Offer</button>}
                    tokenId={deedData.mintedId?.toString()}
                    collectionId={deedNFTAddresss}
                    onBidComplete={() => {
                      notification.success("Offer submitted");
                      listings.mutate();
                      bids.mutate();
                    }}
                    onBidError={(error, data) => {
                      notification.error("Offer Submition Error");
                      logger.error("Offer Submition Error", error, data);
                    }}
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
                      {bids.data.map((item, index) => {
                        return (
                          <div key={item.id}>
                            <div className="w-full flex gap-2 items-center justify-between">
                              <Address address={item.maker} />{" "}
                              <span>
                                ${" "}
                                {item.price?.amount?.usd
                                  ? Math.floor(item.price.amount.usd * 100) / 100
                                  : "-"}
                              </span>
                              <div className="flex items-center">
                                <ClockIcon className="w-4 mr-1" />{" "}
                                {new Date(item.expiration * 1000).toDateString()}
                              </div>
                              {isOwner && (
                                <AcceptBidModal
                                  tokens={[
                                    {
                                      tokenId: deedData.mintedId!.toString(),
                                      collectionId: deedNFTAddresss,
                                      bidIds: [item.id],
                                    },
                                  ]}
                                  onBidAccepted={() => {
                                    setPendingRefresh(true);
                                    bids.mutate();
                                    listings.mutate();
                                    notification.success("Offer accepted");
                                  }}
                                  onClose={() => {
                                    if (pendingRefresh) {
                                      onRefresh();
                                      setPendingRefresh(false);
                                    }
                                  }}
                                  trigger={<button className="btn btn-primary">Accept</button>}
                                  onBidAcceptError={(error, data) => {
                                    logger.error("Bid Acceptance Error", error, data);
                                    notification.error("Error while accepting the offer");
                                  }}
                                />
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
        )}
      </div>
    </div>
  );
};
export default PropertyTransfers;
