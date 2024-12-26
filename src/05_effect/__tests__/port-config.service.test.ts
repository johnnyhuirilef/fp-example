import { describe, it, expect, beforeEach, vi } from "vitest";
import { fs, vol } from "memfs";
import { getPortFromConfig } from "../services/port-config.service";
import { Effect } from "effect";

vi.mock("node:fs");
vi.mock("node:fs/promises");

describe("getPortFromConfig", () => {
  beforeEach(() => {
    vol.reset();
    fs.mkdirSync("./assets", { recursive: true });
  });

  describe("when config file does not exist", () => {
    it("should throw file not found error", async () => {
      const result = await Effect.runPromiseExit(getPortFromConfig());
      expect(result.toJSON()).toMatchObject({
        _tag: "Failure",
        cause: {
          failure: {
            type: "FileReadError",
          },
        },
      });
    });
  });

  describe("when config file exists", () => {
    it("should return configured port when JSON contains valid port", async () => {
      fs.writeFileSync("./assets/config.json", '{"port": 8080}');
      const result = await Effect.runPromiseExit(getPortFromConfig());
      expect(result.toJSON()).toMatchObject({
        _tag: "Success",
        value: 8080,
      });
    });

    it("should return default port when port number exceeds maximum allowed value (65535)", async () => {
      fs.writeFileSync("./assets/config.json", '{"port": 123123123}');
      const result = await Effect.runPromiseExit(getPortFromConfig());
      expect(result.toJSON()).toMatchObject({
        _tag: "Failure",
        cause: {
          failure: { type: "ValidationError", message: "Port out of range" },
        },
      });
    });

    it("should return default port when port number is negative ", async () => {
      fs.writeFileSync("./assets/config.json", '{"port": -1}');
      const result = await Effect.runPromiseExit(getPortFromConfig());
      expect(result.toJSON()).toMatchObject({
        _tag: "Failure",
        cause: {
          failure: { type: "ValidationError", message: "Port out of range" },
        },
      });
    });

    it("should return default port when port value is not a number (type: string)", async () => {
      fs.writeFileSync("./assets/config.json", '{"port": "hola"}');

      const result = await Effect.runPromiseExit(getPortFromConfig());
      expect(result.toJSON()).toMatchObject({
        _tag: "Failure",
        cause: {
          failure: { type: "ValidationError", message: "Invalid port" },
        },
      });
    });

    it("should return default port when port property is missing", async () => {
      fs.writeFileSync("./assets/config.json", '{"message": "Hello"}');
      const result = await Effect.runPromiseExit(getPortFromConfig());
      expect(result.toJSON()).toMatchObject({
        _tag: "Failure",
        cause: {
          failure: { type: "ValidationError", message: "Invalid port" },
        },
      });
    });

    it("should return default port when JSON is empty", async () => {
      fs.writeFileSync("./assets/config.json", "{}");
      const result = await Effect.runPromiseExit(getPortFromConfig());
      expect(result.toJSON()).toMatchObject({
        _tag: "Failure",
        cause: {
          failure: { type: "ValidationError", message: "Invalid port" },
        },
      });
    });

    it("should throw parse error when JSON is malformed", async () => {
      fs.writeFileSync("./assets/config.json", "{invalid}");

      const result = await Effect.runPromiseExit(getPortFromConfig());
      expect(result.toJSON()).toMatchObject({
        _tag: "Failure",
        cause: {
          failure: {
            type: "JsonParseError",
          },
        },
      });
    });
  });
});
