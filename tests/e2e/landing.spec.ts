import { test, expect } from '@playwright/test';

test('landing has no admin link and ctas navigate', async ({ page }) => {
  const baseUrl = process.env.PUBLIC_BASE_URL!;
  await page.goto(`${baseUrl}/`);
  await expect(page.getByText('Entrar al Admin')).toHaveCount(0);
  await page.getByRole('link', { name: 'Ver servicios' }).click();
  await expect(page.locator('#servicios')).toBeVisible();
  await page.getByRole('link', { name: 'Contactar' }).click();
  await expect(page.locator('#contacto')).toBeVisible();
});
