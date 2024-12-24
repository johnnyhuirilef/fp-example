import fs from "node:fs/promises";
import path from "node:path";
import { getDefaultPort } from "../utils/index.ts";

const readFileContent = async (filePath: string): Promise<string> => {
  return await fs.readFile(filePath, "utf-8");
};

const parseJson = (data: string): unknown => {
  return JSON.parse(data);
};

const extractPort = (config: unknown) => {
  if (!config) {
    return null;
  }

  if (typeof config !== "object") {
    return null;
  }

  if (!("port" in config)) {
    return null;
  }

  if (typeof config.port !== "number") {
    return null;
  }

  return config.port;
};

const getFilePath = (filePath: string) => {
  return path.resolve("./", "assets", filePath);
};

const getPortFromConfig = async () => {
  const filePath = getFilePath("config.json");
  const content = await readFileContent(filePath);
  if (content === null) {
    return getDefaultPort();
  }

  const config = parseJson(content);
  if (config === null) {
    return getDefaultPort();
  }

  const port = extractPort(config) ?? getDefaultPort();
  return port;
};

const main = async () => {
  const port = await getPortFromConfig();
  console.log(`Configured port is: <<<${port}>>>`);
};

main().catch((error) => {
  console.error("Error reading file:", error);
  console.log(`Using default value: <<<${getDefaultPort()}>>>`);
});
