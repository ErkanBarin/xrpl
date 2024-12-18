import { test as base } from '@playwright/test';

export const test = base.extend({
  testData: async ({}, use) => {
    const data = {};
    await use(data);
  },
});