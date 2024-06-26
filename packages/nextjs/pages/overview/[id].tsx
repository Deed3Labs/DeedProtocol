import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import Image from "next/image";
import Link from "next/link";
import { withRouter } from "next/router";
import Map from "../../components/map";
import { TransactionReceipt } from "viem";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import useDeedClient from "~~/clients/deeds.client";
import useFileClient from "~~/clients/files.client";
import OverviewDeedInformations from "~~/components/OverviewDeedInformations";
import OverviewPropertyDescription from "~~/components/OverviewPropertyDescription";
import ProfileComponent from "~~/components/ProfilComponent";
import PropertyBidOffers from "~~/components/PropertyBidOffers";
import PropertyListBuy from "~~/components/PropertyListBuy";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import useDeedMint from "~~/hooks/contracts/deed-nft/useDeedMint.hook";
import useDeedUpdate from "~~/hooks/contracts/deed-nft/useDeedUpdate.hook";
import useDeedValidate from "~~/hooks/contracts/deed-nft/useDeedValidate.hook";
import useIsOwner from "~~/hooks/useIsOwner.hook";
import useWallet from "~~/hooks/useWallet";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";
import { uploadFiles } from "~~/services/file.service";
import logger from "~~/services/logger.service";
import { parseContractEvent } from "~~/utils/contract";
import { isDev } from "~~/utils/is-dev";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

const defaultData: DeedInfoModel = {
  otherInformation: {
    wrapper: "trust",
  },
  ownerInformation: {
    ownerType: "individual",
  },
  propertyDetails: { propertyType: "realEstate" },
  paymentInformation: {
    paymentType: isDev() ? "crypto" : "fiat",
    stableCoin: getTargetNetwork().stableCoin,
  },
} as DeedInfoModel;

type ErrorCode = "notFound" | "unauthorized" | "unexpected";

