import { getDeployConfig, updateDeployConfig } from "./deploy-config-update";
import hardhat from "hardhat";

console.log(`Resetting proxy addresses for ${hardhat.network.name}`);
const actualConfig = getDeployConfig();
actualConfig[hardhat.network.name]["deed-proxy"] = "";
actualConfig[hardhat.network.name]["access-manager-proxy"] = "";
updateDeployConfig(actualConfig);
