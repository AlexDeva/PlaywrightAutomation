import type { Page } from '@playwright/test';

type ProfileResponse = Record<string, string | number>;

export async function mockUserProfile(
  page: Page,
  status: number,
  body: ProfileResponse,
): Promise<void> {
  await page.route('https://example.test/**', async (route) => {
    const requestUrl = new URL(route.request().url());

    if (requestUrl.pathname === '/api/v1/user/profile') {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><html><body>Mock application shell</body></html>',
    });
  });
}
