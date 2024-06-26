import mustache from "mustache";
import fs from "fs";
import minimist from "minimist";

var argv = minimist(process.argv.slice(2));
const network = argv["_"][0] || argv["network"] || argv["n"];

const TEMPLATE_FOLDER_PATH = "./templates";

// Read the configuration file synchronously
const configData = fs.readFileSync("networks.json", "utf8");
const config = JSON.parse(configData)[network];

// Read the main template file synchronously
const mainTemplateData = fs.readFileSync(
    `${TEMPLATE_FOLDER_PATH}/subgraph.template.yaml`,
    "utf8"
);

// Render the main template
let output = mustache.render(mainTemplateData, config);

for (const dataSourceKey in config) {
    if (dataSourceKey === "network") continue;
    const dataSourceConfig = {
        ...config[dataSourceKey],
        network: config.network,
    };
    // Read the subtemplate file based on the configuration variable
    const subTemplateData = fs.readFileSync(
        `${TEMPLATE_FOLDER_PATH}/${dataSourceKey}.template.yaml`,
        "utf8"
    );
    // Register the subtemplate with Mustache.js
    const dataSourceRendered = mustache.render(
        subTemplateData,
        dataSourceConfig
    );

    // Append the rendered subtemplate to the main template
    output += dataSourceRendered;

    // Add a new line if no new line exists
    if (output[output.length - 1] != "\n") {
        output += "\n";
    }
}

// Write the output to the subgraph.yaml file
fs.writeFileSync("subgraph.yaml", output);
