import { useEffect, useState } from "react";
import Link from "next/link";
import { NextRouter } from "next/router";
import MarketLogo from "../pages/registration/assets/MarketLogo";
import QuoteDetail, { USDollar } from "./scaffold-eth/QuoteDetail";
import { ExternalLinkIcon } from "@dynamic-labs/sdk-react-core";
import { TransactionReceipt, isAddress } from "viem";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import useDeedClient from "~~/clients/deeds.client";
import useFileClient, { FileClient } from "~~/clients/files.client";
import usePaymentClient from "~~/clients/payments.client";
import useQuoteClient from "~~/clients/quotes.client";
import { TransactionHash } from "~~/components/blockexplorer";
import { Address } from "~~/components/scaffold-eth";
import CONFIG from "~~/config";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import useDeedMint from "~~/hooks/contracts/deed-nft/useDeedMint.hook";
import useDeedUpdate from "~~/hooks/contracts/deed-nft/useDeedUpdate.hook";
import useDeedValidate from "~~/hooks/contracts/deed-nft/useDeedValidate.hook";
import useCryptoPayement from "~~/hooks/useCryptoPayment.hook";
import useIsOwner from "~~/hooks/useIsOwner.hook";
import useWallet from "~~/hooks/useWallet";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { QuoteModel } from "~~/models/quote.model";
import { TokenModel } from "~~/models/token.model";
import { uploadFiles } from "~~/services/file.service";
import logger from "~~/services/logger.service";
import { parseContractEvent } from "~~/utils/contract";
import { notification } from "~~/utils/scaffold-eth";
import { sleepAsync } from "~~/utils/sleepAsync";

interface Props {
  stableCoin: TokenModel;
  deedData: DeedInfoModel;
  initialData?: DeedInfoModel;
  refetchDeedInfo: (id?: string) => void;
  router: NextRouter;
}

