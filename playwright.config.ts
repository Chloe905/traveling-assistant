import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: [
    {
      command: 'npm run start',
      port: 4000,
      reuseExistingServer: true
    },
    {
      command: 'npm run dev',
      port: 8080,
      reuseExistingServer: true
    }
  ]
})
