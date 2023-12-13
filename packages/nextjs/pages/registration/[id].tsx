import React, { useCallback, useEffect, useState } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import Link from "next/link";
import { withRouter } from "next/router";
import OtherInformations from "./OtherInformations";
import OwnerInformation from "./OwnerInformation";
import PaymentInformation from "./PaymentInformation";
import PropertyDetails from "./PropertyDetails";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Address as AddressModel, TransactionReceipt } from "viem";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { BitcoinIcon } from "~~/components/assets/BitcoinIcon";
import { TransactionHash } from "~~/components/blockexplorer";
import { Address } from "~~/components/scaffold-eth";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import useDeedContract from "~~/hooks/contracts/deed-nft/useDeedContract.hook";
import useDeedMint from "~~/hooks/contracts/deed-nft/useDeedMint.hook";
import useDeedUpdate from "~~/hooks/contracts/deed-nft/useDeedUpdate.hook";
import useDeedValidate from "~~/hooks/contracts/deed-nft/useDeedValidate.hook";
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
    paymentType: "crypto",
    stabeleCoin: "0x9D233A907E065855D2A9c7d4B552ea27fB2E5a36",
  },
};

// const defaultData: DeedInfoModel = fakeData;
const defaultData: DeedInfoModel = {
  otherInformation: {
    blockchain: "gnosis",
    wrapper: "llc",
  },
  ownerInformation: {
    ownerType: "individual",
  },
  propertyDetails: {},
  paymentInformation: {
    paymentType: "fiat",
  },
} as DeedInfoModel;

type ErrorCode = "notFound" | "unauthorized";

