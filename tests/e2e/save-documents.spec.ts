import { test, expect } from '@playwright/test';

test.describe('Document Upload & IndexedDB Persistence', () => {
  test('attaches document, compresses and persists to IndexedDB, survives full page reload', async ({
    page,
  }) => {
    await page.goto('/');

    // Complete Step 1
    await page.getByText(/tourism & sightseeing/i).click();
    await page.getByRole('button', { name: /continue application/i }).click();

    // Complete Step 2
    await page.getByRole('textbox', { name: /passport number/i }).fill('AB1234567');
    await page.getByRole('button', { name: /continue application/i }).click();

    // In Step 3: Attach a document
    const fileInput = page.locator('#doc-upload-input');
    await fileInput.setInputFiles({
      name: 'passport-scan.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64',
      ),
    });

    // Wait for document name and Ready badge
    await expect(page.getByText('passport-scan.png')).toBeVisible();
    await expect(page.getByText('Ready')).toBeVisible();

    // Verify summary shows 1 file
    await expect(page.getByText('1 file', { exact: false })).toBeVisible();

    // Reload the full page
    await page.reload();

    // After reload and remount, document must still be present and Ready
    await expect(page.getByText('passport-scan.png')).toBeVisible();
    await expect(page.getByText('Ready')).toBeVisible();
    await expect(page.getByText('1 file', { exact: false })).toBeVisible();
  });
});
