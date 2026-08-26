import { test, expect } from '@playwright/test';

test.describe('Phase 3: Document Upload Pipeline (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      return indexedDB.deleteDatabase('visarethink');
    });
    await page.reload();
  });

  test('Uploads mandatory documents, inspects preview, downloads template, persists across reload, and continues', async ({
    page,
  }) => {
    // --- STAGE 1: Visa Selection ---
    await page.getByLabel('Where are you traveling to?').selectOption('USA');
    await page.getByRole('radio', { name: /Tourism & Leisure/i }).check();
    await page.getByRole('button', { name: /Continue to Personal Details/i }).click();

    // --- STAGE 2a: Identity ---
    await page.getByLabel(/First \/ Given Name/i).fill('Priya');
    await page.getByLabel(/Last Name \/ Surname/i).fill('Patel');
    await page.getByLabel(/Date of Birth/i).fill('1994-08-20');
    await page.getByLabel(/Gender/i).selectOption('female');
    await page.getByLabel(/Passport Number/i).fill('BB7654321');
    await page.getByLabel(/Date of Issue/i).fill('2021-02-15');
    await page.getByLabel(/Date of Expiry/i).fill('2031-02-15');
    await page.getByRole('button', { name: /Continue to Contact & Address/i }).click();

    // --- STAGE 2b: Contact ---
    await page.getByLabel(/Email Address/i).fill('priya.patel@example.com');
    await page.getByLabel(/Mobile Phone Number/i).fill('9876501234');
    await page.getByLabel(/Residential Address \(Line 1\)/i).fill('123 MG Road, Indiranagar');
    await page.getByLabel(/City \/ Town/i).fill('Bengaluru');
    await page.getByLabel(/State \/ UT/i).fill('Karnataka');
    await page.getByLabel(/6-Digit PIN Code/i).fill('560038');
    await page.getByRole('button', { name: /Continue to Trip Details/i }).click();

    // --- STAGE 2c: Trip Specifics ---
    await page.getByLabel(/Planned Arrival Date/i).fill('2026-11-01');
    await page.getByLabel(/Hotel Name or Stay Address/i).fill('Hilton Midtown, New York, NY');
    await page.getByRole('button', { name: /Continue to Document Upload/i }).click();

    // --- STAGE 3: Document Upload Pipeline ---
    await expect(page.getByText('Stage 3: Document Upload Pipeline')).toBeVisible();
    await expect(page.getByText('Documents: 0 of 3 mandatory ready')).toBeVisible();

    // 1. Open Sample Guidance Sheet for Passport
    await page
      .getByRole('button', { name: /View sample & tips/i })
      .first()
      .click();
    await expect(page.getByText(/Sample & Tips: Indian Passport/i)).toBeVisible();
    await expect(page.getByText('Passport Bio & Address Page Specifications')).toBeVisible();
    await page.getByRole('button', { name: 'Got it, I understand' }).click();

    // 2. Download Template from optional slot
    const downloadPromise = page.waitForEvent('download');
    await page
      .getByRole('button', { name: /Download template/i })
      .first()
      .click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.txt');

    // 3. Upload Passport Bio Page (Pages 1-2)
    const mockImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    );

    const bioInput = page.getByLabel(/Upload file or PDF for Passport Bio Page/i);
    await bioInput.setInputFiles({
      name: 'passport_bio.jpg',
      mimeType: 'image/jpeg',
      buffer: mockImageBuffer,
    });

    await expect(page.getByText('passport_bio.jpg')).toBeVisible();
    await expect(page.getByText(/✓ Ready/i).first()).toBeVisible();
    await page
      .getByRole('button', { name: /✓ Use This Image Anyway/i })
      .first()
      .click();

    // 4. Upload Passport Address Page (Pages 35-36)
    const addressInput = page.getByLabel(/Upload file or PDF for Passport Address Page/i);
    await addressInput.setInputFiles({
      name: 'passport_address.jpg',
      mimeType: 'image/jpeg',
      buffer: mockImageBuffer,
    });

    await expect(page.getByText('passport_address.jpg')).toBeVisible();
    await page
      .getByRole('button', { name: /✓ Use This Image Anyway/i })
      .first()
      .click();

    // 5. Test Draft Resumption across Reload (STATE-03, STATE-04)
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    await page.reload();

    await expect(page.getByText('Stage 3: Document Upload Pipeline')).toBeVisible();
    await expect(page.getByText('Documents: 2 of 3 mandatory ready')).toBeVisible();
    await expect(page.getByText('passport_bio.jpg')).toBeVisible();
    await expect(page.getByText('passport_address.jpg')).toBeVisible();

    // 6. Upload Photograph
    const photoInput = page.getByLabel(/Upload file or PDF for Recent Passport Photograph/i);
    await photoInput.setInputFiles({
      name: 'recent_photo.jpg',
      mimeType: 'image/jpeg',
      buffer: mockImageBuffer,
    });

    await expect(page.getByText('recent_photo.jpg')).toBeVisible();
    await page
      .getByRole('button', { name: /✓ Use This Image Anyway/i })
      .first()
      .click();

    await expect(page.getByText('Documents: 3 of 3 mandatory ready')).toBeVisible();

    // 7. Open Document Preview Sheet
    await page.getByLabel('Preview recent_photo.jpg').click();
    await expect(page.getByText('Inspection Checklist:')).toBeVisible();
    await page.getByRole('button', { name: 'Done' }).click();

    // 8. Continue to Stage 4
    await page.getByRole('button', { name: /Continue to Review & Payment/i }).click();

    // Verify reached Stage 4
    await expect(
      page.getByRole('heading', { name: /Review Application & Complete Payment/i }),
    ).toBeVisible();
  });
});
