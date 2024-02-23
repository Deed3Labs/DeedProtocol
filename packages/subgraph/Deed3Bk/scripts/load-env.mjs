
import {config} from "dotenv";

config({ path: "graph.env" });

console.log("Loaded environment variables from graph.env", {
  "PINATA_GATEWAY_KEY": process.env.PINATA_GATEWAY_KEY,
  "PINATA_GATEWAY": process.env.PINATA_GATEWAY,
});