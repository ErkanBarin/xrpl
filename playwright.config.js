// @ts-check
import { defineConfig, devices } from'@playwright/test';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';

const env = process.env.NODE_ENV || 'qa';
dotenv.config({ path: `.env/.env.${env}` });

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Create base64 encoded credentials
const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
   reporter: [
    ["list"],
    ["html"],
    ["json", { outputFile: "test-results/test-results.json" }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
   baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'x-transaction-id': uuidv4(),
      'channel': process.env.CHANNEL || 'CS',
      'siteId': process.env.SITE_ID || 'TNF-US',
      'brand': process.env.BRAND || 'TNF',
      'region': process.env.REGION || 'NORA',
      'source': process.env.SOURCE || 'OMS',
      'locale': process.env.LOCALE || 'en_US',
      'client_id': process.env.CLIENT_ID || '',
      'client_secret': process.env.CLIENT_SECRET || '',
      'Content-Type': 'application/json',
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

