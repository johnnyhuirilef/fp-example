import { readFile } from "node:fs/promises";
import path from "node:path";
import { from, of } from "rxjs";
import { map, filter, defaultIfEmpty, mergeMap } from "rxjs/operators";

import { getDefaultPort } from "../shared/index.ts";
import { Config } from "./types/index.ts";

const readFileContent = (filePath: string) => {
  return from(readFile(filePath, "utf-8"));
};

const parseJson = (data: string): unknown => {
  return JSON.parse(data);
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const hasPortProperty = (value: Record<string, unknown>): value is Config =>
  "port" in value && typeof value.port === "number";

const extractPort = (config: unknown) => {
  return of(config).pipe(
    filter(isObject),
    filter(hasPortProperty),
    map((config) => config.port),
    filter((port) => port > 0 && port < 65536),
    defaultIfEmpty(getDefaultPort())
  );
};

const getFilePath = (filePath: string) => {
  return path.resolve("./", "assets", filePath);
};

const getPortFromConfig = () => {
  const filePath = getFilePath("config.json");
  return readFileContent(filePath).pipe(map(parseJson), mergeMap(extractPort));
};

const main = () => {
  getPortFromConfig().subscribe({
    next: (port) => console.log(`Configured port is: <<<${port}>>>`),
    error: (error) => console.log("Error reading file:", error),
  });
};

main();
