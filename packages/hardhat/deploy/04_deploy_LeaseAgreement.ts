import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployLeaseAgreement: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;
  const deedNFTAddress = (await get("DeedNFT")).address;
  const subdivisionNFTAddress = (await get("SubdivisionNFT")).address;
  const leaseNFTAddress = (await get("LeaseNFT")).address;
  const hnytAddress = "0x2d467a24095B262787f58ce97d9B130ce7232B57";
  const fundsManagerAddress = (await get("FundsManager")).address;
  const leaseAgreementContract = await deploy("LeaseAgreement", {
    from: deployer,
    // Contract constructor arguments
    args: [leaseNFTAddress, hnytAddress, deedNFTAddress, subdivisionNFTAddress, fundsManagerAddress],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const leaseNFT = await hre.ethers.getContract("LeaseNFT", deployer);
  await leaseNFT.setLeaseAgreementAddress(leaseAgreementContract.address);
};

export default deployLeaseAgreement;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployLeaseAgreement.tags = ["LeaseAgreement"];
deployLeaseAgreement.dependencies = ["DeedNFT", "SubdivisionNFT", "LeaseNFT"];
