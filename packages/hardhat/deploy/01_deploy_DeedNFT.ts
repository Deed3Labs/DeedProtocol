import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { getDeployConfig, updateDeployConfig } from "../scripts/deploy-config-update";
import exportContractResult from "../scripts/export-contract";

const deployDeedNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const deployConfig = getDeployConfig();
  const networkConfig = deployConfig[hre.network.name];
  const proxy = networkConfig["deed-proxy"];
  const accessManagerAddress = networkConfig["access-manager-proxy"];
  const contractFactory = await hre.ethers.getContractFactory("DeedNFT");
  let contract;
  if (proxy) {
    // Migrate
    const result = await hre.upgrades.upgradeProxy(proxy, contractFactory);
    contract = await result.waitForDeployment();
    console.log(`DeedNFT upgraded with address`, await result.getAddress());
  } else {
    // Deploy new proxy
    const result = await hre.upgrades.deployProxy(contractFactory, [accessManagerAddress], {
      initializer: "initialize",
    });
    contract = await result.waitForDeployment();
    console.log(`New DeedNFT proxy deployed with address`, await result.getAddress());
    networkConfig["deed-proxy"] = await result.getAddress();
    updateDeployConfig(deployConfig);
  } // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tx = contract.deploymentTransaction();
  exportContractResult(hre.network, "DeedNFT", { ...tx, ...contract, address: networkConfig["deed-proxy"] });
};

export default deployDeedNFT;

deployDeedNFT.tags = ["DeedNFT"];
deployDeedNFT.dependencies = ["AccessManager"];
