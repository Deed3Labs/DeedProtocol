import { useScaffoldContractWrite } from "../../scaffold-eth";
import useErc20Transfer from "../erc20/useErc20Transfer.hook";
import { logger, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { TransactionReceipt, parseEther } from "viem";
import { PropertyTypeOptions } from "~~/constants";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { indexOfLiteral } from "~~/utils/extract-values";
import { uploadDocuments } from "~~/utils/ipfs";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

const useDeedMint = (onConfirmed?: (txnReceipt: TransactionReceipt) => void) => {
  const { primaryWallet } = useDynamicContext();

  const { stableCoinAddress, deedMintingFeeDollar, storageAddress } = getTargetNetwork();
  const { writeAsync: erc20Transfer } = useErc20Transfer(
    stableCoinAddress,
    parseEther(deedMintingFeeDollar.toString()),
    storageAddress,
  );

  const contractWriteHook = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "mintAsset",
    args: [] as any, // Will be filled in by write()
    onBlockConfirmation: onConfirmed,
  });

  const writeAsync = async (data: DeedInfoModel) => {
    console.log({ stableCoinAddress });
    if (!primaryWallet) {
      notification.error("No wallet connected");
      return;
    }

    if (data.paymentInformation.paymentType === "crypto") {
      const paymentNotif = notification.info("Sending payment...", {
        duration: Infinity,
      });
      try {
        const txHash = await erc20Transfer();
        if (!txHash) return;
        data.paymentInformation.receipt = txHash.hash;
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
          hash.toString(),
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
