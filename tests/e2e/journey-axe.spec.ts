import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Whole-Journey Automated WCAG 2.1 AA Accessibility Gates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      return indexedDB.deleteDatabase('visarethink');
    });
    await page.reload();
  });

  test('walks through entire 5-stage application journey with zero axe-core violations', async ({
    page,
  }) => {
    test.setTimeout(60000);

    const checkA11y = async (contextName: string) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations, `A11y violations found in ${contextName}`).toEqual([]);
    };

    // ==========================================
    // STAGE 1: Visa Selection
    // ==========================================
    await expect(page.getByText('Select Your Visa & Destination')).toBeVisible();
    await checkA11y('Stage 1: Visa Selection');

    await page.getByLabel('Where are you traveling to?').selectOption('USA');
    await page.getByRole('radio', { name: /Tourism & Leisure/i }).check();
    await page.getByRole('button', { name: /Continue to Personal Details/i }).click();

    // ==========================================
    // STAGE 2a: Personal Details (Identity)
    // ==========================================
    await expect(page.getByRole('heading', { name: /Identity & Passport Details/i })).toBeVisible();
    await checkA11y('Stage 2a: Identity & Passport');

    await page.getByLabel(/First \/ Given Name/i).fill('Aarav');
    await page.getByLabel(/Last Name \/ Surname/i).fill('Patel');
    await page.getByLabel(/Date of Birth/i).fill('1990-05-15');
    await page.getByLabel(/Gender/i).selectOption('male');
    await page.getByLabel(/Passport Number/i).fill('AA1234567');
    await page.getByLabel(/Date of Issue/i).fill('2020-01-01');
    await page.getByLabel(/Date of Expiry/i).fill('2030-01-01');
    await page.getByRole('button', { name: /Continue to Contact & Address/i }).click();

    // ==========================================
    // STAGE 2b: Personal Details (Contact)
    // ==========================================
    await expect(
      page.getByRole('heading', { name: /Contact & Residential Address/i }),
    ).toBeVisible();
    await checkA11y('Stage 2b: Contact & Address');

    await page.getByLabel(/Email Address/i).fill('aarav.patel@example.com');
    await page.getByLabel(/Mobile Phone Number/i).fill('9876543210');
    await page.getByLabel(/Residential Address \(Line 1\)/i).fill('42 MG Road');
    await page.getByLabel(/City \/ Town/i).fill('Bengaluru');
    await page.getByLabel(/State \/ UT/i).fill('Karnataka');
    await page.getByLabel(/6-Digit PIN Code/i).fill('560001');
    await page.getByRole('button', { name: /Continue to Trip Details/i }).click();

    // ==========================================
    // STAGE 2c: Personal Details (Trip Specifics)
    // ==========================================
    await expect(page.getByRole('heading', { name: /Travel & Visa Specifics/i })).toBeVisible();
    await checkA11y('Stage 2c: Trip Specifics');

    await page.getByLabel(/Planned Arrival Date/i).fill('2026-11-15');
    await page.getByLabel(/Hotel Name or Stay Address/i).fill('Hilton Midtown, New York, NY');
    await page.getByRole('button', { name: /Continue to Document Upload/i }).click();

    // ==========================================
    // STAGE 3: Documents Upload
    // ==========================================
    await expect(page.getByText('Stage 3: Document Upload Pipeline')).toBeVisible();
    await checkA11y('Stage 3: Documents Upload');

    const mockImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    );

    // 1. Passport Bio Page
    const bioInput = page.getByLabel(/Upload file or PDF for Passport Bio Page/i);
    await bioInput.setInputFiles({
      name: 'passport_bio.jpg',
      mimeType: 'image/jpeg',
      buffer: mockImageBuffer,
    });
    await expect(page.getByText('passport_bio.jpg')).toBeVisible();
    const ack1 = page.getByRole('button', { name: /✓ Use This Image Anyway/i }).first();
    if (await ack1.isVisible({ timeout: 1500 }).catch(() => false)) {
      await ack1.click();
    }

    // 2. Passport Address Page
    const addressInput = page.getByLabel(/Upload file or PDF for Passport Address Page/i);
    await addressInput.setInputFiles({
      name: 'passport_address.jpg',
      mimeType: 'image/jpeg',
      buffer: mockImageBuffer,
    });
    await expect(page.getByText('passport_address.jpg')).toBeVisible();
    const ack2 = page.getByRole('button', { name: /✓ Use This Image Anyway/i }).first();
    if (await ack2.isVisible({ timeout: 1500 }).catch(() => false)) {
      await ack2.click();
    }

    // 3. Passport Photo
    const photoInput = page.getByLabel(/Upload file or PDF for Recent Passport Photograph/i);
    await photoInput.setInputFiles({
      name: 'recent_photo.jpg',
      mimeType: 'image/jpeg',
      buffer: mockImageBuffer,
    });
    await expect(page.getByText('recent_photo.jpg')).toBeVisible();
    const ack3 = page.getByRole('button', { name: /✓ Use This Image Anyway/i }).first();
    if (await ack3.isVisible({ timeout: 1500 }).catch(() => false)) {
      await ack3.click();
    }

    await expect(page.getByText('Documents: 3 of 3 mandatory ready')).toBeVisible();

    await page.getByRole('button', { name: /Continue to Review & Payment/i }).click();

    // ==========================================
    // STAGE 4: Review & Payment
    // ==========================================
    await expect(
      page.getByRole('heading', { name: /Review Application & Complete Payment/i }),
    ).toBeVisible();
    await checkA11y('Stage 4: Review & Payment');

    // Agree to declaration
    await page.getByRole('checkbox', { name: /I declare that all information provided/i }).check();

    // Fill UPI ID
    await page.getByLabel(/Virtual Payment Address/i).fill('priya@okhdfcbank');

    // Pay and Submit Application
    await page.getByRole('button', { name: /Pay ₹.*& Submit Application/i }).click();

    // ==========================================
    // STAGE 5: Confirmation
    // ==========================================
    await expect(page.getByText('Application Submitted Successfully!')).toBeVisible({
      timeout: 10000,
    });
    await checkA11y('Stage 5: Confirmation');
  });

  test('scans global modals and sheets for zero accessibility violations', async ({ page }) => {
    const checkA11y = async (contextName: string) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations, `A11y violations found in ${contextName}`).toEqual([]);
    };

    // 1. FAQ Sheet
    await page.getByTestId('header-help-btn').click();
    await expect(page.getByText(/Frequently Asked Questions/i)).toBeVisible();
    await checkA11y('FAQ Sheet Modal');
    await page.keyboard.press('Escape');

    // 2. Standalone Application Tracker Modal
    await page.getByTestId('header-track-btn').click();
    await expect(
      page.getByRole('heading', { name: /Track Your Application Status/i }),
    ).toBeVisible();
    await checkA11y('Tracking Modal');
    await page.keyboard.press('Escape');

    // 3. Draft Backup & Restore Modal
    await page.getByTestId('header-backup-btn').click();
    await expect(
      page.getByRole('heading', { name: /Cross-Device Draft Backup & Recovery/i }),
    ).toBeVisible();
    await checkA11y('Backup Modal');
    await page.keyboard.press('Escape');

    // 4. Shared Computer Clear Data Modal
    await page.getByTestId('header-clear-btn').click();
    await expect(
      page.getByRole('heading', { name: /Clear Draft & Public Computer Reset/i }),
    ).toBeVisible();
    await checkA11y('Clear Data Modal');
    await page.keyboard.press('Escape');
  });
});
