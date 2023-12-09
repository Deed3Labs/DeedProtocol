import { useScaffoldContractRead } from "../scaffold-eth";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export const useIsAdmin = () => {
  const { primaryWallet } = useDynamicContext();

  const { data } = useScaffoldContractRead({
    contractName: "AccessManager",
    functionName: "hasAdminRole",
    args: [primaryWallet?.address],
  });

  return data;
};

export const useIsValidator = () => {
  const { primaryWallet } = useDynamicContext();

  const { data } = useScaffoldContractRead({
    contractName: "AccessManager",
    functionName: "hasAdminRole",
    args: [primaryWallet?.address],
  });

  return data;
};
