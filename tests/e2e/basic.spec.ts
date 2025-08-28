import { test, expect } from '@playwright/test';

test('login page renders', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/login');
  await expect(page.locator('body')).toBeVisible();
});
