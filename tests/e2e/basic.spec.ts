import { test, expect } from '@playwright/test';

test('login page renders', async ({ page }) => {
  const baseUrl = process.env.PUBLIC_BASE_URL!;
  await page.goto(`${baseUrl}/auth/login`);
  await expect(page.locator('body')).toBeVisible();
});
