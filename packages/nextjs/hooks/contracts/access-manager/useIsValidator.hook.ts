import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { cacheIsValidator } from "~~/services/cache.service";

const useIsValidator = () => {
  const [isValidator, setIsValidator] = useState(false);
  const { primaryWallet } = useDynamicContext();

  useEffect(() => {
    if (primaryWallet?.address) {
      cacheIsValidator(primaryWallet?.address).then(setIsValidator);
    }
  }, [primaryWallet?.address]);
  return isValidator;
};

export default useIsValidator;
