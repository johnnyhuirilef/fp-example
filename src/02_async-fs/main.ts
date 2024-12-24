import fs from "node:fs/promises";
import path from "node:path";

// Suponiendo que el archivo se llama config.json y está en el mismo directorio

const filePath = path.resolve("./", "assets", "config.json");
const defaultPort = 3000;

const readConfig = async () => {
  const data = await fs.readFile(filePath, "utf-8");
  const config = JSON.parse(data);
  const port = typeof config.port === "number" ? config.port : defaultPort;
  console.log(`Configured port is: <<<${port}>>>`);
};

readConfig().catch((error) => {
  console.error("Error reading file:", error);
  console.log(`Using default value: <<<${defaultPort}>>>`);
});
