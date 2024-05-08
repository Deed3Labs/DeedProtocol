/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import exportContractResult from "../scripts/export-contract";

const deployTokenMock = async (hre: HardhatRuntimeEnvironment) => {
  const contractName = "TokenMock";
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    console.log("🚫️ You don't have a deployer account. Run `yarn generate` first");
    return;
  }

  const namedAccounts = await hre.getNamedAccounts();
  const contractFactory = await hre.ethers.getContractFactory(contractName);
  const ctrArgs = ["TokenMock", "TOK"];
  const contract = await contractFactory.deploy(...ctrArgs);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`<<${contractName}>> successfully deployed with address: ${contractAddress}`);

  // Initial mint
  const amountToMint = "9999999";
  await contract.mint(namedAccounts.manager, hre.ethers.parseEther(amountToMint));
  console.log(`<<${contractName}>> successfully minted ${amountToMint} ethers to ${namedAccounts.manager}`);

  const deployTx = contract.deploymentTransaction();
  const artifacts = await hre.deployments.getExtendedArtifact(contractName);
  await exportContractResult(hre, contractName, contractAddress, artifacts, deployTx, ctrArgs);
};

export default deployTokenMock;

deployTokenMock.tags = ["TokenMock", "mocks"];
