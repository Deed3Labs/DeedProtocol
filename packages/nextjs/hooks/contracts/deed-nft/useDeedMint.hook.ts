import { useScaffoldContractWrite } from "../../scaffold-eth";
import { TransactionReceipt } from "viem";
import useFileClient from "~~/clients/file.client";
import useRegistrationClient from "~~/clients/registrations.client";
import { PropertyTypeOptions } from "~~/constants";
import useWallet from "~~/hooks/useWallet";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { uploadFiles } from "~~/services/file.service";
import logger from "~~/services/logger.service";
import { indexOfLiteral } from "~~/utils/extract-values";
import { notification } from "~~/utils/scaffold-eth";

const useDeedMint = (onConfirmed?: (txnReceipt: TransactionReceipt) => void) => {
  const { primaryWallet, authToken } = useWallet();
  const fileClient = useFileClient();
  const registrationsClient = useRegistrationClient();

  const contractWriteHook = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "mintAsset",
    args: [] as any, // Will be filled in by write()
    onBlockConfirmation: onConfirmed,
  });

  const writeAsync = async (data: DeedInfoModel) => {
    if (!primaryWallet || !authToken) {
      notification.error("No wallet connected");
      return;
    }

    const toastId = notification.loading("Uploading documents...");
    let hash;
    let payload: DeedInfoModel;
    try {
      payload = await uploadFiles(authToken, data, undefined, true);
      if (!payload) return;
      hash = await fileClient.uploadJson(payload);
    } catch (error) {
      notification.error("Error while uploading documents");
      logger.error({ message: "[Deed Mint] Error while uploading documents", error });
      return null;
    } finally {
      notification.remove(toastId);
    }
    if (!hash) return;

    const mintNotif = notification.info("Minting...", {
      duration: Infinity,
    });
    try {
      await contractWriteHook.writeAsync({
        args: [
          data.owner,
          hash.toString(),
          indexOfLiteral(PropertyTypeOptions, data.propertyDetails.propertyType),
        ],
      });
    } catch (error) {
      notification.error("Error while minting deed");
      logger.error({ message: "Error while minting deed", error });

      // Save the current state of published documents
      await registrationsClient.saveRegistration(payload);
      return;
    } finally {
      notification.remove(mintNotif);
    }
  };

  return { ...contractWriteHook, writeAsync };
};

export default useDeedMint;
