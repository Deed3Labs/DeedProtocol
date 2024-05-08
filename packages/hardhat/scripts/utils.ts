import fs from "fs";
export const getDeployArtifact = (network: string, contractName: string) => {
  const deploymentArtifactLocation = `./deployments/${network}/${contractName}.json`;
  try {
    if (fs.existsSync(deploymentArtifactLocation)) {
      const jsonArtifact = fs.readFileSync(deploymentArtifactLocation, "utf8");
      return JSON.parse(jsonArtifact);
    }
  } catch (error) {
    console.warn("Something went wrong when parsing already existing artifact");
  }
  return null;
};
