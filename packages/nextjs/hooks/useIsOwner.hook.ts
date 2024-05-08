import { useEffect, useState } from "react";
import useWallet from "./useWallet";
import { DeedInfoModel } from "~~/models/deed-info.model";

const useIsOnwer = (deedData: DeedInfoModel) => {
  const { primaryWallet, isConnecting } = useWallet();
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    setIsOwner(primaryWallet?.address === deedData.owner);
  }, [primaryWallet?.address, deedData?.owner, isConnecting]);
  return isOwner;
};

export default useIsOnwer;
