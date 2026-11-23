import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  testMatch: "scene-contracts.spec.ts",
  reporter: "list",
});
