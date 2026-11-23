import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: [
    {
      command: "npm start",
      cwd: "../backend",
      url: "http://localhost:5000/api/health",
      timeout: 60000,
      reuseExistingServer: true,
      env: {
        DATABASE_URL:
          process.env.DATABASE_URL ||
          "postgres://postgres:postgres@localhost:5432/portafolio",
        AUTO_MIGRATE: "true",
        PORT: "5000"
      }
    },
    {
      command: "npm run dev",
      cwd: ".",
      url: "http://localhost:5173",
      timeout: 60000,
      reuseExistingServer: true
    }
  ]
});
