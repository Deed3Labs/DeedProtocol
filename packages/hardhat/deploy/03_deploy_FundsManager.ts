import { DeployFunction } from "hardhat-deploy/types";

const deployFundsManager: DeployFunction = async function () {
  // const { deployer } = await hre.getNamedAccounts();
  // const { deploy, get } = hre.deployments;
  // const accessManagerAddress = (await get("AccessManager")).address;
  // await deploy("FundsManager", {
  //   from: deployer,
  //   // Contract constructor arguments
  //   args: [accessManagerAddress],
  //   log: true,
  //   autoMine: true,
  // });
};

export default deployFundsManager;

deployFundsManager.tags = ["FundsManager", "core"];
deployFundsManager.dependencies = ["AccessManager"];
