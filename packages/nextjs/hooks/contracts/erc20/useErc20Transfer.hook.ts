import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Address, useContractWrite } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

const useErc20Transfer = (token: Address, amount: bigint, to: Address) => {
  const { primaryWallet } = useDynamicContext();

  const { writeAsync: erc20Transfer } = useContractWrite({
    abi: [
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    address: token,
    functionName: "transfer",
    account: primaryWallet,
  });

  const writeAsync = async () => {
    if (!primaryWallet) {
      notification.error("No wallet connected");
      return;
    }

    const txHash = await erc20Transfer({
      args: [to, amount],
    });

    return txHash;
  };

  return { writeAsync };
};

export default useErc20Transfer;
