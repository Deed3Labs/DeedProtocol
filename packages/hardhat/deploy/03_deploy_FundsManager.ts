import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployFundsManager: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  const accessManagerAddress = (await get("AccessManager")).address;

  await deploy("FundsManager", {
    from: deployer,
    // Contract constructor arguments
    args: [accessManagerAddress],
    log: true,

    autoMine: true,
  });
};

export default deployFundsManager;

deployFundsManager.tags = ["FundsManager", "AccessManager"];
