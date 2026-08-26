import { test, expect } from '@playwright/test';

test.describe('App Smoke Test', () => {
  test('loads shell without console errors and displays wordmark', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/VisaReThink/);

    // Check header wordmark
    const wordmark = page.locator('header').getByText('VisaReThink');
    await expect(wordmark).toBeVisible();

    // Check main heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Verify zero console errors
    expect(consoleErrors).toEqual([]);
  });
});
