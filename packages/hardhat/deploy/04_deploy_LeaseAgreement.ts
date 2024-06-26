import { DeployFunction } from "hardhat-deploy/types";

const deployLeaseAgreement: DeployFunction = async function () {
  // const { deployer } = await hre.getNamedAccounts();
  // const { deploy, get } = hre.deployments;
  // const accessManagerAddress = (await get("AccessManager")).address;
  // const deedNFTAddress = (await get("DeedNFT")).address;
  // const subdivisionNFTAddress = (await get("SubdivisionNFT")).address;
  // const leaseNFTAddress = (await get("LeaseNFT")).address;
  // const hnytAddress = "0x2d467a24095B262787f58ce97d9B130ce7232B57";
  // const fundsManagerAddress = (await get("FundsManager")).address;
  // const leaseAgreementContract = await deploy("LeaseAgreement", {
  //   from: deployer,
  //   // Contract constructor arguments
  //   args: [
  //     leaseNFTAddress,
  //     hnytAddress,
  //     deedNFTAddress,
  //     subdivisionNFTAddress,
  //     fundsManagerAddress,
  //     accessManagerAddress,
  //   ],
  //   log: true,
  //   autoMine: true,
  // });
  // const leaseNFT = await hre.ethers.getContract("LeaseNFT", deployer);
  // await leaseNFT.setLeaseAgreementAddress(leaseAgreementContract.address);
};

export default deployLeaseAgreement;

deployLeaseAgreement.tags = ["LeaseAgreement", "core"];
deployLeaseAgreement.dependencies = ["DeedNFT", "SubdivisionNFT", "LeaseNFT", "AccessManager"];
