import fs from "fs";
import path from "path";

type DeployConfig = {
  [network: string]: {
    manager: string;
    "deed-proxy": string;
    "access-manager-proxy": string;
  };
};

const filePath = path.resolve(__dirname, "../deploy-config.json");

export const updateDeployConfig = (config: DeployConfig) => {
  try {
    // Convert the object to a JSON string
    const jsonData = JSON.stringify(config, null, 2);
    // Write the JSON string to a file synchronously
    fs.writeFileSync(filePath, jsonData, "utf8");
    console.log("Deploy config successfully updated");
  } catch (error) {
    console.error("Error writing to deploy config file:", error);
    throw error; // Rethrow or handle as needed
  }
};

export const getDeployConfig = () => {
  try {
    // Read the file synchronously
    const rawData = fs.readFileSync(filePath, "utf8");
    // Parse the JSON content and return the object
    const jsonData = JSON.parse(rawData);
    return jsonData as DeployConfig;
  } catch (error) {
    console.error("Error reading or parsing the file:", error);
    throw error; // Rethrow or handle as needed
  }
};
