import { useScaffoldContractWrite } from "../../scaffold-eth";
import useDeedClient from "~~/clients/deeds.client";
import useWallet from "~~/hooks/useWallet";
import { DeedInfoModel } from "~~/models/deed-info.model";
import logger from "~~/services/logger.service";
import { notification } from "~~/utils/scaffold-eth";

const useDeedValidate = () => {
  const { primaryWallet } = useWallet();
  const deedClient = useDeedClient();

  const contractWritePayload = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "setAssetValidation",
    args: [] as any, // Will be filled in by write()
  });

  const writeValidateAsync = async (deed: DeedInfoModel, isValidated: boolean) => {
    if (!primaryWallet) {
      notification.error("No wallet connected");
      return;
    }

    if (deed.ownerInformation.walletAddress === primaryWallet.address) {
      notification.error("You cannot validate your own deed");
      return;
    }

    const toastId = notification.info(isValidated ? "Validating deed..." : "Unvalidating deed...", {
      duration: Infinity,
    });

    try {
      await contractWritePayload.writeAsync({
        args: [BigInt(deed.mintedId!), isValidated],
      });

      await deedClient.saveDeed({
        ...deed,
        isValidated,
      });
    } catch (error) {
      notification.error("Error while validating deed");
      logger.error({ message: "Error while validating deed", error });
      return;
    } finally {
      notification.remove(toastId);
    }
  };

  return { ...contractWritePayload, writeValidateAsync };
};

export default useDeedValidate;
