import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { DeedInfoModel } from "~~/models/deed-info.model";

const useIsOnwer = (deedData: DeedInfoModel) => {
  const { primaryWallet } = useDynamicContext();
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_OFFLINE) {
      setIsOwner(false);
    }
    if (primaryWallet?.address) {
      setIsOwner(primaryWallet?.address === deedData.owner);
    }
  }, [primaryWallet?.address]);
  return isOwner;
};

export default useIsOnwer;
