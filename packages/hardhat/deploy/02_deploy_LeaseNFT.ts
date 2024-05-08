import { DeployFunction } from "hardhat-deploy/types";

const deployLeaseNFT: DeployFunction = async function () {
  // const { deployer } = await hre.getNamedAccounts();
  // const { deploy, get } = hre.deployments;
  // const accessManagerAddress = (await get("AccessManager")).address;
  // await deploy("LeaseNFT", {
  //   from: deployer,
  //   // Contract constructor arguments
  //   args: [accessManagerAddress],
  //   log: true,
  //   autoMine: true,
  // });
};

export default deployLeaseNFT;

deployLeaseNFT.tags = ["LeaseNFT", "core"];
deployLeaseNFT.dependencies = ["AccessManager"];
