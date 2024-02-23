import { Network } from "hardhat/types";
import fs from "fs";

export default function exportContractResult(network: Network, contractName: string, contractResult: any) {
  // Export to hardhat single file
  try {
    const artifact = fs.readFileSync(`./artifacts/contracts/${contractName}.sol/${contractName}.json`, "utf8");
    contractResult = {
      ...contractResult,
      ...JSON.parse(artifact),
    };
    fs.writeFileSync(
      `./deployments/${network.name}/${contractName}.json`,
      JSON.stringify({
        address: contractResult.address,
        abi: contractResult.abi,
        // transactionHash: contractResult.transactionHash,
        // receipt: contractResult.receipt,
        // args: contractResult.args,
        // solcInputHash: contractResult.solcInputHash,
        // metadata: contractResult.metadata,
        // bytecode: contractResult.bytecode,
        // deployedBytecode: contractResult.deployedBytecode,
      }),
    );
  } catch (error) {
    console.error("Error during publishing deployement result for contract:" + contractName, error);
    throw error;
  }
}
