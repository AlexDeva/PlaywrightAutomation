import { defineConfig, devices } from '@playwright/test';
import { appConfig } from './config/env.config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  expect: {
    timeout: 30_000,
  },
  timeout: 60_000,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'saucedemo-chromium',
      testMatch: 'saucedemo.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: appConfig.sauceDemoBaseUrl },
    },
    {
      name: 'saucedemo-firefox',
      testMatch: 'saucedemo.spec.ts',
      use: { ...devices['Desktop Firefox'], baseURL: appConfig.sauceDemoBaseUrl },
    },
    {
      name: 'playground-chromium',
      testMatch: 'ui-testing-playground.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: appConfig.uiPlaygroundBaseUrl },
    },
    {
      name: 'playground-firefox',
      testMatch: 'ui-testing-playground.spec.ts',
      use: { ...devices['Desktop Firefox'], baseURL: appConfig.uiPlaygroundBaseUrl },
    },
    {
      name: 'api-mock-chromium',
      testMatch: 'api-mock.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
