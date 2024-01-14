import { useScaffoldContractWrite } from "../../scaffold-eth";
import useDeedUpdate from "./useDeedUpdate.hook";
import { logger, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { notification } from "~~/utils/scaffold-eth";

const useDeedValidate = () => {
  const { primaryWallet } = useDynamicContext();

  const contractWritePayload = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "setAssetValidation",
    args: [] as any, // Will be filled in by write()
  });

  const { writeAsync: updateMetadata } = useDeedUpdate();

  const writeValidateAsync = async (deed: DeedInfoModel, isValidated: boolean) => {
    if (!primaryWallet) {
      notification.error("No wallet connected");
      return;
    }

    // Re-upload the deed info for public access
    await updateMetadata(deed, deed, deed.id!, isValidated);

    const toastId = notification.info(isValidated ? "Validating deed..." : "Unvalidating deed...", {
      duration: Infinity,
    });

    try {
      await contractWritePayload.writeAsync({
        args: [BigInt(deed.id!), isValidated],
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
