import hardhat from "hardhat";
import fs from "fs";

console.log(`Resetting proxies deployments for ${hardhat.network.name}`);
fs.rmSync(`./deployments/${hardhat.network.name}/DeedNFT.json`, {
  force: true,
});
// fs.rmSync(`./deployments/${hardhat.network.name}/AccessManager.json`, {
//   force: true,
// });