const Page = ({ router }: WithRouterProps) => {
  // const [step, setStep] = useState(0);
  let { id } = router.query as { id?: string };
  if (id === "new") {
    id = undefined;
  }

  const onDeedMinted = (txnReceipt: TransactionReceipt) => {
    const payload = parseContractEvent(txnReceipt, "DeedNFT", "DeedNFTMinted");
    if (!payload) {
      logger.error({ message: "Error parsing DeedNFTMinted event", txnReceipt });
      return;
    }
    const { deedId } = payload;
    notification.success(`Deed NFT Minted with id ${deedId}`);
    router.push(`?id=${deedId}`);
  };

  const { writeValidateAsync } = useDeedValidate();
  const isValidator = useIsValidator();

  const { authToken, primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<DeedInfoModel>();
  const [deedData, setDeedData] = useState<DeedInfoModel>(defaultData);
  const [errorCode, setErrorCode] = useState<ErrorCode | undefined>(undefined);
  const [isOwner, setIsOwner] = useState(false);
  const { id: chainId } = getTargetNetwork();

  const deedContract = useDeedContract();
  const httpClient = useHttpClient();

  const { writeAsync: mintDeedAsync } = useDeedMint(onDeedMinted);
  const { writeAsync: updateDeedAsync } = useDeedUpdate(() => fetchDeedInfo(+id!));

  useEffect(() => {
    if (!id || !deedContract || !primaryWallet) return;
    deedContract.read.ownerOf([BigInt(id)]).then((owner: AddressModel) => {
      setIsOwner(owner === primaryWallet?.address);
    });
  }, [primaryWallet, id, router.isReady, deedContract]);

  useEffect(() => {
    setIsLoading(true);
    if (router.isReady) {
      if (id == null) {
        setDeedData(defaultData);
        setIsLoading(false);
      } else {
        fetchDeedInfo(+id);
      }
    }
  }, [id, authToken, router.isReady]);

  const handleChange = (ev: LightChangeEvent<DeedInfoModel>) => {
    setDeedData((prevState: DeedInfoModel) => ({ ...prevState, [ev.name]: ev.value }));
  };

  const fetchDeedInfo = useCallback(
    async (id: number) => {
      const resp = await httpClient.get(`/api/deed-info/${id}?chainId=${chainId}`);
      setErrorCode(undefined);
      if (resp?.status === 200) {
        setInitialData(resp.value);
        setDeedData(resp.value);
      } else {
        setErrorCode(resp?.status === 404 ? "notFound" : "unauthorized");
      }
      setIsLoading(false);
    },
    [id, chainId],
  );

  const handleSubmit = async () => {
    if (!validate()) return;
    if (id) {
      if (initialData) {
        await updateDeedAsync(deedData, initialData, +id);
      }
    } else {
      await mintDeedAsync(deedData);
    }
  };

  const handleValidationClicked = () => {
    if (id) {
      writeValidateAsync(+id, true);
    }
  };

  const validate = () => {
    if (!deedData.ownerInformation.ids && !isDev()) {
      notification.error("Owner Information ids is required", { duration: 3000 });
      return false;
    }

    if (!deedData.ownerInformation.articleIncorporation && !isDev()) {
      notification.error("Owner Information articleIncorporation is required", { duration: 3000 });
      return false;
    }

    if (!deedData.propertyDetails.propertyDeedOrTitle && !isDev()) {
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
              Property {errorCode === "notFound" ? "not found" : "restricted"}
            </div>
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
            <button
              onClick={() => router.push("/property-explorer")}
              className="btn btn-lg bg-gray-600"
            >
              Go back to explorer
            </button>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap-reverse gap-8 lg:flex-nowrap lg:justify-evenly w-full px-8 xl:px-32">
            <div className="flex flex-col w-full lg:w-fit lg:ml-64">
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

              <div className="mb-10">
                <OwnerInformation value={deedData.ownerInformation} onChange={handleChange} />
                <PropertyDetails value={deedData.propertyDetails} onChange={handleChange} />
                <OtherInformations value={deedData.otherInformation} onChange={handleChange} />
                <PaymentInformation value={deedData.paymentInformation} onChange={handleChange} />
              </div>
            </div>
            <div className="bg-base-100 p-9 w-full lg:w-3/12 h-fit relative lg:sticky lg:top-32 lg:max-h-[75vh] overflow-y-auto">
              <div className="flex flex-row gap-2">
                <div className="w-7 h-7 pl-0.5 flex-col justify-start items-start inline-flex">
                  <div className="self-stretch h-7 p-2 bg-white rounded-2xl shadow justify-center items-center inline-flex">
                    <div className="w-3 h-3 relative" />
                  </div>
                </div>
                <div className="text-xl w-full whitespace-nowrap">Deed3 (The Deed Protocol)</div>
              </div>

              <div className="m-8">
                {id ? (
                  <>
                    {isOwner && (
                      <div className="text-xl mb-4">
                        Status:{" "}
                        <span className={deedData.isValidated ? "text-success" : "text-warning"}>
                          {deedData.isValidated ? "Verified" : "Waiting for validation"}
                        </span>
                      </div>
                    )}
                    {isValidator && !isOwner && (
                      <>
                        <div className="mb-4">
                          <div className="text-2xl">Payment information:</div>
                          <ul className="flex flex-col gap-2">
                            <li>
                              <div className="text-xl">Type:</div>
                              {deedData.paymentInformation.paymentType === "crypto" ? (
                                <div className="flex flex-row gap-2">
                                  <BitcoinIcon width={24} />
                                  Crypto
                                </div>
                              ) : (
                                <div className="flex flex-row gap-2">
                                  <CurrencyDollarIcon />
                                  Fiat
                                </div>
                              )}
                            </li>
                            {deedData.paymentInformation.paymentType === "crypto" && (
                              <>
                                <li>
                                  <div className="text-xl">Coin:</div>
                                  <Address address={deedData.paymentInformation.stabeleCoin} />
                                </li>
                                <li>
                                  <div className="text-xl">Transaction:</div>
                                  <TransactionHash hash={deedData.paymentInformation.receipt!} />
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                        <button
                          onClick={handleValidationClicked}
                          className="btn btn-lg bg-gray-600"
                        >
                          Validate
                        </button>
                      </>
                    )}
                    {isOwner && (
                      <button onClick={handleSubmit} className="btn btn-lg bg-gray-600">
                        Update
                      </button>
                    )}
                  </>
                ) : (
                  <button onClick={handleSubmit} className="btn btn-lg bg-gray-600">
                    Submit
                  </button>
                )}
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

export default withRouter(Page);
