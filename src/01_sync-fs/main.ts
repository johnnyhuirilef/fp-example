import fs from "node:fs";
import path from "node:path";

const getDefaultPort = () => {
  const DEFAULT_PORT = 3000;
  return DEFAULT_PORT;
};

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

const getPortFromConfig = () => {
  const filePath = getFilePath("config.json");
  const content = readFileContent(filePath);
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
