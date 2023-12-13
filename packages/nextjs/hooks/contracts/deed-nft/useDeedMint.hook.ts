import { useScaffoldContractWrite } from "../../scaffold-eth";
import { logger, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { TransactionReceipt, toHex } from "viem";
import { PropertyTypeOptions } from "~~/constants";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { indexOfLiteral } from "~~/utils/extract-values";
import { uploadDocuments } from "~~/utils/ipfs";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

const useDeedMint = (onConfirmed?: (txnReceipt: TransactionReceipt) => void) => {
  const { primaryWallet } = useDynamicContext();

  const { writeAsync: erc20Transfer } = useScaffoldContractWrite({
    contractName: "DAI",
    functionName: "transfer",
    args: [] as any, // Will be filled in by write()
  });

  const contractWriteHook = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "mintAsset",
    args: [] as any, // Will be filled in by write()
    onBlockConfirmation: onConfirmed,
  });

  const writeAsync = async (data: DeedInfoModel) => {
    if (!primaryWallet) {
      notification.error("No wallet connected");
      return;
    }

    if (data.paymentInformation.paymentType === "crypto") {
      const paymentNotif = notification.info("Sending payment...", {
        duration: Infinity,
      });
      try {
        const { deedMintingFee, storageWalletAddress } = getTargetNetwork();
        const txHash = await erc20Transfer({
          args: [storageWalletAddress, deedMintingFee],
        });
        if (txHash) {
          data.paymentInformation.receipt = txHash;
        }
      } catch (error) {
        logger.error({ message: "Error while sending payment", error });
        notification.error("Error while sending payment");
        return;
      } finally {
        notification.remove(paymentNotif);
      }
    } else {
      // Call api
    }

    const toastId = notification.loading("Uploading documents...");
    let hash;
    try {
      hash = await uploadDocuments(data);
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
          primaryWallet.address,
          toHex(hash.toString()),
          indexOfLiteral(PropertyTypeOptions, data.propertyDetails.propertyType),
        ],
      });
    } catch (error) {
      notification.error("Error while minting deed");
      logger.error({ message: "Error while minting deed", error });
      return;
    } finally {
      notification.remove(mintNotif);
    }
  };

  return { ...contractWriteHook, writeAsync };
};

export default useDeedMint;
