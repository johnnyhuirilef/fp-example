import fs from "node:fs";
import path from "node:path";
import {
  getDefaultPort,
  hasPortProperty,
  isNumber,
  isObject,
  isValidPortRange,
} from "../shared/index.ts";

const readFileContent = (filePath: string): string => {
  return fs.readFileSync(filePath, "utf-8");
};

const parseJson = (data: string): unknown => {
  return JSON.parse(data);
};

const extractPort = (config: unknown) => {
  if (!config) {
    return null;
  }

  if (!isObject(config)) {
    return null;
  }

  if (!hasPortProperty(config)) {
    return null;
  }

  if (!isNumber(config.port)) {
    return null;
  }

  if (!isValidPortRange(config.port)) {
    return null;
  }

  return config.port;
};

const getFilePath = (filePath: string) => {
  return path.resolve("./", "assets", filePath);
};

const getPortFromConfig = () => {
  const filePath = getFilePath("config.json");
  const content = readFileContent(filePath);
  const config = parseJson(content);
  if (config === null) {
    return getDefaultPort();
  }

  const port = extractPort(config) ?? getDefaultPort();
  return port;
};

const main = () => {
  try {
    const port = getPortFromConfig();
    console.log(`Configured port is: <<<${port}>>>`);
  } catch (error) {
    console.error("Error reading file or parsing JSON:", error);
    console.log(`Using default value: <<<${getDefaultPort()}>>>`);
  }
};

main();
