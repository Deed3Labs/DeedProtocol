import useErc20Transfer from "./contracts/erc20/useErc20Transfer.hook";
import { parseEther } from "viem";
import logger from "~~/services/logger.service";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

const useCryptoPayement = () => {
  const { stableCoinAddress, deedMintingFeeDollar, storageAddress } = getTargetNetwork();

  const erc20Transfer = useErc20Transfer(
    stableCoinAddress,
    parseEther(deedMintingFeeDollar.toString()),
    storageAddress,
  );

  const writeAsync = async () => {
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