const SidePanel = ({ deedData, initialData, stableCoin, refetchDeedInfo, router }: Props) => {
  const isValidator = useIsValidator();
  const { writeValidateAsync } = useDeedValidate();
  const { writeAsync: writeUpdateDeedAsync } = useDeedUpdate(() => refetchDeedInfo());
  const { writeAsync: writeMintDeedAsync } = useDeedMint(receipt => onDeedMinted(receipt));
  const { writeAsync: writeCryptoPayement } = useCryptoPayement();
  const { primaryWallet, authToken } = useWallet();
  const [quoteDetails, setQuoteDetails] = useState<QuoteModel>();
  const [appraisalInspection, setAppraisalInspection] = useState(false);
  const [advancedPlan, setAdvancedPlan] = useState(false);
  const registrationClient = useDeedClient();
  const paymentClient = usePaymentClient();
  const quoteClient = useQuoteClient();
  const deedClient = useDeedClient();
  const isOwner = useIsOwner(deedData);
  const fileClient = useFileClient();

  useEffect(() => {
    if (!quoteDetails) {
      quoteClient.getQuote({ appraisalAndInspection: appraisalInspection }).then(quote => {
        setQuoteDetails(quote);
      });
    }
  }, [appraisalInspection]);

  const handleSubmit = async () => {
    if (!validateForm() || !deedData || !authToken) return;

    if (!deedData.mintedId || !deedData.id) {
      // Save in draft
      if (!primaryWallet?.connected) {
        notification.error("Please connect your wallet");
        return;
      }

      let toastId = notification.loading("Uploading documents...");
      const newDeedData = await uploadFiles(fileClient, authToken!, deedData, initialData, false);
      notification.remove(toastId);
      toastId = notification.loading("Saving...");
      const response = await registrationClient.saveDeed(newDeedData);
      notification.remove(toastId);

      if (!response.ok || !response || !response.value) {
        notification.error(response.status === 453 ? response.error : "Error saving registration");
        return;
      }

      if (primaryWallet.address !== deedData.ownerInformation.walletAddress) {
        notification.warning("Please connect to the specified wallet to continue");
        await sleepAsync(2000);
      }

      if (!deedData.paymentInformation.receipt) {
        if (await handlePayment(response.value)) {
          await router.push(`/validation/${response.value}`);
        } else {
          await router.push(`/registration/${response.value}`);
        }
      }

      notification.success("Successfully updated");
      refetchDeedInfo();
    } else {
      if (!deedData.mintedId || !initialData) return;

      // Update on chain
      await writeUpdateDeedAsync(deedData, initialData);
    }
  };

  const validateForm = () => {
    if (!deedData.ownerInformation.walletAddress && primaryWallet?.address) {
      deedData.ownerInformation.walletAddress = primaryWallet?.address;
    }

    if (!isAddress(deedData.ownerInformation.walletAddress)) {
      notification.error("Owner Information walletAddress is invalid", { duration: 3000 });
      return false;
    }

    // if (!deedData.ownerInformation.ids) {
    //   notification.error("Owner Information ids is required", { duration: 3000 });
    //   return false;
    // }

    // if (!deedData.ownerInformation.articleIncorporation) {
    //   notification.error("Owner Information articleIncorporation is required", { duration: 3000 });
    //   return false;
    // }

    // if (!deedData.propertyDetails.propertyDeedOrTitle) {
    //   notification.error("Property details Deed or Title is required", { duration: 3000 });
    //   return false;
    // }

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

  const handlePayment = async (_id: string) => {
    if (!authToken) {
      notification.error("Please connect your wallet");
      return;
    }

    if (deedData.paymentInformation.paymentType === "crypto") {
      const toastId = notification.loading("Submiting payment...");
      const hash = await writeCryptoPayement();
      if (!hash) {
        notification.remove(toastId);
        return false;
      }
      const response = await paymentClient.submitPaymentReceipt(_id, hash?.toString());
      notification.remove(toastId);
      if (!response.ok) {
        notification.error("Error submiting payment");
        return false;
      }
      return true;
    } else if (deedData.paymentInformation.paymentType === "fiat") {
      location.href = `${CONFIG.paymentLink}?client_reference_id=${_id}`;
    }
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
      await deedClient.saveDeed(deedData);
      await router.push(`/validation/${deedId}`);
    }
  };

  const mintDeedNFT = async () => {
    await writeMintDeedAsync(deedData);
  };

  const handleValidationClicked = async () => {
    if (deedData.id) {
      await writeValidateAsync(deedData, !deedData.isValidated);
      refetchDeedInfo();
    }
  };

  return (
    <div className="bg-base-300 w-[500] min-h-fit relative lg:sticky lg:top-32 py-2 border border-white border-opacity-10">
      <div className="m-8">
        <div className="flex flex-row gap-2">
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-row gap-1 items-center">
              <MarketLogo />
              Deed3 (The Deed Protocol)
            </div>
            {deedData &&
              (quoteDetails ? (
                <>
                  <div className="text-[54px]/none font-['Coolvetica'] font-extra-condensed font-bold uppercase">
                    STANDARD <br />
                    PROPERTY LISTING
                  </div>

                  <div className="quote-detail-container space-y-3">
                    <QuoteDetail
                      title="Legal Wrapper"
                      secondary="NOMINEE TRUST WRAPPER"
                      price={quoteDetails.legalWrapperFees}
                    />
                    <QuoteDetail
                      title="Document Notarization"
                      secondary="ONLINE DOCUMENT SIGNING"
                      price={quoteDetails.documentNotarizationFees}
                    />
                    <QuoteDetail
                      title="State & County Filing Fees"
                      secondary="GRANT DEED-COUNTY CLERK"
                      price={quoteDetails.stateAndCountyFees}
                    />
                    <QuoteDetail
                      title="Preliminary Title Report"
                      secondary="PROPERTY HISTORY VERIFICATION"
                      price={quoteDetails.titleReportFees}
                    />
                  </div>

                  <div className="border p-4 rounded border-white border-opacity-10 gap-4 flex flex-col">
                    <QuoteDetail
                      title="Syndicated Listing"
                      secondary="ONE-TIME FEE"
                      price={quoteDetails.advancedPlan}
                    />
                    <hr className="opacity-25" />
                    <div className="text-sm flex flex-row gap-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-sm toggle-w-10 toggle-success rounded-full"
                        value={advancedPlan.toString()}
                        onChange={ev => setAdvancedPlan(ev.target.value === "true")}
                      />
                      <span className="text-[10px] text-[#ffffff] tracking-widest">
                        SUBSCRIBE TO GET
                        <span className="mx-1 p-1 bg-[#cbf4c9] text-[10px] text-[#0e6245] tracking-normal">
                          50% OFF
                        </span>{" "}
                        TODAY.
                      </span>
                    </div>
                  </div>

                  <div className="text-end font-normal text-[10px] uppercase tracking-widest">
                    <Link
                      href="https://docs.deedprotocol.org/general-information/fees-and-service-charges"
                      target="_blank"
                      className="opacity-90"
                    >
                      Pricing information
                    </Link>
                  </div>

                  <QuoteDetail title="Subtotal" price={quoteDetails.total} />

                  <hr className="opacity-25" />
                  <div className="my-[-8px] text-left font-normal text-[10px] uppercase tracking-widest">
                    <Link href="" target="_blank" className="opacity-90">
                      Add Promo Code
                    </Link>
                  </div>
                  <hr className="opacity-25" />

                  <QuoteDetail title="Total due today" price={quoteDetails.total / 2} />

                  <div className="border py-4 rounded border-white border-opacity-10 gap-4 flex flex-col">
                    <span className="mx-4 font-normal text-[10px] text-zinc-400 uppercase tracking-widest">
                      Add to your order
                    </span>
                    <hr className="opacity-10" />
                    <div className="mx-3 text-sm flex flex-row gap-2 justify-between align-middle">
                      <div className="flex flex-col">
                        <span className="font-normal text-[#f0f0f0]">Appraisal and inspection</span>
                        <span className="text-[#ababab]">
                          {USDollar.format(quoteDetails.appraisalAndInspectionFees)}
                        </span>
                      </div>
                      <button
                        onClick={() => setAppraisalInspection(!appraisalInspection)}
                        className="btn btn-link no-underline"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <span className="loading loading-bars loading-lg m-auto my-8" />
              ))}
          </div>
        </div>

        {deedData.id && (
          <div className="my-8">
            <div className="text-xl mb-4">
              Status:{" "}
              <span className={deedData.isValidated ? "text-success" : "text-warning"}>
                {deedData.isValidated ? "Verified" : "Waiting for validation"}
              </span>
            </div>

            <div className="mb-4">
              <div className="text-2xl">Payment information:</div>
              <ul className="flex flex-col gap-2">
                <li>
                  <div className="text-xl flex flex-row gap2">
                    <span className="mr-2">Type: </span>
                    {deedData.paymentInformation?.paymentType === "crypto" ? (
                      <span className="text-secondary">Crypto</span>
                    ) : (
                      <span className="text-secondary">Fiat</span>
                    )}
                  </div>
                </li>
                {deedData.paymentInformation?.paymentType === "crypto" ? (
                  <>
                    <li>
                      <div className="text-xl">Coin:</div>
                      <Address
                        address={
                          deedData.paymentInformation.stableCoin?.address ?? stableCoin?.address
                        }
                      />
                    </li>
                    <li>
                      <div className="text-xl">Transaction:</div>
                      {deedData.paymentInformation.receipt ? (
                        <TransactionHash hash={deedData.paymentInformation.receipt} />
                      ) : (
                        <span className="text-error">No receipt</span>
                      )}
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <div className="text-xl">Receipt:</div>
                      {deedData.paymentInformation.receipt ? (
                        <Link
                          href={`https://dashboard.stripe.com/test/payments/${deedData.paymentInformation.receipt}`}
                          target="_blank"
                          className="flex items-baseline gap-2"
                        >
                          <ExternalLinkIcon />
                          Open in stripe
                        </Link>
                      ) : (
                        <span className="text-error">No receipt</span>
                      )}
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
        <div className="my-8">
          {isValidator &&
            deedData?.id &&
            (!deedData.mintedId ? (
              <button
                onClick={mintDeedNFT}
                className="btn btn-lg w-full bg-gray-600 text-sm uppercase  tracking-widest"
              >
                Mint
              </button>
            ) : (
              <button
                onClick={handleValidationClicked}
                className="btn btn-lg w-full bg-gray-600 text-sm uppercase  tracking-widest"
              >
                {deedData.isValidated ? "Unvalidate" : "Validate"}
              </button>
            ))}
          <div className="btn-group my-3 flex">
            {deedData.id && !deedData.paymentInformation.receipt && (
              <>
                <button
                  onClick={async () => {
                    await handlePayment(deedData.id!);
                    refetchDeedInfo(deedData.id!);
                  }}
                  className="btn btn-primary btn-lg uppercase text-sm tracking-widest flex-1"
                >
                  Payment needed
                </button>
                <div className="border-l-2 border-solid border-black h-10" />
              </>
            )}

            <button
              onClick={handleSubmit}
              className="btn btn-primary btn-lg uppercase text-sm tracking-widest flex-1"
              disabled={!quoteDetails}
            >
              {deedData.id || deedData.paymentInformation.receipt || (deedData.id && !isOwner)
                ? "Save"
                : "Proceed to payment"}
            </button>
          </div>
          {deedData.id && (
            <div className="w-full flex justify-end">
              {deedData.paymentInformation.receipt && (
                <button
                  onClick={() => router.push(`/validation/${deedData.id}`)}
                  className="btn btn-lg my-3 bg-gray-800 text-sm uppercase tracking-widest"
                >
                  <ArrowRightIcon className="w-8" />
                  Validation page
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-row text-secondary text-[2vw] sm:text-[11px] justify-between">
          <div>
            <span className="text-white opacity-75">Powered by</span>&nbsp;
            <span className="text-white">Deed3Labs</span>
          </div>
          <div className="mx-2">|</div>
          <div className="flex flex-row gap-8 underline decoration-dashed">
            <Link
              target="_blank"
              href="https://www.termsandconditionsgenerator.com/live.php?token=Kz3gxZ7VV5MJ4Qr8muZTviLJck3eZgz2"
              className="link-default text-white opacity-75"
            >
              TERMS
            </Link>
            <Link
              target="_blank"
              href="https://www.termsandconditionsgenerator.com/live.php?token=Kz3gxZ7VV5MJ4Qr8muZTviLJck3eZgz2"
              className="link-default text-white opacity-75"
            >
              PRIVACY POLICY
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SidePanel;
