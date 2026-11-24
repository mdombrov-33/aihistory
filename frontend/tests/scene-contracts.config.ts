import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./contracts",
  testMatch: "**/*.spec.ts",
  reporter: "list",
});
