import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const useIsAdmin = () => {
  const { primaryWallet } = useDynamicContext();

  const { data } = useScaffoldContractRead({
    contractName: "AccessManager",
    functionName: "hasAdminRole",
    args: [primaryWallet?.address],
  });

  return data;
};
export default useIsAdmin;
