import React, { useCallback, useEffect, useMemo, useState } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import Link from "next/link";
import { withRouter } from "next/router";
import PropertyDetails from "./PropertyDetails";
import PropertyOverview from "./PropertyOverview";
import ValidationProcedures from "./ValidationProcedures";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import useRegistrationClient from "~~/clients/registrations.client";
import useDeedUpdate from "~~/hooks/contracts/deed-nft/useDeedUpdate.hook";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";
import { uploadFiles } from "~~/services/file.service";
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
  // eslint-disable-next-line prefer-const
  let { id } = router.query;

  const { primaryWallet, authToken } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);
  // const { writeAsync: writeMintDeedAsync } = useDeedMint(receipt => onDeedMinted(receipt));
  const [initialData, setInitialData] = useState<DeedInfoModel>(defaultData);
  const [deedData, setDeedData] = useState<DeedInfoModel>(defaultData);
  const [errorCode, setErrorCode] = useState<ErrorCode | undefined>(undefined);
  const { writeAsync: writeUpdateDeedAsync } = useDeedUpdate(() => fetchDeedInfo(deedData!.id!));
  const isDraft = useMemo(() => {
    return !id || Number.isNaN(+id);
  }, [id, router.isReady, deedData]);
  const { id: chainId } = getTargetNetwork();

  const registrationClient = useRegistrationClient();

  const isOwner = useMemo(() => {
    return (deedData && deedData.owner === primaryWallet?.address) || !id;
  }, [deedData?.owner, primaryWallet, id]);

  useEffect(() => {
    if (router.isReady) {
      if (id) {
        setIsLoading(true);
        fetchDeedInfo(id as string);
      }
    }
  }, [id, router.isReady]);

  useEffect(() => {
    if (router.isReady && id && !isLoading) {
      setIsLoading(true);
      fetchDeedInfo(id as string);
    }
  }, [authToken, id, router.isReady]);

  const handleChange = (ev: LightChangeEvent<DeedInfoModel>) => {
    setDeedData((prevState: DeedInfoModel) => ({ ...prevState, [ev.name]: ev.value }));
  };

  const fetchDeedInfo = useCallback(
    async (id: string) => {
      setIsLoading(true);
      const resp = await registrationClient.authentify(authToken!).getRegistration(id, !!isDraft);
      setErrorCode(undefined);
      setIsLoading(false);
      if (resp.ok && resp.value) {
        setInitialData(resp.value);
        setDeedData(resp.value);
      } else {
        if (resp?.status === 404) setErrorCode("notFound");
        else if (resp?.status === 401) setErrorCode("unauthorized");
        else {
          setErrorCode("unexpected");
        }
      }
    },
    [id, isDraft, chainId, authToken],
  );

  const handleErrorClick = async () => {
    if (errorCode === "unexpected") {
      setIsLoading(true);
      await fetchDeedInfo(id as string);
      setIsLoading(false);
    } else {
      router.push("/explorer");
    }
  };
  const handleSave = async () => {
    // if (!validateForm() || !deedData || !authToken) return;
    if (isDraft || !id) {
      // Save in draft
      if (!primaryWallet?.connected) {
        notification.error("Please connect your wallet");
        return;
      }

      let toastId = notification.loading("Uploading documents...");
      const newDeedData = await uploadFiles(authToken!, deedData, initialData, false);
      notification.remove(toastId);
      toastId = notification.loading("Saving...");
      const response = await registrationClient
        .authentify(authToken!)
        .saveRegistration(newDeedData);
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
      if (!deedData.id || !initialData) return;
      // Update on chain
      await writeUpdateDeedAsync(deedData, initialData, deedData.id!);
    }
  };
  return (
    <>
      <div className="container py-10">
        {deedData && !isLoading ? (
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
                      Please connect with the account owner.
                    </>
                  )}
                </div>
              )}

              <button onClick={handleErrorClick} className="btn btn-lg bg-gray-600">
                {errorCode === "unexpected" ? "Retry" : "Go back to explorer"}
              </button>
            </div>
          ) : (
            <div className="flex flex-row w-full flex-wrap gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center w-full justify-between">
                  <div className="text-2xl">Validation History</div>
                  <div className="flex flex-row gap-4">
                    <div className="btn btn-outline m-1 btn-square rounded-lg">
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
                    </div>
                    <div className="join join-horizontal border p-2">
                      <div
                        className="join-item p-2 text-[#626262] cursor-default"
                        title="Comming Soon"
                      >
                        Property Viewer
                      </div>
                      <div className="join-item p-2 bg-base-300 cursor-pointer">
                        Validation History
                      </div>
                    </div>
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className="btn m-1 btn-outline btn-square rounded-lg"
                      >
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
                      </ul>
                    </div>
                  </div>
                </div>
                <PropertyOverview
                  deedData={deedData!}
                  isOwner={isOwner}
                  refresh={() => fetchDeedInfo(deedData!.id!)}
                />
                <PropertyDetails
                  propertyDetail={deedData.propertyDetails}
                  isOwner={isOwner}
                  onChange={handleChange}
                  refresh={() => fetchDeedInfo(deedData!.id!)}
                  onSave={handleSave}
                />
              </div>
              <div className="flex flex-col flex-grow">
                <ValidationProcedures
                  deedData={deedData}
                  onSave={handleSave}
                ></ValidationProcedures>
              </div>
            </div>
          )
        ) : (
          <span className="loading loading-bars loading-lg my-8"></span>
        )}
      </div>
    </>
  );
};

export default withRouter(Page);
