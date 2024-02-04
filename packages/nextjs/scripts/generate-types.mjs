import { config } from "dotenv";
import { readFileSync, writeFileSync } from "fs";

const envLocal = config({ path: ".env.local" }).parsed; // NOTE: Script has to be executed from the project root
const typeText = `type TEnvKey =\n  | "${Object.keys(envLocal).join('"\n  | "')}"`;

const casesText = Object.keys(envLocal).reduce((acc, key) => {
  acc += `      case '${key}':\n`;
  acc += `        return process.env.${key}\n`;
  return acc;
}, "");

const filePath = "utils/env.ts";
let text = readFileSync(filePath, { encoding: "utf8" });
console.log(`reading ${filePath}`);

if (!text) throw "nothing read";

const casesStartLineMarker =
  "// START OF AUTO GENERATED CASES -- DO NOT REMOVE OR EDIT THIS COMMENT\n";
const casesEndLineMarker =
  "      // END OF AUTO GENERATED CASES -- DO NOT REMOVE OR EDIT THIS COMMENT\n";

text = `${
  text.split(casesStartLineMarker)[0]
}${casesStartLineMarker}${casesText}${casesEndLineMarker}${
  text.split(casesStartLineMarker)[1].split(casesEndLineMarker)[1]
}`;

const typesLineMarker = "// START OF AUTO GENERATED TYPES -- DO NOT REMOVE OR EDIT THIS COMMENT\n";
const [untouchedCode] = text.split(typesLineMarker);
const updatedText = `${untouchedCode}${typesLineMarker}${typeText}`;

writeFileSync(filePath, updatedText, "utf8");
