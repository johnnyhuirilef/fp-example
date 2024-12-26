import { describe, it, expect, beforeEach, vi } from "vitest";
import { fs, vol } from "memfs";
import { getPortFromConfig } from "../services/port-config.service";
import { pipe } from "fp-ts/function";

vi.mock("node:fs");
vi.mock("node:fs/promises");

describe("getPortFromConfig", () => {
  beforeEach(() => {
    vol.reset();
    fs.mkdirSync("./assets", { recursive: true });
  });

  describe("when config file does not exist", () => {
    it("should throw file not found error", async () => {
      const program = pipe(getPortFromConfig());
      const result = await program();
      expect(result).toMatchObject({
        _tag: "Left",
        left: {
          type: "FileReadError",
        },
      });
    });
  });

  describe("when config file exists", () => {
    it("should return configured port when JSON contains valid port", async () => {
      fs.writeFileSync("./assets/config.json", '{"port": 8080}');
      const program = pipe(getPortFromConfig());
      const result = await program();
      expect(result).toMatchObject({
        _tag: "Right",
        right: 8080,
      });
    });

    it("should return default port when port number exceeds maximum allowed value (65535)", async () => {
      fs.writeFileSync("./assets/config.json", '{"port": 123123123}');
      const program = pipe(getPortFromConfig());
      const result = await program();
      expect(result).toMatchObject({
        _tag: "Left",
        left: { type: "ValidationError", message: "Port out of range" },
      });
    });

    it("should return default port when port number is negative ", async () => {
      fs.writeFileSync("./assets/config.json", '{"port": -1}');
      const program = pipe(getPortFromConfig());
      const result = await program();
      expect(result).toMatchObject({
        _tag: "Left",
        left: { type: "ValidationError", message: "Port out of range" },
      });
    });

    it("should return default port when port value is not a number (type: string)", async () => {
      fs.writeFileSync("./assets/config.json", '{"port": "hola"}');
      const program = pipe(getPortFromConfig());
      const result = await program();
      expect(result).toMatchObject({
        _tag: "Left",
        left: { type: "ValidationError", message: "Invalid port" },
      });
    });

    it("should return default port when port property is missing", async () => {
      fs.writeFileSync("./assets/config.json", '{"message": "Hello"}');
      const program = pipe(getPortFromConfig());
      const result = await program();
      expect(result).toMatchObject({
        _tag: "Left",
        left: { type: "ValidationError", message: "Invalid port" },
      });
    });

    it("should return default port when JSON is empty", async () => {
      fs.writeFileSync("./assets/config.json", "{}");
      const program = pipe(getPortFromConfig());
      const result = await program();
      expect(result).toMatchObject({
        _tag: "Left",
        left: { type: "ValidationError", message: "Invalid port" },
      });
    });

    it("should throw parse error when JSON is malformed", async () => {
      fs.writeFileSync("./assets/config.json", "{invalid}");
      const program = pipe(getPortFromConfig());
      const result = await program();
      expect(result).toMatchObject({
        _tag: "Left",
        left: {
          type: "JsonParseError",
        },
      });
    });
  });
});
