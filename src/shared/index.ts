import type {
  Config,
  FileReadError,
  ParseJsonError,
  ValidationError,
} from "./types";

export const getDefaultPort = () => {
  const DEFAULT_PORT = 3000;
  return DEFAULT_PORT;
};

export const makeValidationError = (message: string): ValidationError => ({
  type: "ValidationError",
  message,
});

export const makeFileReadError = (error: unknown): FileReadError => ({
  type: "FileReadError",
  message:
    error instanceof Error
      ? error.message
      : "Error reading file, unknown reason",
});

export const makeParseJsonError = (error: unknown): ParseJsonError => ({
  type: "JsonParseError",
  message: error instanceof Error ? error.message : "Error parsing JSON",
});

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

export const isValidPortRange = (port: number) => port > 0 && port < 65536;

export const hasPortProperty = (
  value: Record<string, unknown>
): value is Config => "port" in value;
