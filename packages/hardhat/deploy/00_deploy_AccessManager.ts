import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { getDeployConfig, updateDeployConfig } from "../scripts/deploy-config-update";
import exportContractResult from "../scripts/export-contract";

const deployAccessManager: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const deployConfig = getDeployConfig();
  const networkConfig = deployConfig[hre.network.name];
  const manager = networkConfig.manager;
  const proxy = networkConfig["access-manager-proxy"];
  const contractFactory = await hre.ethers.getContractFactory("AccessManager");
  let contract;
  if (proxy) {
    // Migrate
    const result = await hre.upgrades.upgradeProxy(proxy, contractFactory);
    contract = await result.waitForDeployment();
    console.log(`AccessManager upgraded with address`, await result.getAddress());
  } else {
    // Deploy new proxy
    const result = await hre.upgrades.deployProxy(contractFactory, [manager], { initializer: "initialize" });
    contract = await result.waitForDeployment();
    console.log(`New AccessManager proxy deployed with address`, await result.getAddress());
    networkConfig["access-manager-proxy"] = await result.getAddress();
    updateDeployConfig(deployConfig);
  } // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tx = contract.deploymentTransaction();
  exportContractResult(hre.network, "AccessManager", {
    ...tx,
    ...contract,
    address: networkConfig["access-manager-proxy"],
  });
};

export default deployAccessManager;

deployAccessManager.tags = ["AccessManager"];
