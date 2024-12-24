import type { FileReadError, ParseJsonError, ValidationError } from "./types";

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
