import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vite.config.ts",
    test: {
      include: ["**/*.unit.test.ts"],
      name: "unit test",
      environment: "happy-dom",
    },
  },
  {
    extends: "vite.config.ts",
    test: {
      include: ["**/*.browser.test.ts"],
      name: "browser",
      browser: {
        enabled: true,
        name: "chromium",
        provider: "playwright",
        // https://playwright.dev
        providerOptions: {},
      },
      setupFiles: "./vitest.browser.setup.ts",
    },
  },
]);
