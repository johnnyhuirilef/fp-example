export type Config = {
  port: number;
};

export type ValidationError = {
  readonly type: "ValidationError";
  readonly message: string;
};

export type FileReadError = {
  readonly type: "FileReadError";
  readonly message: string;
};

export type ParseJsonError = {
  readonly type: "JsonParseError";
  readonly message: string;
};

export type AppError = FileReadError | ValidationError | ParseJsonError;
