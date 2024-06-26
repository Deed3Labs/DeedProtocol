/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import { ExtendedArtifact } from "hardhat-deploy/types";
import { ContractTransactionResponse } from "ethers";
import { network } from "hardhat";
import { getDeployArtifact } from "./utils";

export default async function exportContractResult(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  address: string,
  artifact: ExtendedArtifact,
  tx: ContractTransactionResponse | null,
  args: any[],
) {
  // Export to hardhat single file
  const deployDir = `./deployments/${hre.network.name}`;
  const deploymentArtifactLocation = `./${deployDir}/${contractName}.json`;
  try {
    let blockNumber;
    if (tx) {
      if (!tx.blockNumber) {
        // try {
        //   blockNumber = (await hre.ethers.provider.getTransactionReceipt(tx.hash).catch(console.error))?.blockNumber;
        // } catch (error) {
        //   console.warn(
        //     "Failed to retrive block number, please specify it manually in the deployement ([CONTRACT_NAME].json) file",
        //     { error },
        //   );
        // }
      } else {
        blockNumber = tx.blockNumber;
      }
    }
    let deployementArtifact: any = {
      address,
      arguments: args,
      ...artifact,
    };
    if (tx) {
      deployementArtifact.tx = tx.hash;
    }
    if (blockNumber) {
      deployementArtifact.blockNumber = blockNumber;
    }

    const existingDeployArtifact = getDeployArtifact(network.name, contractName);
    if (existingDeployArtifact) {
      deployementArtifact = {
        ...existingDeployArtifact,
        ...deployementArtifact,
      };
    }

    if (!fs.existsSync(deployDir)) {
      fs.mkdirSync(deployDir);
      fs.writeFileSync(`${deployDir}/.chainid`, network.config.chainId!.toString());
    }
    fs.writeFileSync(deploymentArtifactLocation, JSON.stringify(deployementArtifact));
  } catch (error) {
    console.error("Error during publishing deployement result for contract:" + contractName, error);
    throw error;
  }
}
