import React, { useCallback, useEffect, useMemo, useState } from "react";
import Map from "../../components/map";
import { WithRouterProps } from "next/dist/client/with-router";
import Image from "next/image";
import Link from "next/link";
import { withRouter } from "next/router";
import { TransactionReceipt } from "viem";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import useDeedClient from "~~/clients/deeds.client";
import OverviewPropertyDescription from "~~/components/OverviewPropertyDescription";
import ProfileComponent from "~~/components/ProfilComponent";
import { Address } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import useDeedMint from "~~/hooks/contracts/deed-nft/useDeedMint.hook";
import useDeedUpdate from "~~/hooks/contracts/deed-nft/useDeedUpdate.hook";
import useDeedValidate from "~~/hooks/contracts/deed-nft/useDeedValidate.hook";
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
    stableCoin: getTargetNetwork().stableCoinAddress,
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
  const deedNFTContractAddress =
    // @ts-ignore
    deployedContracts[getTargetNetwork().id.toString()]["DeedNFT"].address;

  useEffect(() => {
    if (router.isReady && !isConnecting) {
      setIsLoading(true);
      fetchDeedInfo(id as string);
    }
  }, [router.isReady, isConnecting, authToken]);

  const pictures = useMemo(() => {
    if (!deedData) return undefined;
    const pictures =
      deedData?.propertyDetails.propertyImages
        ?.filter(x => !!x.fileId && !x.restricted)
        ?.map(image => getTargetNetwork().ipfsGateway + image.fileId) ?? [];
    if (!pictures?.length) {
      for (let index = 1; index <= 6; index++) {
        pictures.push(`/images/residential${index}.png`);
      }
    }
    return pictures;
  }, [deedData]);

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
      const resp = await deedClient.getDeed(id, !deedData.mintedId);
      setErrorCode(undefined);
      setIsLoading(false);
      if (resp.ok && resp.value) {
        setInitialData(resp.value);
        setDeedData(resp.value);
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
    [id, deedData.mintedId, chainId, authToken, primaryWallet?.address, isValidator],
  );

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
      const newDeedData = await uploadFiles(authToken!, deedData, initialData, false);
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
          <div>
            {/* Map and Pictures */}
            <div className="flex flex-row gap-2 sm:gap-4 h-[372x] sm:h-[616px]">
              {/* Map */}
              <div className="w-[70%] sm:w-1/2 h-full bg-[#141414] border border-white border-opacity-10">
                {deedData?.propertyDetails && (
                  <div className="w-full h-full">
                    <Map
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
              <div className="w-[30%] sm:w-1/2 h-full grid grid-rows-4 sm:grid-cols-2 gap-2 sm:gap-4">
                {pictures?.slice(1, 5).map((picture, index) => (
                  <div key={index} className="w-full h-full">
                    <Image alt="" className="object-cover w-full h-full sm:h-full bg-[#141414] border border-white border-opacity-10" src={picture} />
                  </div>
                ))}
              </div>
            </div>
            {/* 2 cols layout */}
            <div className="flex flex-col lg:flex-row mt-8 gap-4">
              <div className="flex flex-col gap-4 w-full lg:w-[63%]">
                <div className="flex flex-row w-full items-center justify-between">
                  <div className="hidden sm:flex items-center text-xl sm:text-2xl w-auto">
                    Property Overview
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
                <div className="flex flex-col border border-white border-opacity-10">
                  <div className="bg-secondary w-full capitalize p-4">ℹ️ Deed Information</div>
                  <div className="flex flex-col p-4 gap-4">
                    <div className="flex flex-row justify-between">
                      <div className="text-sm text-[#8c8e97]">Deed Type</div>
                      <div>Grant/Warranty</div>
                    </div>
                    <div className="flex flex-row justify-between">
                      <div className="text-sm text-[#8c8e97]">Parcel Number</div>
                      <div>006-0153-011-0000</div>
                    </div>
                    <div className="flex flex-row justify-between">
                      <div className="text-sm text-[#8c8e97]">Tax Assessed Value</div>
                      <div>$297,578</div>
                    </div>
                    <div className="flex flex-row justify-between">
                     <div className="text-sm text-[#8c8e97]">GPS Coordinates</div>
                     <div>
                       {deedData.propertyDetails.propertyLatitude}, {deedData.propertyDetails.propertyLongitude}
                     </div>
                    </div>
                    <hr className=" border-white opacity-10 w-full" />
                    <div className="flex flex-row justify-between">
                      <div className="text-sm text-[#8c8e97]">Contract</div>
                      <div>
                        <Address address={deedNFTContractAddress} format="short" />
                      </div>
                    </div>
                    <div className="flex flex-row justify-between">
                      <div className="text-sm text-[#8c8e97]">Transfer Fee</div>
                      <div>2.5%</div>
                    </div>
                  </div>
                </div>
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
