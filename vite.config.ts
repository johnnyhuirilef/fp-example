import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "./vite.config.ts",
        "coverage/**",
        "dist/**",
        "**/[.]*",
        "**/*.d.ts",
        "**/*.test.{js,cjs,mjs,ts,tsx,jsx}",
        "**/_*.{js,cjs,mjs,ts,tsx,jsx}",
        // Exclude all main.ts files
        "**/src/**/main.ts",
        "**/src/shared/types.ts",
      ],
    },
  },
});
