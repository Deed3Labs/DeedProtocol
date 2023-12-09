import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import OtherInformations from "./OtherInformations";
import OwnerInformation from "./OwnerInformation";
import PropertyDetails from "./PropertyDetails";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { NextPage } from "next";
import { TransactionReceipt } from "viem";
import {
  useDeedNftMint,
  useDeedNftUpdateInfo,
  useDeedNftValidate,
} from "~~/hooks/contracts/deed-nft-hooks";
import useHttpClient from "~~/hooks/useHttpClient";
import {
  DeedInfoModel,
  OwnerInformationModel,
  PropertyDetailsModel,
} from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";
import logger from "~~/services/logger";
import { parseContractEvent } from "~~/utils/contract";
import { isDev } from "~~/utils/is-dev";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

// const steps = [
//   "Owner Information",
//   "Property Details",
//   "Other Informations",
//   "Payment",
//   "Wait for validation",
// ];

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
};

const defaultData: DeedInfoModel = {
  otherInformation: {
    blockchain: "gnosis",
    wrapper: "llc",
  },
  ownerInformation: {
    ownerType: "individual",
  },
  propertyDetails: {},
} as DeedInfoModel;

type ErrorCode = "notFound" | "unauthorized";

const RegistrationForm: NextPage = () => {
  // const [step, setStep] = useState(0);
  const { query, isReady, push } = useRouter();
  const { id } = query as { id: string };

  const onDeedMinted = (txnReceipt: TransactionReceipt) => {
    const payload = parseContractEvent(txnReceipt, "DeedNFT", "DeedNFTMinted");
    if (!payload) {
      logger.error({ message: "Error parsing DeedNFTMinted event", txnReceipt });
      return;
    }
    const { deedId } = payload;
    notification.success(`Deed NFT Minted with id ${deedId}`);
    push(`?id=${deedId}`);
  };

  const { writeAsync: writeDeedNftMintAsync } = useDeedNftMint(onDeedMinted);
  const { writeAsync: writeDeedNftUpdateInfoAsync } = useDeedNftUpdateInfo(onDeedMinted);
  const { writeValidateAsync } = useDeedNftValidate();

  const { authToken } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<DeedInfoModel>(defaultData);
  const [errorCode, setErrorCode] = useState<ErrorCode | undefined>(undefined);

  const httpClient = useHttpClient();

  useEffect(() => {
    setIsLoading(true);
    if (isReady) {
      if (id == null) {
        setIsLoading(false);
      } else {
        fetchDeedInfo(+id);
      }
    }
  }, [id, authToken, isReady]);

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  const handleChange = (ev: LightChangeEvent<DeedInfoModel>) => {
    console.log("Index handleChange", ev.name, ev.value);
    setFormData((prevState: DeedInfoModel) => ({ ...prevState, [ev.name]: ev.value }));
  };

  const fetchDeedInfo = async (tokenId: number) => {
    const chainId = getTargetNetwork().id;
    const resp = await httpClient.get(
      `http://localhost:3000/api/deed-info/${tokenId}?chainId=${chainId}`,
    );
    setErrorCode(undefined);
    if (resp?.status === 200) {
      setFormData(resp.value);
    } else {
      setErrorCode(resp?.status === 404 ? "notFound" : "unauthorized");
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (id) {
      await writeDeedNftUpdateInfoAsync(formData, +id);
    } else {
      await writeDeedNftMintAsync(formData);
    }
  };

  const handleValidationClicked = () => {
    if (id) {
      writeValidateAsync(+id, true);
    }
  };

  const validate = () => {
    if (!formData.ownerInformation.ids && !isDev()) {
      notification.error("Owner Information ids is required", { duration: 3000 });
      return false;
    }

    if (!formData.ownerInformation.articleIncorporation && !isDev()) {
      notification.error("Owner Information articleIncorporation is required", { duration: 3000 });
      return false;
    }

    if (!formData.propertyDetails.propertyDeedOrTitle && !isDev()) {
      notification.error("Property details Deed or Title is required", { duration: 3000 });
      return false;
    }

    for (const field of Object.values(formData.ownerInformation)) {
      if (field instanceof File && field.size / 1024 > 10000) {
        notification.error(`${field.name} is too big. Max size is 10mb`, { duration: 3000 });
        return false;
      }
    }

    for (const field of Object.values(formData.propertyDetails)) {
      if (field instanceof File && field.size / 1024 > 10000) {
        notification.error(`${field.name} is too big. Max size is 10mb`, { duration: 3000 });
        return false;
      }
    }

    for (const field of Object.values(formData.otherInformation)) {
      if (field instanceof File && field.size / 1024 > 10000) {
        notification.error(`${field.name} is too big. Max size is 10mb`);
        return false;
      }
    }

    return true;
  };

  const errorDom = useMemo(() => {
    if (!id) return <></>;
    return (
      <div className="flex flex-col gap-6 mt-6">
        <div className="text-2xl font-['KronaOne'] leading-10">
          Property {errorCode === "notFound" ? "not found" : "restricted"}
        </div>
        <div className="text-base font-normal font-['Montserrat'] leading-normal">
          {errorCode === "notFound" ? (
            <>The property you are looking for does not exist.</>
          ) : (
            <>
              This property is not yet published and has restricted access. Please connect with the
              account owner.
            </>
          )}
        </div>
        <button onClick={() => push("/property-explorer")} className="btn btn-lg bg-gray-600">
          Go back to explorer
        </button>
      </div>
    );
  }, [errorCode]);

  return (
    <div className="container pt-10">
      {!isLoading ? (
        errorCode && id ? (
          errorDom
        ) : (
          <div className="flex flex-row flex-wrap-reverse gap-8 lg:flex-nowrap lg:justify-evenly w-full px-8 xl:px-32">
            <div className="flex flex-col w-full lg:w-fit">
              <div className="text-3xl font-normal font-['KronaOne']">
                First, we’ll need to <br />
                collect some information
              </div>
              <div className="text-base font-normal font-['Montserrat'] mt-3">
                You’ll need to complete the form below in order to register, transfer and mint the
                new
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

              <div>
                <OwnerInformation value={formData.ownerInformation} onChange={handleChange} />
                <PropertyDetails value={formData.propertyDetails} onChange={handleChange} />
                <OtherInformations value={formData.otherInformation} onChange={handleChange} />
                <div className="m-8 w-full text-right">
                  {id ? (
                    <button onClick={handleValidationClicked} className="btn btn-lg bg-gray-600">
                      Validate
                    </button>
                  ) : (
                    <button onClick={handleSubmit} className="btn btn-lg bg-gray-600" />
                  )}
                </div>
              </div>
            </div>
            <div className="bg-base-100 p-9 w-full lg:w-96 h-fit relative lg:sticky lg:top-32 lg:max-h-[75vh] overflow-y-auto">
              <div className="text-base font-bold font-['Montserrat'] leading-normal">
                After your registration is validated you’ll be able to:
              </div>
              <div className="flex flex-row gap-2 my-2">
                <div className="h-6 p-3 rounded-full bg-secondary opacity-10 mt-1"></div>
                <div className="flex flex-col">
                  <div>Manage your property</div>
                  <div className="text-secondary-content">
                    Update property details, view earnings, add managers and etc.
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2 my-2">
                <div className="h-6 p-3 rounded-full bg-secondary opacity-10 mt-1"></div>
                <div className="flex flex-col">
                  <div>Sell or Lease your Property</div>
                  <div className="text-secondary-content">
                    Accept offers, stage auctions and lease properties all in one place.
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2 my-2">
                <div className="h-6 p-3 rounded-full bg-secondary opacity-10 mt-1"></div>
                <div className="flex flex-col">
                  <div>Advertise your Property</div>
                  <div className="text-secondary-content">
                    Customize your pages by adding photos, videos and renderings.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <span className="loading loading-bars loading-lg my-8"></span>
      )}
    </div>
  );
};

export default RegistrationForm;
