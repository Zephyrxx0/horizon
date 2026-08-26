import { test, expect } from '@playwright/test';

test.describe('Document Upload & IndexedDB Persistence', () => {
  test('attaches document, compresses and persists to IndexedDB, survives full page reload', async ({
    page,
  }) => {
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      return indexedDB.deleteDatabase('visarethink');
    });
    await page.reload();

    // Stage 1
    await page.getByLabel('Where are you traveling to?').selectOption('USA');
    await page.getByRole('radio', { name: /Tourism & Leisure/i }).check();
    await page.getByRole('button', { name: /Continue to Personal Details/i }).click();

    // Stage 2a
    await page.getByLabel(/First \/ Given Name/i).fill('Aarav');
    await page.getByLabel(/Last Name \/ Surname/i).fill('Mehta');
    await page.getByLabel(/Date of Birth/i).fill('1990-01-01');
    await page.getByLabel(/Gender/i).selectOption('male');
    await page.getByLabel(/Passport Number/i).fill('CC9988776');
    await page.getByLabel(/Date of Issue/i).fill('2020-01-01');
    await page.getByLabel(/Date of Expiry/i).fill('2030-01-01');
    await page.getByRole('button', { name: /Continue to Contact & Address/i }).click();

    // Stage 2b
    await page.getByLabel(/Email Address/i).fill('aarav@example.com');
    await page.getByLabel(/Mobile Phone Number/i).fill('9876543210');
    await page.getByLabel(/Residential Address \(Line 1\)/i).fill('Bandra West');
    await page.getByLabel(/City \/ Town/i).fill('Mumbai');
    await page.getByLabel(/State \/ UT/i).fill('Maharashtra');
    await page.getByLabel(/6-Digit PIN Code/i).fill('400050');
    await page.getByRole('button', { name: /Continue to Trip Details/i }).click();

    // Stage 2c
    await page.getByLabel(/Planned Arrival Date/i).fill('2026-12-01');
    await page.getByLabel(/Hotel Name or Stay Address/i).fill('Marriott NY');
    await page.getByRole('button', { name: /Continue to Document Upload/i }).click();

    // In Stage 3: Attach a document
    const fileInput = page.getByLabel(/Upload file or PDF for Recent Passport Photograph/i);
    await fileInput.setInputFiles({
      name: 'passport-scan.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64',
      ),
    });

    // Wait for document name and Ready confirmation
    await expect(page.getByText('passport-scan.png')).toBeVisible();
    await expect(page.getByText(/✓ Ready/i).first()).toBeVisible();

    // Reload the full page
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.reload();

    // After reload and remount, document must still be present and Ready
    await expect(page.getByText('passport-scan.png')).toBeVisible();
    await expect(page.getByText(/✓ Ready/i).first()).toBeVisible();
  });
});
