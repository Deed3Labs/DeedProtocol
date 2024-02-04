import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployDeedNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("AccessManager", {
    from: deployer,
    // Contract constructor arguments
    args: [deployer],
    log: true,

    autoMine: true,
  });
};

export default deployDeedNFT;

deployDeedNFT.tags = ["DeedNFT"];
