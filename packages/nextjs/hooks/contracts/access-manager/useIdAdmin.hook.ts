import { useEffect, useState } from "react";
import useWallet from "~~/hooks/useWallet";
import { cacheIsAdmin } from "~~/services/cache.service";

const useIsAdmin = () => {
  const { primaryWallet, isConnecting } = useWallet();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (primaryWallet?.address) {
      cacheIsAdmin(primaryWallet?.address).then(setIsAdmin);
    } else {
      setIsAdmin(false);
    }
  }, [primaryWallet?.address, isConnecting]);
  return isAdmin;
};

export default useIsAdmin;
