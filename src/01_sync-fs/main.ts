import fs from "node:fs";
import path from "node:path";

// Suponiendo que el archivo se llama config.json y está en el mismo directorio

const filePath = path.resolve("./", "assets", "config.json");
const defaultPort = 3000;

function readConfig() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const config = JSON.parse(data);
    const port = typeof config.port === "number" ? config.port : defaultPort;
    console.log(`Configured port is: <<<${port}>>>`);
  } catch (error) {
    console.error("Error reading file or parsing JSON:", error);
    console.log(`Using default value: <<<${defaultPort}>>>`);
  }
}

readConfig();
