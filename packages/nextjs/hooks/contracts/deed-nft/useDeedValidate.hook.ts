import { useScaffoldContractWrite } from "../../scaffold-eth";
import { logger, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { notification } from "~~/utils/scaffold-eth";

const useDeedValidate = () => {
  const { primaryWallet } = useDynamicContext();

  const contractWritePayload = useScaffoldContractWrite({
    contractName: "DeedNFT",
    functionName: "setAssetValidation",
    args: [] as any, // Will be filled in by write()
  });

  const writeValidateAsync = async (deedId: number, isValidated: boolean) => {
    if (!primaryWallet) {
      notification.error("No wallet connected");
      return;
    }

    try {
      await contractWritePayload.writeAsync({
        args: [deedId as any, isValidated],
      });
    } catch (error) {
      notification.error("Error while validating deed");
      logger.error({ message: "Error while validating deed", error });
      return;
    }
  };

  return { ...contractWritePayload, writeValidateAsync };
};

export default useDeedValidate;
