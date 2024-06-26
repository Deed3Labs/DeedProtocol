import { useScaffoldContractWrite } from "../../scaffold-eth";
import useIsValidator from "../access-manager/useIsValidator.hook";
import { updateNFTMetadata } from "./useDeedMint.hook";
import { TransactionReceipt } from "viem";
import useDeedClient from "~~/clients/deeds.client";
import useFileClient from "~~/clients/files.client";
import useWallet from "~~/hooks/useWallet";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { uploadFiles } from "~~/services/file.service";
import logger from "~~/services/logger.service";
import { notification } from "~~/utils/scaffold-eth";

const useDeedUpdate = (onConfirmed?: (txnReceipt: TransactionReceipt) => void) => {
  const { primaryWallet, authToken } = useWallet();
  const fileClient = useFileClient();
  const deedClient = useDeedClient();
  const isValidator = useIsValidator();

  const contractWriteHook = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "setIpfsDetailsHash",
    args: [] as any, // Will be filled in by write()
    onBlockConfirmation: onConfirmed,
    account: primaryWallet?.address,
  });

  const writeAsync = async (data: DeedInfoModel, old: DeedInfoModel) => {
    if (!primaryWallet || !authToken) {
      notification.error("No wallet connected");
      return;
    }

    let toastId = notification.loading("Uploading documents...");
    let hash;
    try {
      let payload = await uploadFiles(fileClient, authToken, data, old);
      if (!payload) return;

      payload = updateNFTMetadata(payload); // Update OpenSea metadata
      payload.isValidated = isValidator; // If validator, not need to unvalidate the deed

      // Start by saving data into database for redundancy
      await deedClient.saveDeed(payload);
      hash = await fileClient.uploadJson(payload);
    } catch (error) {
      notification.error("Error while uploading documents");
      logger.error({ message: "[Deed Mint] Error while uploading documents", error });
      return null;
    } finally {
      notification.remove(toastId);
    }
    if (!hash) return;

    toastId = notification.info("Updating deed...", {
      duration: Infinity,
    });
    try {
      await contractWriteHook.writeAsync({
        args: [BigInt(data.mintedId!), hash],
      });
    } catch (error) {
      notification.error("Error while updating deed");
      logger.error({ message: "Error while updating deed", error });
      return;
    } finally {
      notification.remove(toastId);
    }
  };

  return { ...contractWriteHook, writeAsync };
};
export default useDeedUpdate;
