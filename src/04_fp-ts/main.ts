import { readFile } from "node:fs/promises";
import path from "node:path";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";

import { getDefaultPort } from "../shared";
import type {
  AppError,
  FileReadError,
  ParseJsonError,
  ValidationError,
} from "./types";

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

const readFileContent = (filePath: string): TE.TaskEither<AppError, string> => {
  return TE.tryCatch(
    () => readFile(filePath, "utf-8"),
    (reason) => makeFileReadError(reason)
  );
};

const parseJson = (data: string): E.Either<AppError, unknown> => {
  return E.tryCatch(
    () => JSON.parse(data),
    (reason) => makeParseJsonError(reason)
  );
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
const isNumber = (value: unknown): value is number => typeof value === "number";
const isValidPortRange = (port: number) => port > 0 && port < 65536;

const validateObject = (value: unknown) =>
  pipe(
    value,
    E.fromPredicate(isObject, () => makeValidationError("Not an object"))
  );

const validatePortProperty = (
  obj: Record<string, unknown>
): E.Either<ValidationError, number> =>
  pipe(
    obj,
    R.lookup("port"),
    O.chain(O.fromPredicate(isNumber)),
    E.fromOption(() => makeValidationError("Invalid port"))
  );

const validatePortRange = (port: number) =>
  pipe(
    port,
    E.fromPredicate(isValidPortRange, () =>
      makeValidationError("Port out of range")
    )
  );

const validateConfig = (value: unknown) => {
  return pipe(
    value,
    validateObject,
    E.chain(validatePortProperty),
    E.chain(validatePortRange),
    E.map((port) => ({ port }))
  );
};

const extractPort = (config: unknown): E.Either<AppError, number> => {
  return pipe(
    config,
    validateConfig,
    E.map((config) => config.port)
  );
};

const getFilePath = (filePath: string) => {
  return path.resolve("./", "assets", filePath);
};

const getPortFromConfig = () => {
  return pipe(
    getFilePath("config.json"),
    readFileContent,
    TE.mapLeft((error): AppError => error),
    TE.chainEitherK(parseJson),
    TE.chainEitherK(extractPort)
  );
};

const main = async () => {
  const program = pipe(
    getPortFromConfig(),
    TE.fold(
      (error) => {
        console.error(error);
        return T.of(getDefaultPort());
      },
      (port) => T.of(port)
    )
  );

  const port = await program();
  console.log(`Configured port is: <<<${port}>>>`);
};

main().catch(console.error);
