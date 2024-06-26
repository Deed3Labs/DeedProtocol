"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import {
  BidModal,
  BuyModal,
  CancelListingModal,
  EditListingModal,
  ListModal,
  useBids,
  useListings,
} from "@reservoir0x/reservoir-kit-ui";
import useFeesClient from "~~/clients/fees.client";
import useContractAddress from "~~/hooks/useContractAddress";
import useIsOwner from "~~/hooks/useIsOwner.hook";
import useWallet from "~~/hooks/useWallet";
import { DeedInfoModel } from "~~/models/deed-info.model";
import logger from "~~/services/logger.service";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

interface Props {
  deedData: DeedInfoModel;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const BidOffers = ({ deedData }: Props) => {
  const deedNFTAddresss = useContractAddress("DeedNFT");
  const isOwner = useIsOwner(deedData);
  const tokenWithId = `${deedNFTAddresss}:${deedData.mintedId}`;
  const listOpenState = useState(false);
  const { connectWallet } = useWallet();
  const { fees } = useFeesClient();
  const router = useRouter();
  const listings = useListings({
    token: tokenWithId,
  });

  const bids = useBids({
    normalizeRoyalties: true,
    token: tokenWithId,
  });

  const currency = getTargetNetwork().stableCoin;

  return (
    <div className="flex flex-col border border-white border-opacity-10">
      <div className="flex flex-col p-4 gap-4">
        {deedData.mintedId ? (
          listings.isLoading ? (
            <span className="loading loading-bars loading-lg my-8 mx-auto" />
          ) : (
            <>
              {!listings.data.length || listings.data[0].quantityRemaining === 0 ? (
                <div className="flex flex-row items-center gap-2 w-full justify-between">
                  <div className="text-white/70 font-normal text-base sm:text-lg">Not listed</div>
                  {isOwner && (
                    <ListModal
                      trigger={
                        <button className="btn border-white border-opacity-10 bg-base-300 font-normal text-[10px] sm:text-xs w-fit whitespace-nowrap tracking-wide">
                          List Property
                        </button>
                      }
                      openState={listOpenState}
                      collectionId={deedNFTAddresss}
                      tokenId={deedData.mintedId!.toString()}
                      currencies={[
                        {
                          contract: currency.address,
                          symbol: currency.symbol,
                          decimals: currency.decimals,
                          coinGeckoId: currency.coinGeckoId,
                        },
                      ]}
                      oracleEnabled={true}
                      onListingComplete={() => {
                        notification.success("Property listed");
                      }}
                      onGoToToken={() => {
                        router.push(`/overview/${deedData.id}`);
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
              ) : (
                <div className="flex flex-row justify-between gap-2">
                  {listings.data[0]?.price?.amount?.usd && (
                    <div className="flex items-center justify-start w-1/2 gap-2">
                      <span className="font-bold text-sm sm:text-base">Price:</span>{" "}
                      <span>{formatter.format(listings.data[0]?.price?.amount?.usd)}</span>
                    </div>
                  )}
                  {isOwner ? (
                    <div className="flex gap-2">
                      <EditListingModal
                        trigger={
                          <button className="btn border-white border-opacity-10 bg-base-300 font-normal text-[10px] sm:text-xs flex-1">
                            Edit
                          </button>
                        }
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
                          <button className="btn border-white border-opacity-10 bg-base-300 font-normal text-[10px] sm:text-xs text-error flex-1">
                            Cancel Listing
                          </button>
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
                      <BidModal
                        trigger={
                          <button className="btn border-white border-opacity-10 bg-base-300 font-normal text-[10px] sm:text-xs flex-1 w-fit whitespace-nowrap">
                            Submit An Offer
                          </button>
                        }
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
                        currencies={[
                          {
                            contract: currency.address,
                            symbol: currency.symbol,
                            decimals: currency.decimals,
                            coinGeckoId: currency.coinGeckoId,
                          },
                        ]}
                      />
                      <BuyModal
                        defaultQuantity={1}
                        onConnectWallet={connectWallet}
                        trigger={
                          <button className="btn border-white border-opacity-10 bg-base-300 font-normal text-[10px] sm:text-xs flex-1 w-fit whitespace-nowrap">
                            Buy Now
                          </button>
                        }
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
                    </>
                  )}
                </div>
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
export default BidOffers;
