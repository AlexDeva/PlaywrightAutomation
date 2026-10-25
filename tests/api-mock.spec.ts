import { expect, test } from '@playwright/test';
import { mockUserProfile } from '../utils/mocks';

test.describe('API profile route mocks', () => {
  test('returns a mocked successful profile response', async ({ page }) => {
    await mockUserProfile(page, 200, {
      id: 42,
      name: 'Ada Lovelace',
      email: 'ada@example.test',
    });
    await page.goto('https://example.test');

    const response = await page.evaluate(async () => {
      const result = await fetch('/api/v1/user/profile');
      return {
        status: result.status,
        body: (await result.json()) as Record<string, string | number>,
      };
    });

    expect(response).toEqual({
      status: 200,
      body: {
        id: 42,
        name: 'Ada Lovelace',
        email: 'ada@example.test',
      },
    });
  });

  test('returns a mocked error profile response', async ({ page }) => {
    await mockUserProfile(page, 401, {
      error: 'Unauthorized',
    });
    await page.goto('https://example.test');

    const response = await page.evaluate(async () => {
      const result = await fetch('/api/v1/user/profile');
      return {
        status: result.status,
        body: (await result.json()) as Record<string, string>,
      };
    });

    expect(response).toEqual({
      status: 401,
      body: { error: 'Unauthorized' },
    });
  });
});
