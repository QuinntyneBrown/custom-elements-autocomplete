import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/storybook',
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  outputDir: 'test-results-storybook',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report-storybook', open: 'never' }]],
  use: {
    channel: 'chromium',
    baseURL: 'http://127.0.0.1:6006',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: 'npm run preview-storybook',
    url: 'http://127.0.0.1:6006',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
