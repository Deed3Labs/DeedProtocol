import CONFIG from "~~/config";
import { contracts } from "~~/utils/scaffold-eth/contract";

export function getAllContracts() {
  const contractsData = contracts?.[CONFIG.targetNetwork.id];
  return contractsData ? contractsData : {};
}
