import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";

const useWallet = () => {
  // OFLINE
  const { address, isConnected, isConnecting } = useAccount();
  const localContext = {
    primaryWallet: {
      address,
      connected: isConnected,
    },
    isConnecting,
    authToken: address,
  };

  // ONLINE
  let dynamicContext;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    dynamicContext = useDynamicContext();
  } catch (error) {}
  return process.env.NEXT_PUBLIC_OFFLINE
    ? localContext
    : { ...dynamicContext, isConnecting: dynamicContext?.loadingNetwork };
};

export default useWallet;
