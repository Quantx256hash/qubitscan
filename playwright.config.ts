import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 3040);
const baseURL = process.env.QUBITSCAN_E2E_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    channel: process.env.PLAYWRIGHT_CHROME_CHANNEL ?? "chrome",
    trace: "retain-on-failure",
  },
  webServer: process.env.QUBITSCAN_E2E_BASE_URL
    ? undefined
    : {
        command: `pnpm start -p ${port}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
