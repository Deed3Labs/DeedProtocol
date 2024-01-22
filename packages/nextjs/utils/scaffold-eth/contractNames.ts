import CONFIG from "~~/config";
import { ContractName, contracts } from "~~/utils/scaffold-eth/contract";

export function getContractNames() {
  const contractsData = contracts?.[CONFIG.targetNetwork.id];
  return contractsData ? (Object.keys(contractsData) as ContractName[]) : [];
}
