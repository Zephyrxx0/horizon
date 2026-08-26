import { test, expect } from '@playwright/test';

test.describe('Phase 4: Review, Payment & Submission (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      return indexedDB.deleteDatabase('visarethink');
    });
    await page.reload();
  });

  test('Full Stage 4 Journey: Review check-answers, deep-link editing round-trip, declaration gate, payment scenario recovery, and official receipt', async ({
    page,
  }) => {
    // --- STAGE 1: Visa Selection ---
    await page.getByLabel('Where are you traveling to?').selectOption('USA');
    await page.getByRole('radio', { name: /Tourism & Leisure/i }).check();
    await page.getByRole('button', { name: /Continue to Personal Details/i }).click();

    // --- STAGE 2a: Identity ---
    await page.getByLabel(/First \/ Given Name/i).fill('Rahul');
    await page.getByLabel(/Last Name \/ Surname/i).fill('Sharma');
    await page.getByLabel(/Date of Birth/i).fill('1992-05-10');
    await page.getByLabel(/Gender/i).selectOption('male');
    await page.getByLabel(/Passport Number/i).fill('AA1234567');
    await page.getByLabel(/Date of Issue/i).fill('2020-01-01');
    await page.getByLabel(/Date of Expiry/i).fill('2030-01-01');
    await page.getByRole('button', { name: /Continue to Contact & Address/i }).click();

    // --- STAGE 2b: Contact ---
    await page.getByLabel(/Email Address/i).fill('rahul.sharma@example.com');
    await page.getByLabel(/Mobile Phone Number/i).fill('9876543210');
    await page.getByLabel(/Residential Address \(Line 1\)/i).fill('123 Brigade Road');
    await page.getByLabel(/City \/ Town/i).fill('Bengaluru');
    await page.getByLabel(/State \/ UT/i).fill('Karnataka');
    await page.getByLabel(/6-Digit PIN Code/i).fill('560001');
    await page.getByRole('button', { name: /Continue to Trip Details/i }).click();

    // --- STAGE 2c: Trip Specifics ---
    await page.getByLabel(/Planned Arrival Date/i).fill('2026-12-01');
    await page.getByLabel(/Hotel Name or Stay Address/i).fill('Grand Hyatt, New York, NY');
    await page.getByRole('button', { name: /Continue to Document Upload/i }).click();

    // --- STAGE 3: Document Upload ---
    await expect(page.getByText('Stage 3: Document Upload Pipeline')).toBeVisible();

    const mockImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    );

    // 1. Upload Passport Bio Page
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

    // 2. Upload Passport Address Page
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

    // 3. Upload Photo
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

    // --- STAGE 4: Review, Payment & Submission ---
    await expect(
      page.getByRole('heading', { name: /Review Application & Complete Payment/i }),
    ).toBeVisible();

    // 1. Verify Check-Answers summary cards
    await expect(page.getByRole('heading', { name: 'Visa Selection' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Personal & Passport Details' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Uploaded Documents' })).toBeVisible();
    await expect(page.getByText('Rahul Sharma')).toBeVisible();
    await expect(page.getByText('AA1234567')).toBeVisible();
    await expect(page.getByText('rahul.sharma@example.com')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Total Amount Due' })).toBeVisible();
    await expect(page.getByText('Zero hidden charges')).toBeVisible();
    await expect(page.getByText('₹8,500', { exact: true }).first()).toBeVisible();

    // 2. Test Deep-Link Round-Trip Editing
    await page.getByRole('button', { name: /Edit Stage 2/i }).click();
    await expect(page.getByRole('region', { name: /Editing Mode Banner/i })).toBeVisible();
    await expect(page.getByText(/Editing Stage 2: Identity & Passport/i)).toBeVisible();

    // Update First Name
    const firstNameInput = page.getByLabel(/First \/ Given Name/i);
    await firstNameInput.fill('RahulDev');

    // Click Return to Review in sticky banner
    await page.getByRole('button', { name: /Return to Review/i }).click();
    await expect(
      page.getByRole('heading', { name: /Review Application & Complete Payment/i }),
    ).toBeVisible();
    await expect(page.getByText('RahulDev Sharma')).toBeVisible();

    // 3. Test Declaration Validation Gate
    const paySubmitBtn = page.getByRole('button', { name: /Pay ₹8,500 & Submit Application/i });
    await paySubmitBtn.click();
    await expect(page.getByRole('alert').first()).toBeVisible();
    await expect(
      page.getByText(/You must confirm the applicant declaration before proceeding/i).first(),
    ).toBeVisible();

    // Fill UPI VPA and Check declaration checkbox
    await page.getByLabel(/Virtual Payment Address \(UPI ID\)/i).fill('rahul@okhdfcbank');
    await page.getByLabel(/I declare that all information provided is true/i).check();

    // 4. Test Payment Failure Simulation & In-Context Error Card
    await page.getByRole('button', { name: /Card Declined/i }).click();
    await paySubmitBtn.click();

    // Wait for processing modal then failure card
    await expect(page.getByRole('alert').first()).toBeVisible();
    await expect(page.getByText(/Payment Could Not Be Completed/i)).toBeVisible();
    await expect(page.getByText(/declined by issuing bank/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Retry Payment/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Choose Another Method/i })).toBeVisible();

    // 5. Test Recovery: Switch scenario to Success and click Retry Payment
    await page.getByRole('button', { name: 'Success' }).click();
    await page.getByRole('button', { name: /Retry Payment/i }).click();

    // Wait for payment processing modal and transition to Stage 5
    await expect(
      page.getByRole('heading', { name: /Payment Receipt & Confirmation/i }),
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Official E-Receipt/i)).toBeVisible();
    await expect(page.getByText(/SUCCESSFUL/i)).toBeVisible();
    await expect(page.getByText('RahulDev Sharma')).toBeVisible();
    await expect(page.getByText('₹8,500', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Print \/ Download/i })).toBeVisible();
  });
});
