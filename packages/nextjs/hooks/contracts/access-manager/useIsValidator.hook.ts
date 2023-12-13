import { useScaffoldContractRead } from "../../scaffold-eth";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const useIsValidator = () => {
  const { primaryWallet } = useDynamicContext();

  const { data } = useScaffoldContractRead({
    contractName: "AccessManager",
    functionName: "hasValidatorRole",
    args: [primaryWallet?.address],
  });

  return data;
};
export default useIsValidator;
