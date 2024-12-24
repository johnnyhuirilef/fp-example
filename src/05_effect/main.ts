import { readFile } from "node:fs/promises";
import path from "node:path";
import { Effect } from "effect";

import { getDefaultPort } from "../shared";
import type { FileReadError, ParseJsonError, ValidationError } from "./types";

const makeValidationError = (message: string): ValidationError => ({
  type: "ValidationError",
  message,
});

const makeFileReadError = (error: unknown): FileReadError => ({
  type: "FileReadError",
  message:
    error instanceof Error
      ? error.message
      : "Error reading file, unknown reason",
});

const makeParseJsonError = (error: unknown): ParseJsonError => ({
  type: "JsonParseError",
  message: error instanceof Error ? error.message : "Error parsing JSON",
});

const readFileContent = (filePath: string) =>
  Effect.tryPromise({
    try: () => readFile(filePath, "utf-8"),
    catch: (error) => makeFileReadError(error),
  });

const parseJson = (data: string) =>
  Effect.try({
    try: () => JSON.parse(data),
    catch: (error) => makeParseJsonError(error),
  });

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
const isNumber = (value: unknown): value is number => typeof value === "number";
const isValidPortRange = (port: number) => port > 0 && port < 65536;

const validateObject = (value: unknown) =>
  Effect.filterOrFail(Effect.succeed(value), isObject, () =>
    makeValidationError("Not an object")
  );

const validatePortProperty = (obj: Record<string, unknown>) =>
  Effect.filterOrFail(Effect.succeed(obj.port), isNumber, () =>
    makeValidationError("Invalid port")
  );

const validatePortRange = (port: number) =>
  Effect.filterOrFail(Effect.succeed(port), isValidPortRange, () =>
    makeValidationError("Port out of range")
  );

const validateConfig = (value: unknown) =>
  Effect.flatMap(validateObject(value), (obj) =>
    Effect.flatMap(validatePortProperty(obj), validatePortRange)
  );

const getFilePath = (filePath: string) =>
  path.resolve("./", "assets", filePath);

const getPortFromConfig = () =>
  Effect.flatMap(readFileContent(getFilePath("config.json")), (content) =>
    Effect.flatMap(parseJson(content), validateConfig)
  );

const main = () =>
  Effect.runPromise(
    Effect.catchAll(getPortFromConfig(), (error) => {
      console.error(error);
      return Effect.succeed(getDefaultPort());
    })
  ).then((port) => {
    console.log(`Configured port is: <<<${port}>>>`);
  });

main().catch(console.error);
