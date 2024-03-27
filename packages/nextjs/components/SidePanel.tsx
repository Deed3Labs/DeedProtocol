import { useEffect, useState } from "react";
import Link from "next/link";
import { NextRouter } from "next/router";
import MarketLogo from "../pages/registration/assets/MarketLogo";
import QuoteDetail, { USDollar } from "./scaffold-eth/QuoteDetail";
import { ExternalLinkIcon, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { TransactionReceipt } from "viem";
import useQuoteClient from "~~/clients/quote.client";
import useRegistrationClient from "~~/clients/registrations.client";
import { TransactionHash } from "~~/components/blockexplorer";
import { Address } from "~~/components/scaffold-eth";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import useDeedMint from "~~/hooks/contracts/deed-nft/useDeedMint.hook";
import useDeedUpdate from "~~/hooks/contracts/deed-nft/useDeedUpdate.hook";
import useDeedValidate from "~~/hooks/contracts/deed-nft/useDeedValidate.hook";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { QuoteModel } from "~~/models/quote.model";
import { uploadFiles } from "~~/services/file.service";
import logger from "~~/services/logger.service";
import { parseContractEvent } from "~~/utils/contract";
import { isDev } from "~~/utils/is-dev";
import { notification } from "~~/utils/scaffold-eth";

interface Props {
  isOwner: boolean;
  isDraft: boolean;
  stableCoinAddress: string;
  deedData: DeedInfoModel;
  initialData?: DeedInfoModel;
  refetchDeedInfo: (id?: string) => void;
  router: NextRouter;
}

const SidePanel = ({
  isOwner,
  deedData,
  initialData,
  isDraft,
  stableCoinAddress,
  refetchDeedInfo,
  router,
}: Props) => {
  const isValidator = useIsValidator();
  const { writeValidateAsync } = useDeedValidate();
  const { writeAsync: writeUpdateDeedAsync } = useDeedUpdate(() => refetchDeedInfo());
  const { writeAsync: writeMintDeedAsync } = useDeedMint(receipt => onDeedMinted(receipt));
  // const { writeAsync: writeCryptoPayement } = useCryptoPayement();
  const { primaryWallet, authToken } = useDynamicContext();
  const [quoteDetails, setQuoteDetails] = useState<QuoteModel>();
  const [appraisalInspection, setAppraisalInspection] = useState(false);
  const [advancedPlan, setAdvancedPlan] = useState(false);
  const registrationClient = useRegistrationClient();
  const quoteClient = useQuoteClient();

  useEffect(() => {
    if (!quoteDetails) {
      quoteClient.getQuote({ appraisalAndInspection: appraisalInspection }).then(quote => {
        setQuoteDetails(quote);
      });
    }
  }, [appraisalInspection]);

  const handleSubmit = async () => {
    // if (!validateForm() || !deedData || !authToken) return;

    if (isDraft || !deedData.id) {
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
          refetchDeedInfo();
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

  // const handlePayment = async (_id: string) => {
  //   if (!authToken) {
  //     notification.error("Please connect your wallet");
  //     return;
  //   }

  //   if (deedData.paymentInformation.paymentType === "crypto") {
  //     const toastId = notification.loading("Submiting payment...");
  //     const hash = await writeCryptoPayement();
  //     if (!hash) {
  //       notification.remove(toastId);
  //       return;
  //     }
  //     const response = await registrationClient
  //       .authentify(authToken!)
  //       .savePaymentReceipt(_id, hash?.toString());
  //     notification.remove(toastId);
  //     if (!response.ok) {
  //       notification.error("Error submiting receipt");
  //     }
  //     await router.push(`/registration/${_id}`);
  //   } else if (deedData.paymentInformation.paymentType === "fiat") {
  //     location.href = `${CONFIG.paymentLink}?client_reference_id=${_id}`;
  //   }
  // };

  const onDeedMinted = async (txnReceipt: TransactionReceipt) => {
    const payload = parseContractEvent(txnReceipt, "DeedNFT", "DeedNFTMinted");
    if (!payload) {
      logger.error({ message: "Error parsing DeedNFTMinted event", txnReceipt });
      return;
    }
    const { deedId } = payload;
    notification.success(`Deed NFT Minted with id ${deedId}`);
    await router.push(`/validation/${deedId}`);
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
    <div className="bg-base-100 w-[500] min-h-fit relative lg:sticky lg:top-32 py-2 border border-white border-opacity-10">
      <div className="m-8">
        <div className="flex flex-row gap-2">
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-row gap-1 items-center">
              <MarketLogo />
              Deed3 (The Deed Protocol)
            </div>
            {deedData &&
              !deedData.id &&
              (quoteDetails ? (
                <>
                  <div className="text-[54px]/none font-['Coolvetica'] font-extra-condensed font-bold uppercase">
                    STANDARD <br /> 
                    PROPERTY LISTING
                  </div>
                 
                  <div className="quote-detail-container space-y-2">
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
                
                  <div className="border p-6 rounded border-secondary border-opacity-25 gap-4 flex flex-col">
                    <QuoteDetail
                      title="Advanced Plan"
                      secondary="BILLED YEARLY"
                      price={quoteDetails.advancedPlan}
                    />
                    <hr />
                    <div className="text-sm flex flex-row gap-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-success rounded-lg"
                        value={advancedPlan.toString()}
                        onChange={ev => setAdvancedPlan(ev.target.value === "true")}
                      />
                      <span className="text-[10px] text-[#f0f0f0] tracking-widest">
                        SUBSCRIBE TO GET
                        <span className="mx-1 p-1 bg-[#cbf4c9] text-[10px] text-[#0e6245] tracking-normal">50% OFF</span> TODAY.
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

                  <hr></hr>

                  <QuoteDetail title="Total due today" price={quoteDetails.total / 2} />

                  <div className="border py-4 rounded border-secondary border-opacity-25 gap-4 flex flex-col">
                    <span className="mx-6 font-normal text-[10px] text-zinc-400 uppercase tracking-widest">Add to your order</span>
                    <hr className="opacity-25" />
                    <div className="mx-6 text-sm flex flex-row gap-2 justify-between align-top">
                      <div className="flex flex-col">
                        <span className="font-normal text-[#f0f0f0]">Appraisal and inspection</span>
                        <span className="text-secondary">
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
                <span className="loading loading-bars loading-lg m-auto my-8"></span>
              ))}
          </div>
        </div>

        <div className="my-8">
          {deedData && deedData.id ? (
            <>
              {(isValidator || isOwner) && (
                <div className="text-xl mb-4">
                  Status:{" "}
                  <span className={deedData.isValidated ? "text-success" : "text-warning"}>
                    {deedData.isValidated ? "Verified" : "Waiting for validation"}
                  </span>
                </div>
              )}
              {isValidator && (isDev() || !isOwner) && (
                <>
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
                              address={deedData.paymentInformation.stableCoin ?? stableCoinAddress}
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
                  {isDraft ? (
                    <button onClick={mintDeedNFT} className="btn btn-lg bg-gray-600">
                      Mint
                    </button>
                  ) : (
                    <button onClick={handleValidationClicked} className="btn btn-lg bg-gray-600">
                      {deedData.isValidated ? "Unvalidate" : "Validate"}
                    </button>
                  )}
                </>
              )}
              {deedData.owner === primaryWallet?.address && (
                <>
                  <button onClick={handleSubmit} className="btn btn-lg bg-gray-600">
                    Save
                  </button>
                  {/* {!deedData.paymentInformation.receipt && deedData?.id && (
                    <button
                      onClick={() => handlePayment(deedData.id!)}
                      className="btn btn-lg bg-gray-600"
                    >
                      Pay
                    </button>
                  )} */}
                </>
              )}
            </>
          ) : (
            <button
              onClick={handleSubmit}
              className="my-3 btn btn-lg w-full font-normal text-sm btn-primary uppercase tracking-widest"
              disabled={!quoteDetails}
            >
              Submit Form
            </button>
          )}
        </div>

        <div className="flex flex-row text-secondary text-[10px] sm:text-[10px] justify-between">
          <div>
            <span className="opacity-75">Powered by</span>&nbsp;
            <span className="text-white">Deed3Labs</span>
          </div>
          <div className="mx-2">|</div>
          <div className="flex flex-row gap-8 underline decoration-dashed">
            <Link
              target="_blank"
              href="https://www.termsandconditionsgenerator.com/live.php?token=Kz3gxZ7VV5MJ4Qr8muZTviLJck3eZgz2"
              className="link-default opacity-75"
            >
              TERMS
            </Link>
            <Link
              target="_blank"
              href="https://www.termsandconditionsgenerator.com/live.php?token=Kz3gxZ7VV5MJ4Qr8muZTviLJck3eZgz2"
              className="link-default opacity-75"
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
