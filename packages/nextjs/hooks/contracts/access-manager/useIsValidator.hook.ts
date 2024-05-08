import { useEffect, useState } from "react";
import useWallet from "~~/hooks/useWallet";
import { cacheIsValidator } from "~~/services/cache.service";

const useIsValidator = () => {
  const [isValidator, setIsValidator] = useState(false);
  const { primaryWallet, isConnecting } = useWallet();

  useEffect(() => {
    if (primaryWallet?.address) {
      cacheIsValidator(primaryWallet?.address).then(setIsValidator);
    } else {
      setIsValidator(false);
    }
  }, [primaryWallet?.address, isConnecting]);
  return isValidator;
};

export default useIsValidator;
