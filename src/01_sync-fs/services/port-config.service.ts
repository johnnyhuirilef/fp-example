import fs from "node:fs";
import path from "node:path";
import {
  getDefaultPort,
  hasPortProperty,
  isNumber,
  isObject,
  isValidPortRange,
} from "../../shared/index.ts";

const readFileContent = (filePath: string): string => {
  return fs.readFileSync(filePath, "utf-8");
};

const parseJson = (data: string): unknown => {
  return JSON.parse(data);
};

const extractPort = (config: unknown) => {
  if (!isObject(config) || !hasPortProperty(config)) {
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

export const getPortFromConfig = (filename: string) => {
  const filePath = getFilePath(filename);
  const content = readFileContent(filePath);
  const config = parseJson(content);
  const port = extractPort(config) ?? getDefaultPort();
  return port;
};
