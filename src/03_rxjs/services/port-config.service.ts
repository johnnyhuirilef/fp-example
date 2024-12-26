import { readFile } from "node:fs/promises";
import path from "node:path";
import { firstValueFrom, from, of } from "rxjs";
import { map, filter, defaultIfEmpty, mergeMap } from "rxjs/operators";

import {
  getDefaultPort,
  hasPortProperty,
  isNumber,
  isObject,
  isValidPortRange,
} from "../../shared";

const readFileContent = (filePath: string) => {
  return from(readFile(filePath, "utf-8"));
};

const parseJson = (data: string): unknown => {
  return JSON.parse(data);
};

const extractPort = (config: unknown) => {
  return of(config).pipe(
    filter(isObject),
    filter(hasPortProperty),
    map((config) => config.port),
    filter(isNumber),
    filter(isValidPortRange),
    defaultIfEmpty(getDefaultPort())
  );
};

const getFilePath = (filePath: string) => {
  return path.resolve("./", "assets", filePath);
};

export const getPortFromConfig$ = () => {
  const filePath = getFilePath("config.json");
  return readFileContent(filePath).pipe(map(parseJson), mergeMap(extractPort));
};

export const getPortFromConfig = () => {
  return firstValueFrom(getPortFromConfig$());
};
