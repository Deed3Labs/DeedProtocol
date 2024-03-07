import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { DeedNFT } from "../typechain-types";

const deployDeedNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const deployConfig = 
  const routerAddress = taskArguments.router ? taskArguments.router : getRouterConfig(hre.network.name).address;

  const privateKey = getPrivateKey();
  const rpcProviderUrl = getProviderRpcUrl(hre.network.name);

  const provider = new ethers.JsonRpcProvider(rpcProviderUrl);
  const wallet = new Wallet(privateKey);
  const deployer = wallet.connect(provider);

  const spinner: Spinner = new Spinner();

  console.log(`ℹ️  Attempting to deploy MyNFT smart contract on the ${hre.network.name} blockchain using ${deployer.address} address`);
  spinner.start();

  const myNft: DeedNFT = await hre.ethers.deployContract("DeedNFT");
  await myNft.waitForDeployment();

  spinner.stop();
  console.log(`✅ MyNFT contract deployed at address ${myNft.target} on the ${hre.network.name} blockchain`)

  console.log(`ℹ️  Attempting to deploy DestinationMinter smart contract on the ${hre.network.name} blockchain using ${deployer.address} address, with the Router address ${routerAddress} provided as constructor argument`);
  spinner.start();

  const destinationMinter: DestinationMinter = await hre.ethers.deployContract("DestinationMinter", [routerAddress, myNft.getAddress()]);
  await destinationMinter.waitForDeployment();


  spinner.stop();
  console.log(`✅ DestinationMinter contract deployed at address ${destinationMinter.target} on the ${hre.network.name} blockchain`);

  console.log(`ℹ️  Attempting to grant the minter role to the DestinationMinter smart contract`);
  spinner.start();

  const tx = await myNft.transferOwnership(destinationMinter.getAddress());
  await tx.wait();

  spinner.stop();
  console.log(`✅ DestinationMinter can now mint MyNFTs. Transaction hash: ${tx.hash}`);
};

export default deployDeedNFT;

deployDeedNFT.tags = ["DeedNFT"];
deployDeedNFT.dependencies = ["AccessManager"];
