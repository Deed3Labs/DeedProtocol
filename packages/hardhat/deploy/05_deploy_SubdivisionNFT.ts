import { DeployFunction } from "hardhat-deploy/types";

const deploySubdivisionNFT: DeployFunction = async function () {
  // const { deployer } = await hre.getNamedAccounts();
  // const { deploy, get } = hre.deployments;
  // const accessManagerAddress = (await get("AccessManager")).address;
  // const deedNFTAddress = (await get("DeedNFT")).address;
  // await deploy("SubdivisionNFT", {
  //   from: deployer,
  //   // Contract constructor arguments
  //   args: [deedNFTAddress, accessManagerAddress],
  //   log: true,
  //   autoMine: true,
  // });
};

export default deploySubdivisionNFT;

deploySubdivisionNFT.tags = ["SubdivisionNFT", "core"];
deploySubdivisionNFT.dependencies = ["DeedNFT", "AccessManager"];
