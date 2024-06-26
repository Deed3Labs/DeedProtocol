import { useEffect, useState } from "react";
import useWallet from "./useWallet";
import { DeedInfoModel } from "~~/models/deed-info.model";

const useIsOwner = (deedData: DeedInfoModel, emitOnChange: boolean = true) => {
  const { primaryWallet, isConnecting } = useWallet();
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    setIsOwner(primaryWallet?.address === deedData.ownerInformation.walletAddress);
  }, [
    primaryWallet?.address,
    emitOnChange ? deedData?.ownerInformation.walletAddress : "",
    isConnecting,
  ]);
  return isOwner;
};

export default useIsOwner;
