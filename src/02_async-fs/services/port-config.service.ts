import fs from "node:fs/promises";
import path from "node:path";
import {
  getDefaultPort,
  hasPortProperty,
  isNumber,
  isObject,
  isValidPortRange,
} from "../../shared";

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

export const getPortFromConfig = async () => {
  const filePath = getFilePath("config.json");
  const content = await readFileContent(filePath);
  const config = parseJson(content);
  const port = extractPort(config) ?? getDefaultPort();
  return port;
};
