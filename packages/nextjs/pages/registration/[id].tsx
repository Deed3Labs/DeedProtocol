import React, { useCallback, useEffect, useMemo, useState } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import Link from "next/link";
import { withRouter } from "next/router";
import OtherInformations from "../../components/OtherInformations";
import OwnerInformation from "../../components/OwnerInformation";
import PaymentInformation from "../../components/PaymentInformation";
import PropertyDetails from "../../components/RegPropertyDetails";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import useRegistrationClient from "~~/clients/registrations.client";
import SidePanel from "~~/components/SidePanel";
import {
  DeedInfoModel,
  OwnerInformationModel,
  PropertyDetailsModel,
} from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";
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
    wrapper: "trust",
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

  const _validateForm = () => {
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
          <div className="flex flex-row flex-wrap gap-20 lg:flex-nowrap lg:justify-evenly w-full px-3 xl:px-16">
            <div className="flex flex-col w-full lg:w-2/3">
              {!id && (
                <>
                  <div className="text-5xl font-['Coolvetica'] font-compressed uppercase">
                    First, we’ll need to <br />
                    collect some information
                  </div>
                  <div className="mt-3 text-secondary">
                    You’ll need to complete the form below in order to register, transfer and mint
                    the new
                    <br />
                    Digital Deed that will now represent your property.&nbsp;
                    <Link
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
                <hr className="my-12 opacity-10" />
                <PropertyDetails
                  value={deedData.propertyDetails}
                  onChange={handleChange}
                  readOnly={!isOwner}
                  isDraft={isDraft}
                />
                <hr className="my-12 opacity-10" />
                <OtherInformations
                  value={deedData.otherInformation}
                  onChange={handleChange}
                  readOnly={!isOwner}
                />
                <hr className="my-12 opacity-10" />
                {router.isReady && (
                  <PaymentInformation value={deedData.paymentInformation} onChange={handleChange} />
                )}
              </div>
            </div>
            <div className="w-full lg:w-1/3">
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
          </div>
        )
      ) : (
        <span className="loading loading-bars loading-lg my-8"></span>
      )}
    </div>
  );
};

export default withRouter(Page);
