import useErc20Transfer from "./contracts/erc20/useErc20Transfer.hook";
import useWallet from "./useWallet";
import { parseEther } from "viem";
import { useBalance } from "wagmi";
import logger from "~~/services/logger.service";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

const useCryptoPayement = () => {
  const { stableCoin, deedMintingFeeDollar, storageAddress } = getTargetNetwork();
  const { primaryWallet } = useWallet();
  const { data } = useBalance({
    token: stableCoin.address,
    address: primaryWallet?.address,
  });

  const erc20Transfer = useErc20Transfer(
    stableCoin.address,
    parseEther(deedMintingFeeDollar.toString()),
    storageAddress,
  );

  const writeAsync = async () => {
    if (data && data.value < parseEther(deedMintingFeeDollar.toString())) {
      notification.error(`Insufficient balance for ${stableCoin.symbol}`);
      return;
    }
    const paymentNotif = notification.info("Sending payment...", {
      duration: Infinity,
    });
    try {
      const txHash = await erc20Transfer.writeAsync();
      if (!txHash) return;
      return txHash.hash;
    } catch (error) {
      logger.error({ message: "Error while sending payment", error });
      notification.error("Error while sending payment");
      return;
    } finally {
      notification.remove(paymentNotif);
    }
  };

  return { ...erc20Transfer, writeAsync };
};

export default useCryptoPayement;
