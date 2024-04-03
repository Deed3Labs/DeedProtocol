import React, { useCallback, useEffect, useMemo, useState } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import Link from "next/link";
import { withRouter } from "next/router";
import ValidationProcedures from "../../components/ValidationProcedures";
import PropertyDetails from "../../components/ValidationPropertyDetails";
import PropertyOverview from "../../components/ValidationPropertyOverview";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import useRegistrationClient from "~~/clients/registrations.client";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
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
  const isValidator = useIsValidator();

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
    <div className="container py-10">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="flex flex-col gap-4 w-full lg:w-2/3">
          <div className="flex flex-row items-center w-full justify-between">
            <div className="text-2xl">Property Details</div>
            <div className="flex flex-row gap-4">
              <button className="btn border-white border-opacity-10 m-1 btn-square rounded-lg">
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
                <div className="join join-horizontal border border-white border-opacity-10 p-2">
                  <div
                    className="join-item py-2 px-3 text-9px sm:text-[12px] text-zinc-400 cursor-pointer"
                    title="Coming Soon"
                  >
                    Property Overview
                  </div>
                  <div className="join-item py-2 px-3 text-9px sm:text-[12px] bg-base-300 cursor-default">
                    Validation History
                  </div>
                </div>
              <div className="dropdown dropdown-end">
                  <button
                    tabIndex={0}
                    className="btn m-1 border-white border-opacity-10 btn-square rounded-lg"
                  >
                    <EllipsisHorizontalIcon className="h-6" />
                  </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-52"
                >
                  <li>
                    <Link href={`/registration/${deedData.id}`}>
                      <a>Edit</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <PropertyOverview
            deedData={deedData}
            isOwner={isOwner}
            refresh={() => fetchDeedInfo(deedData.id)}
          />
          <PropertyDetails
            propertyDetail={deedData.propertyDetails}
            isOwner={isOwner}
            isValidator={isValidator}
            onChange={handleChange}
            refresh={() => fetchDeedInfo(deedData.id)}
            onSave={handleSave}
          />
        </div>
        <div className="w-full lg:w-1/3">
          <ValidationProcedures
            deedData={deedData}
            onSave={handleSave}
            isDraft={isDraft}
            onRefresh={() => fetchDeedInfo(deedData.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default withRouter(Page);
