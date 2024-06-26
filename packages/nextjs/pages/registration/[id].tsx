import React, { useCallback, useEffect, useState } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import Link from "next/link";
import { withRouter } from "next/router";
import OtherInformations from "../../components/OtherInformations";
import OwnerInformation from "../../components/OwnerInformation";
import PropertyDetails from "../../components/RegPropertyDetails";
import useDeedClient from "~~/clients/deeds.client";
import PaymentInformation from "~~/components/PaymentInformation";
import SidePanel from "~~/components/SidePanel";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import useIsOwner from "~~/hooks/useIsOwner.hook";
import useWallet from "~~/hooks/useWallet";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";
import { isDev } from "~~/utils/is-dev";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

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
  // eslint-disable-next-line prefer-const
  let { id } = router.query;
  if (id === "new") {
    id = undefined;
  }

  const { primaryWallet, authToken, isConnecting } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<DeedInfoModel>();
  const [deedData, setDeedData] = useState<DeedInfoModel>(defaultData);
  const [errorCode, setErrorCode] = useState<ErrorCode | undefined>(undefined);
  const { id: chainId, stableCoin } = getTargetNetwork();

  const deedClient = useDeedClient();

  const isOwner = useIsOwner(deedData, false);
  const isValidator = useIsValidator();

  useEffect(() => {
    if (router.isReady && !isConnecting) {
      if (id) {
        setIsLoading(true);
        fetchDeedInfo(id as string);
      } else {
        setDeedData(defaultData);
        setIsLoading(false);
      }
    }
  }, [id, router.isReady, isConnecting, isOwner, isValidator]);

  useEffect(() => {
    if (!isOwner && !isValidator) {
      setErrorCode("unauthorized");
    } else if (errorCode === "unauthorized") {
      setErrorCode(undefined);
    }
  }, [isValidator, deedData, isOwner]);

  const handleChange = (ev: LightChangeEvent<DeedInfoModel>) => {
    setDeedData((prevState: DeedInfoModel) => ({ ...prevState, [ev.name]: ev.value }));
  };

  const fetchDeedInfo = useCallback(
    async (id: string) => {
      const resp = await deedClient.getDeed(id, !deedData.mintedId);
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

  return (
    <div className="container pt-2 sm:pt-12">
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
          <div className="flex flex-row flex-wrap gap-20 lg:flex-nowrap lg:justify-evenly w-full px-3 xl:px-16">
            <div className="flex flex-col w-full lg:w-2/3">
              {!id && (
                <>
                  <div className="text-[54px]/none sm:text-7xl font-['Coolvetica'] font-extra-condensed font-bold uppercase">
                    First, we’ll need to <br />
                    collect some information
                  </div>
                  <div className="mt-3 text-zinc-400">
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
                <OwnerInformation value={deedData.ownerInformation} onChange={handleChange} />
                <hr className="my-12 border-[#212121]" />
                <PropertyDetails
                  value={deedData.propertyDetails}
                  onChange={handleChange}
                  isDraft={!deedData.mintedId}
                />
                <hr className="my-12 border-[#212121]" />
                <OtherInformations value={deedData.otherInformation} onChange={handleChange} />
                <hr className="my-12 border-[#212121]" />
                {router.isReady && !deedData.paymentInformation.receipt && (
                  <PaymentInformation value={deedData.paymentInformation} onChange={handleChange} />
                )}
              </div>
            </div>
            <div className="w-full lg:w-1/3 mb-10">
              <SidePanel
                stableCoin={stableCoin}
                deedData={deedData}
                initialData={initialData}
                refetchDeedInfo={_id => fetchDeedInfo(_id ?? (id as string))}
                router={router}
              />
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
