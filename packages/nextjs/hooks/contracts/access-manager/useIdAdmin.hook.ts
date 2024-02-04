import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { cacheIsAdmin } from "~~/services/cache.service";

const useIsAdmin = () => {
  const { primaryWallet } = useDynamicContext();
  return primaryWallet?.address ? cacheIsAdmin(primaryWallet?.address) : false;
};

export default useIsAdmin;
