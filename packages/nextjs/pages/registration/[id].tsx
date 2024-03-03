import React, { useCallback, useEffect, useMemo, useState } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import Link from "next/link";
import { withRouter } from "next/router";
import OtherInformations from "./OtherInformations";
import OwnerInformation from "./OwnerInformation";
import PaymentInformation from "./PaymentInformation";
import PropertyDetails from "./PropertyDetails";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import useRegistrationClient from "~~/clients/registrations.client";
import {
  DeedInfoModel,
  OwnerInformationModel,
  PropertyDetailsModel,
} from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";
import SidePanel from "~~/pages/registration/SidePanel";
import { fetchFileInfos } from "~~/services/file.service";
import logger from "~~/services/logger.service";
import { isDev } from "~~/utils/is-dev";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

const fakeData: DeedInfoModel = {
  ownerInformation: {
    ownerName: "John Doe",
    ownerSuffix: "Jr.",
    ownerType: "individual",
    entityName: "",
    ownerPosition: "",
    ownerState: "CA",
    ownerEntityType: "LLC",
  } as OwnerInformationModel,
  propertyDetails: {
    propertyType: "realEstate",
    propertyAddress: "1234 Main St",
    propertyCity: "San Francisco",
    propertyState: "CA",
    propertyZoning: "commercial",
    propertySize: "0.5 acres",
    propertySubType: "land",
  } as PropertyDetailsModel,
  otherInformation: {
    blockchain: "gnosis",
    wrapper: "llc",
  },
  paymentInformation: {
    paymentType: isDev() ? "crypto" : "fiat",
    stableCoin: getTargetNetwork().stableCoinAddress,
  },
};

const defaultData: DeedInfoModel = false
  ? fakeData
  : ({
      otherInformation: {
        blockchain: "gnosis",
        wrapper: "llc",
      },
      ownerInformation: {
        ownerType: "individual",
      },
      propertyDetails: { propertyType: "realEstate" },
      paymentInformation: {
        paymentType: isDev() ? "crypto" : "fiat",
        stableCoin: getTargetNetwork().stableCoinAddress,
      },
    } as DeedInfoModel);

type ErrorCode = "notFound" | "unauthorized" | "unexpected";

const Page = ({ router }: WithRouterProps) => {
  // eslint-disable-next-line prefer-const
  let { id } = router.query;
  if (id === "new") {
    id = undefined;
  }

  const { primaryWallet, authToken } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<DeedInfoModel>();
  const [deedData, setDeedData] = useState<DeedInfoModel>(defaultData);
  const [errorCode, setErrorCode] = useState<ErrorCode | undefined>(undefined);
  const isDraft = useMemo(() => {
    return !id || Number.isNaN(+id);
  }, [id, router.isReady, deedData]);
  const { id: chainId, stableCoinAddress } = getTargetNetwork();

  const registrationClient = useRegistrationClient();

  const isOwner = useMemo(() => {
    return deedData.owner === primaryWallet?.address || !id;
  }, [deedData.owner, primaryWallet, id]);

  useEffect(() => {
    if (router.isReady) {
      if (id) {
        setIsLoading(true);
        fetchDeedInfo(id as string);
      } else {
        setDeedData(defaultData);
        setIsLoading(false);
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
      const resp = await registrationClient.authentify(authToken!).getRegistration(id, !!isDraft);
      setErrorCode(undefined);
      setIsLoading(false);
      if (resp.ok && resp.value) {
        setInitialData(resp.value);
        setDeedData(resp.value);

        // Fetch file infos in a second time
        if (resp.value === undefined || !resp.ok) {
          logger.error({
            message: "Error getting registration with id " + id,
            status: resp.status,
          });
        } else {
          resp.value = await fetchFileInfos(resp.value, authToken);
          setInitialData(resp.value);
          setDeedData(resp.value);
        }
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

  const validateForm = () => {
    if (!deedData.ownerInformation.ids) {
      notification.error("Owner Information ids is required", { duration: 3000 });
      return false;
    }

    if (!deedData.ownerInformation.articleIncorporation) {
      notification.error("Owner Information articleIncorporation is required", { duration: 3000 });
      return false;
    }

    if (!deedData.propertyDetails.propertyDeedOrTitle) {
      notification.error("Property details Deed or Title is required", { duration: 3000 });
      return false;
    }

    for (const field of Object.values(deedData.ownerInformation)) {
      if (field instanceof File && field.size / 1024 > 10000) {
        notification.error(`${field.name} is too big. Max size is 10mb`, { duration: 3000 });
        return false;
      }
    }

    for (const field of Object.values(deedData.propertyDetails)) {
      if (field instanceof File && field.size / 1024 > 10000) {
        notification.error(`${field.name} is too big. Max size is 10mb`, { duration: 3000 });
        return false;
      }
    }

    for (const field of Object.values(deedData.otherInformation)) {
      if (field instanceof File && field.size / 1024 > 10000) {
        notification.error(`${field.name} is too big. Max size is 10mb`);
        return false;
      }
    }

    return true;
  };

  return (
    <div className="container pt-10">
      {!isLoading ? (
        errorCode && id ? (
          <div className="flex flex-col gap-6 mt-6">
            <div className="text-2xl font-['KronaOne'] leading-10">
              {errorCode === "unexpected" ? (
                "Oops, something went wrong"
              ) : (
                <>Property {errorCode === "notFound" ? "not found" : "restricted"}</>
              )}
            </div>
            {errorCode !== "unexpected" && (
              <div className="text-base font-normal font-['Montserrat'] leading-normal">
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
          <div className="flex flex-row flex-wrap-reverse gap-8 lg:flex-nowrap lg:justify-evenly w-full px-8 xl:px-32">
            <div className="flex flex-col w-full lg:w-fit lg:ml-64">
              {!id && (
                <>
                  <div className="text-3xl font-normal font-['KronaOne']">
                    First, we’ll need to <br />
                    collect some information
                  </div>
                  <div className="text-base font-normal font-['Montserrat'] mt-3">
                    You’ll need to complete the form below in order to register, transfer and mint
                    the new
                    <br />
                    Digital Deed that will now represent your property.&nbsp;
                    <Link
                      className="link link-accent"
                      href="https://docs.deedprotocol.org/how-it-works/property-registration-guide"
                      target="_blank"
                    >
                      Learn about Property Registration.
                    </Link>
                  </div>
                </>
              )}

              <div className="mb-10">
                <OwnerInformation
                  value={deedData.ownerInformation}
                  onChange={handleChange}
                  readOnly={!isOwner}
                />
                <PropertyDetails
                  value={deedData.propertyDetails}
                  onChange={handleChange}
                  readOnly={!isOwner}
                  isDraft={isDraft}
                />
                <OtherInformations
                  value={deedData.otherInformation}
                  onChange={handleChange}
                  readOnly={!isOwner}
                />
                {router.isReady && (
                  <PaymentInformation value={deedData.paymentInformation} onChange={handleChange} />
                )}
              </div>
            </div>
            <SidePanel
              isOwner={isOwner}
              isDraft={isDraft}
              stableCoinAddress={stableCoinAddress}
              deedData={deedData}
              initialData={initialData}
              refetchDeedInfo={_id => fetchDeedInfo(_id ?? (id as string))}
              router={router}
            />
          </div>
        )
      ) : (
        <span className="loading loading-bars loading-lg my-8"></span>
      )}
    </div>
  );
};

export default withRouter(Page);
