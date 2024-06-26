import deployedContracts from "~~/contracts/deployedContracts";
import { getTargetNetwork } from "~~/utils/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";

const useContractAddress = <TContractName extends ContractName>(contractName: TContractName) => {
  const chainId = getTargetNetwork().id as keyof typeof deployedContracts;
  // @ts-ignore
  return deployedContracts[chainId][contractName].address;
};

export default useContractAddress;
