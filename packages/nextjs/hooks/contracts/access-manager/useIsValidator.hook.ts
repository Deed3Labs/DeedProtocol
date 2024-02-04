import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { cacheIsValidator } from "~~/services/cache.service";

const useIsValidator = () => {
  const { primaryWallet } = useDynamicContext();
  return primaryWallet?.address ? cacheIsValidator(primaryWallet?.address) : false;
};

export default useIsValidator;