const Page = ({ router }: WithRouterProps) => {
  const { id } = router.query;
  const { primaryWallet, authToken, isConnecting } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<DeedInfoModel>(defaultData);
  const [deedData, setDeedData] = useState<DeedInfoModel>(defaultData);
  const [errorCode, setErrorCode] = useState<ErrorCode | undefined>(undefined);
  const { writeAsync: writeUpdateDeedAsync } = useDeedUpdate(() => fetchDeedInfo(deedData!.id!));
  const { writeAsync: writeMintDeedAsync } = useDeedMint(receipt => onDeedMinted(receipt));
  const isValidator = useIsValidator();
  const deedClient = useDeedClient();
  const { writeValidateAsync } = useDeedValidate();
  const { id: chainId } = getTargetNetwork();
  const isOwner = useIsOwner(deedData);
  const fileClient = useFileClient();

  const picturesRef = useRef<string[] | undefined>();

  useEffect(() => {
    if (router.isReady && !isConnecting) {
      setIsLoading(true);
      fetchDeedInfo(id as string);
    }
  }, [router.isReady, isConnecting, authToken]);

  const handleChange = (ev: LightChangeEvent<DeedInfoModel>) => {
    setDeedData((prevState: DeedInfoModel) => ({ ...prevState, [ev.name]: ev.value }));
  };

  const onDeedMinted = async (txnReceipt: TransactionReceipt) => {
    const payload = parseContractEvent(txnReceipt, "DeedNFT", "DeedNFTMinted");
    if (!payload) {
      logger.error({ message: "Error parsing DeedNFTMinted event", txnReceipt });
      return;
    }
    const { deedId } = payload;
    if (deedId) {
      deedData.mintedId = Number(deedId);
      notification.success(`Deed NFT Minted with id ${deedId}`);
      await deedClient.saveDeed(deedData);
    }
    await router.push(`/validation/${deedId}`);
  };

  const fetchDeedInfo = useCallback(
    async (id: string) => {
      setIsLoading(true);
      const resp = await deedClient.getDeed(id, deedData.mintedId !== undefined);
      setErrorCode(undefined);
      setIsLoading(false);
      if (resp.ok && resp.value) {
        setInitialData(resp.value);
        setDeedData(resp.value);
        const pictures =
          resp.value?.propertyDetails.propertyImages
            ?.filter(x => !!x.fileId && !x.restricted)
            ?.map(image => getTargetNetwork().ipfsGateway + image.fileId) ?? [];

        if (pictures.length < 4) {
          for (let index = pictures.length; index < 4; index++) {
            pictures.push(`/images/residential${index + 1}.png`);
          }
        }
        picturesRef.current = pictures;
        if (resp.value.mintedId && id === resp.value.id) {
          await router.replace(`/overview/${resp.value.mintedId}`, undefined, { shallow: true });
        }
      } else {
        if (resp?.status === 404) setErrorCode("notFound");
        else if (resp?.status === 401) setErrorCode("unauthorized");
        else {
          setErrorCode("unexpected");
        }
      }
    },
    [id, deedData.mintedId, chainId, authToken, isValidator],
  ).bind(this);

  const handleErrorClick = async () => {
    if (errorCode === "unexpected") {
      setIsLoading(true);
      await fetchDeedInfo(id as string);
      setIsLoading(false);
    } else {
      router.push("/property-explorer");
    }
  };

  const handleValidate = async () => {
    await writeValidateAsync(deedData, !deedData.isValidated);
  };

  const handleMint = async () => {
    await writeMintDeedAsync(deedData);
  };

  const handleSave = async () => {
    // if (!validateForm() || !deedData || !authToken) return;
    if (!deedData.mintedId || !id) {
      // Save in draft
      if (!primaryWallet?.connected) {
        notification.error("Please connect your wallet");
        return;
      }

      let toastId = notification.loading("Uploading documents...");
      const newDeedData = await uploadFiles(fileClient, authToken!, deedData, initialData, false);
      notification.remove(toastId);
      toastId = notification.loading("Saving...");
      const response = await deedClient.saveDeed(newDeedData);
      notification.remove(toastId);

      if (response.ok && response.value) {
        if (!deedData.id) {
          // await handlePayment(response.value);
          await router.push(`/validation/${response.value}`);
        } else {
          notification.success("Successfully updated");
        }
      } else {
        notification.error("Error saving registration");
      }
    } else {
      if (!deedData.mintedId || !initialData) return;
      // Update on chain
      await writeUpdateDeedAsync(deedData, initialData);
    }
  };

  return (
    <div className="container pt-2 sm:pt-4 pb-10">
      {!isLoading ? (
        errorCode && id ? (
          <div className="flex flex-col gap-6 mt-6">
            <div className="text-2xl leading-10">
              {errorCode === "unexpected" ? (
                "Oops, something went wrong"
              ) : (
                <>Property {errorCode === "notFound" ? "not found" : "restricted"}</>
              )}
            </div>
            {errorCode !== "unexpected" && (
              <div className="text-base font-normal leading-normal">
                {errorCode === "notFound" ? (
                  <>The property you are looking for does not exist.</>
                ) : (
                  <>
                    This property is not yet published and has restricted access.
                    <br />
                    Please connect with the owner wallet.
                  </>
                )}
              </div>
            )}

            <button onClick={handleErrorClick} className="btn btn-lg bg-gray-600">
              {errorCode === "unexpected" ? "Retry" : "Go back to explorer"}
            </button>
          </div>
        ) : (
          <div className="w-full px-0 sm:px-0">
            {/* Property Overview Title and Switcher Buttons */}
            <div className="flex flex-row w-full items-center justify-between mb-4 sm:mb-6">
              <div className="hidden sm:flex items-center text-xl sm:text-2xl w-auto">
                Property Details
              </div>

              <div className="flex flex-row items-center justify-between sm:gap-4 w-full sm:w-auto">
                <button className="btn btn-sm border-white border-opacity-10 m-1 btn-square rounded-lg">
                  <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 12.75V9.25H2M10 2.25V5.75H14"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="join join-horizontal border border-white border-opacity-10 p-1">
                  <div className="join-item py-2 px-3 text-[2.8vw] sm:text-[12px] font-normal  bg-base-300 cursor-default">
                    Property Overview
                  </div>
                  <Link
                    href={`/validation/${id}`}
                    className="join-item py-2 px-3 text-[2.8vw] sm:text-[12px] font-normal !text-zinc-400 !no-underline"
                  >
                    Validation History
                  </Link>
                </div>
                <div className="dropdown dropdown-end">
                  <button
                    tabIndex={0}
                    className="btn btn-sm m-1 border-white border-opacity-10 btn-square rounded-lg"
                  >
                    <EllipsisHorizontalIcon className="h-6" />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-52"
                  >
                    <li>
                      <Link href={`/registration/${deedData.id}`}>Edit</Link>
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
            </div>
            {/* Map and Pictures */}
            <div className="flex flex-row w-full gap-2 sm:gap-4">
              {/* Map */}
              <div className="w-[70%] sm:w-1/2 bg-[#141414] border border-white border-opacity-10">
                {deedData?.propertyDetails && (
                  <div className="w-full h-full sm:h-[616px]">
                    <Map
                      // @ts-ignore
                      center={{
                        lat: deedData.propertyDetails.propertyLatitude || 0,
                        lng: deedData.propertyDetails.propertyLongitude || 0,
                      }}
                      markers={[
                        {
                          id: deedData.id!,
                          name: `${deedData.propertyDetails.propertyAddress}, ${deedData.propertyDetails.propertyCity}, ${deedData.propertyDetails.propertyState}, United States`,
                          lat: deedData.propertyDetails.propertyLatitude || 0,
                          lng: deedData.propertyDetails.propertyLongitude || 0,
                        },
                      ]}
                    />
                  </div>
                )}
              </div>
              {/* Images */}
              <div className="w-[30%] sm:w-1/2 grid grid-rows-4 sm:grid-rows-2 sm:grid-cols-2 gap-2 sm:gap-4">
                {picturesRef.current?.slice(0, 4).map((picture, index) => {
                  return (
                    <div key={index} className="w-full h-[85px] sm:h-[300px]">
                      <Image
                        alt={picture}
                        className="object-cover w-full h-full bg-[#141414] border border-white border-opacity-10"
                        src={picture}
                        width={300}
                        height={85}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* 2 cols layout */}
            <div className="flex flex-col lg:flex-row mt-4 sm:mt-6 gap-4">
              <div className="flex flex-col gap-4 w-full lg:w-[63%]">
                <PropertyListBuy deedData={deedData} />
                <OverviewPropertyDescription
                  onChange={handleChange}
                  onSave={handleSave}
                  onRefresh={() => fetchDeedInfo(deedData.id!)}
                  deedData={deedData}
                />
              </div>
              <div className="flex flex-col gap-4 w-full lg:w-[37%]">
                <div className="border border-white border-opacity-10 p-5 sm:p-6 gap-6 flex-wrap">
                  <ProfileComponent
                    deedData={deedData}
                    handleMint={handleMint}
                    handleValidate={handleValidate}
                    onRefresh={() => fetchDeedInfo(deedData.id!)}
                  />
                </div>
                <OverviewDeedInformations
                  isOwner={isOwner}
                  onSave={handleSave}
                  deedData={deedData}
                  onChange={handleChange}
                />
                <PropertyBidOffers deedData={deedData} />
              </div>
            </div>
          </div>
        )
      ) : (
        <span className="loading loading-bars loading-lg my-8" />
      )}
    </div>
  );
};

export default withRouter(Page);
