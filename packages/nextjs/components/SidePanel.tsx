import Link from "next/link";
import { NextRouter } from "next/router";
import { ExternalLinkIcon, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { TransactionReceipt } from "viem";
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
  const registrationClient = useRegistrationClient();

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
          await handlePayment(response.value);
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
        {deedData.id ? (
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
                              className="flex link items-baseline gap-2 link-accent"
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
                {!deedData.paymentInformation.receipt && deedData.id && (
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
          <div className="flex flex-col gap-4">
            <button onClick={handleSubmit} className="btn btn-lg bg-gray-600">
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default SidePanel;
