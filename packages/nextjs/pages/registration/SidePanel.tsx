import { useEffect, useState } from "react";
import Link from "next/link";
import { NextRouter } from "next/router";
import QuoteDetail, { USDollar } from "../../components/scaffold-eth/QuoteDetail";
import { ExternalLinkIcon, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { TransactionReceipt } from "viem";
import useQuoteClient from "~~/clients/quote.client";
import useRegistrationClient from "~~/clients/registrations.client";
import { TransactionHash } from "~~/components/blockexplorer";
import { Address } from "~~/components/scaffold-eth";
import CONFIG from "~~/config";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import useDeedMint from "~~/hooks/contracts/deed-nft/useDeedMint.hook";
import useDeedUpdate from "~~/hooks/contracts/deed-nft/useDeedUpdate.hook";
import useDeedValidate from "~~/hooks/contracts/deed-nft/useDeedValidate.hook";
import useCryptoPayement from "~~/hooks/useCryptoPayment.hook";
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
  const { writeAsync: writeCryptoPayement } = useCryptoPayement();
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
        }
        notification.success("Successfully updated");
        refetchDeedInfo();
      } else {
        notification.error("Error saving registration");
      }
    } else {
      if (!deedData.id || !initialData) return;
      // Update on chain
      await writeUpdateDeedAsync(deedData, initialData, deedData.id!);
    }
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
        return;
      }
      const response = await registrationClient
        .authentify(authToken!)
        .savePaymentReceipt(_id, hash?.toString());
      notification.remove(toastId);
      if (!response.ok) {
        notification.error("Error submiting receipt");
      }
      await router.push(`/registration/${_id}`);
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
    notification.success(`Deed NFT Minted with id ${deedId}`);
    await router.push(`/registration/${deedId}`);
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
    <div className="bg-base-100 w-[500] h-fit relative lg:sticky lg:top-32 overflow-y-auto max-h-[80vh]">
      <div className=" m-9">
        <div className="flex flex-row gap-2">
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-row gap-1 items-center">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_1319_6039)">
                  <rect
                    x="3"
                    y="3"
                    width="28"
                    height="28"
                    rx="14"
                    fill="white"
                    shape-rendering="crispEdges"
                  />
                  <g clip-path="url(#clip0_1319_6039)">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M13.25 16.625V20H20.75V16.625C21.2885 16.625 21.7985 16.499 22.25 16.274V22.25C22.25 22.4489 22.171 22.6397 22.0303 22.7803C21.8897 22.921 21.6989 23 21.5 23H12.5C12.3011 23 12.1103 22.921 11.9697 22.7803C11.829 22.6397 11.75 22.4489 11.75 22.25V16.274C12.2015 16.499 12.7115 16.625 13.25 16.625ZM11 13.25L12.2773 11.3338C12.3458 11.2311 12.4386 11.1469 12.5474 11.0887C12.6563 11.0304 12.7778 11 12.9013 11H21.0988C21.2222 11 21.3437 11.0304 21.4526 11.0887C21.5614 11.1469 21.6542 11.2311 21.7227 11.3338L23 13.25C23.0001 13.7334 22.8445 14.204 22.5563 14.592C22.2681 14.9801 21.8626 15.2651 21.3998 15.4047C20.937 15.5442 20.4415 15.5311 19.9868 15.3671C19.532 15.2031 19.1422 14.8971 18.875 14.4942C18.4722 15.1002 17.7822 15.5 17 15.5C16.2178 15.5 15.5278 15.1002 15.125 14.4942C14.8578 14.8971 14.468 15.2031 14.0132 15.3671C13.5585 15.5311 13.063 15.5442 12.6002 15.4047C12.1374 15.2651 11.7319 14.9801 11.4437 14.592C11.1555 14.204 10.9999 13.7334 11 13.25Z"
                      fill="black"
                    />
                  </g>
                </g>
                <defs>
                  <filter
                    id="filter0_d_1319_6039"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="1" dy="1" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_1319_6039"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_1319_6039"
                      result="shape"
                    />
                  </filter>
                  <clipPath id="clip0_1319_6039">
                    <rect width="12" height="12" fill="white" transform="translate(11 11)" />
                  </clipPath>
                </defs>
              </svg>
              Deed3 (The Deed Protocol)
            </div>
            {deedData && !deedData.id && quoteDetails && (
              <>
                <div className="text-5xl font-['Coolvetica'] font-condensed uppercase">
                  STANDARD PROPERTY LISTING
                </div>
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
                    <span className="text-[#f0f0f0]">
                      SUBSCRIBE TODAY TO
                      <span className="mx-1 p-1 bg-[#cbf4c9] text-[#0e6245]">SAVE 50%</span> ON
                      LISTINGS.
                    </span>
                  </div>
                </div>

                <div className="text-end">
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

                <div className="border py-6 rounded border-secondary border-opacity-25 gap-4 flex flex-col">
                  <span className="mx-6 text-[#a6a6a6] uppercase">Add to your order</span>
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
            )}
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
                  {!deedData.paymentInformation.receipt && deedData?.id && (
                    <button
                      onClick={() => handlePayment(deedData.id!)}
                      className="btn btn-lg bg-gray-600"
                    >
                      Pay
                    </button>
                  )}
                </>
              )}
            </>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn btn-lg w-full font-normal btn-primary uppercase"
            >
              Submit form
            </button>
          )}
        </div>

        <div className="flex flex-row text-secondary text-xs justify-between">
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
