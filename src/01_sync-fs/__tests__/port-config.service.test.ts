import { describe, it, expect, beforeEach, vi } from "vitest";
import { fs, vol } from "memfs";
import { getPortFromConfig } from "../services/port-config.service";

vi.mock("node:fs");
vi.mock("node:fs/promises");

describe("getPortFromConfig", () => {
  beforeEach(() => {
    vol.reset();
    fs.mkdirSync("./assets", { recursive: true });
  });

  describe("when config file does not exist", () => {
    it("should throw file not found error", () => {
      expect(() => getPortFromConfig("config.json")).toThrowError(
        "no such file or directory"
      );
    });
  });

  describe("when config file exists", () => {
    it("should return configured port when JSON contains valid port", () => {
      fs.writeFileSync("./assets/config.json", '{"port": 8080}');
      const port = getPortFromConfig("config.json");
      expect(port).toBe(8080);
    });

    it("should return default port when port number exceeds maximum allowed value (65535)", () => {
      fs.writeFileSync("./assets/config.json", '{"port": 123123123}');
      const port = getPortFromConfig("config.json");
      expect(port).toBe(3000);
    });

    it("should return default port when port number is negative ", () => {
      fs.writeFileSync("./assets/config.json", '{"port": -1}');
      const port = getPortFromConfig("config.json");
      expect(port).toBe(3000);
    });

    it("should return default port when port value is not a number (type: string)", () => {
      fs.writeFileSync("./assets/config.json", '{"port": "hola"}');
      const port = getPortFromConfig("config.json");
      expect(port).toBe(3000);
    });

    it("should return default port when port property is missing", () => {
      fs.writeFileSync("./assets/config.json", '{"message": "Hello"}');
      const port = getPortFromConfig("config.json");
      expect(port).toBe(3000);
    });

    it("should return default port when JSON is empty", () => {
      fs.writeFileSync("./assets/config.json", "{}");
      const port = getPortFromConfig("config.json");
      expect(port).toBe(3000);
    });

    it("should throw parse error when JSON is malformed", () => {
      fs.writeFileSync("./assets/config.json", "{invalid}");
      expect(() => getPortFromConfig("config.json")).toThrowError(
        "Expected property name"
      );
    });
  });
});
