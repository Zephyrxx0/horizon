import { test, expect } from '@playwright/test';

test.describe('Phase 5: Confirmation, Tracking & Recovery (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      return indexedDB.deleteDatabase('visarethink');
    });
    await page.reload();
  });

  test('Full Stage 5 Post-Submission Journey: Reference Card, Live Status Timeline Advance, Tailored Checklist Download, Notifications, Standalone Tracker, Backup/Restore, and Duplicate Passport Warning', async ({
    page,
  }) => {
    // ==========================================
    // 1. WALK THROUGH STAGES 1 TO 4 TO SUBMIT
    // ==========================================

    // --- STAGE 1: Visa Selection ---
    await page.getByLabel('Where are you traveling to?').selectOption('USA');
    await page.getByRole('radio', { name: /Tourism & Leisure/i }).check();
    await page.getByRole('button', { name: /Continue to Personal Details/i }).click();

    // --- STAGE 2a: Identity ---
    await page.getByLabel(/First \/ Given Name/i).fill('Priya');
    await page.getByLabel(/Last Name \/ Surname/i).fill('Sharma');
    await page.getByLabel(/Date of Birth/i).fill('1995-08-15');
    await page.getByLabel(/Gender/i).selectOption('female');
    await page.getByLabel(/Passport Number/i).fill('AA1234567');
    await page.getByLabel(/Date of Issue/i).fill('2021-01-01');
    await page.getByLabel(/Date of Expiry/i).fill('2031-01-01');
    await page.getByRole('button', { name: /Continue to Contact & Address/i }).click();

    // --- STAGE 2b: Contact ---
    await page.getByLabel(/Email Address/i).fill('priya.sharma@example.com');
    await page.getByLabel(/Mobile Phone Number/i).fill('9876543210');
    await page.getByLabel(/Residential Address \(Line 1\)/i).fill('42 MG Road');
    await page.getByLabel(/City \/ Town/i).fill('Bengaluru');
    await page.getByLabel(/State \/ UT/i).fill('Karnataka');
    await page.getByLabel(/6-Digit PIN Code/i).fill('560001');
    await page.getByRole('button', { name: /Continue to Trip Details/i }).click();

    // --- STAGE 2c: Trip Details ---
    await page.getByLabel(/Planned Arrival Date/i).fill('2026-11-15');
    await page.getByLabel(/Hotel Name or Stay Address/i).fill('Hilton Midtown, New York, NY');
    await page.getByRole('button', { name: /Continue to Document Upload/i }).click();

    // --- STAGE 3: Document Upload ---
    await expect(page.getByText('Stage 3: Document Upload Pipeline')).toBeVisible();

    const mockImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    );

    // 1. Bio Page
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

    // 2. Address Page
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

    // 3. Photo
    const photoInput = page.getByLabel(/Upload file or PDF for Recent Passport Photograph/i);
    await photoInput.setInputFiles({
      name: 'passport_photo.jpg',
      mimeType: 'image/jpeg',
      buffer: mockImageBuffer,
    });
    await expect(page.getByText('passport_photo.jpg')).toBeVisible();
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

    // Check declaration & fill UPI ID
    await page.getByLabel(/Virtual Payment Address \(UPI ID\)/i).fill('priya@okhdfcbank');
    await page.getByLabel(/I declare that all information provided is true/i).check();

    // Ensure payment scenario is Success
    await page.getByRole('button', { name: 'Success' }).click();

    // Submit payment
    await page.getByRole('button', { name: /Pay ₹8,500 & Submit Application/i }).click();

    // ==========================================
    // 2. STAGE 5 CONFIRMATION VERIFICATION
    // ==========================================
    await expect(page.getByTestId('stage5-confirmation-screen')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Application Submitted Successfully!')).toBeVisible();

    // Verify Reference Number Card (CNFRM-01)
    const refDisplay = page.getByTestId('reference-number-display');
    await expect(refDisplay).toBeVisible();
    const refText = await refDisplay.innerText();
    expect(refText).toMatch(/^VR-\d{4}-\d{6}$/);

    // Verify Copy Reference Button
    await page.getByTestId('copy-reference-btn').click();
    await expect(page.getByText('Reference Copied')).toBeVisible();

    // Verify WhatsApp Share Button (TRCK-03)
    await expect(page.getByTestId('share-whatsapp-btn')).toBeVisible();

    // Verify Status Timeline Card & Demo Scenario Advancement (CNFRM-02, TRCK-02)
    await expect(page.getByText('Live Status Timeline')).toBeVisible();
    await page.getByTestId('demo-advance-btn').click();
    await expect(page.getByText(/Application moved to:/)).toBeVisible();

    // Simulate Info Request
    await page.getByTestId('demo-info-request-btn').click();
    await expect(page.getByText(/Consulate requested additional document/i)).toBeVisible();

    // Simulate Approval
    await page.getByTestId('demo-approval-btn').click();
    await expect(page.getByText(/Visa Approved!/)).toBeVisible();

    // Verify Interview Checklist Card & Interactive Completion (CNFRM-03)
    await expect(page.getByText('Interview & Next Steps Checklist')).toBeVisible();
    const progressBadge = page.getByTestId('checklist-progress-badge');
    await expect(progressBadge).toContainText('0 of');

    // Toggle checklist item
    const firstCheckItem = page.getByLabel(/Mark Current Original Passport/i);
    await firstCheckItem.click();
    await expect(progressBadge).toContainText('1 of');

    // Verify Download Checklist
    await page.getByTestId('download-checklist-btn').click();
    await expect(page.getByText('Downloaded!')).toBeVisible();

    // Verify Sent Notifications Card Disclosure (CNFRM-04)
    await expect(page.getByText('Simulated Email & SMS Notifications')).toBeVisible();
    await page.getByTestId('toggle-notifications-disclosure').click();
    await expect(page.getByText('Simulated SMS Message')).toBeVisible();
    await expect(page.getByText('Simulated Email Confirmation')).toBeVisible();

    // ==========================================
    // 3. STANDALONE TRACKING MODAL (TRCK-01)
    // ==========================================
    await page.getByTestId('header-track-btn').click();
    await expect(page.getByText('Track Your Application Status')).toBeVisible();

    await page.getByTestId('tracking-reference-input').fill('VR-2026-102938');
    await page.getByTestId('track-submit-btn').click();
    await expect(page.getByText('Vikram Seth')).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Close', exact: true }).click();

    // ==========================================
    // 4. CROSS-DEVICE DRAFT BACKUP & RECOVERY (STATE-05)
    // ==========================================
    await page.getByTestId('header-backup-btn').click();
    await expect(page.getByText('Cross-Device Draft Backup & Recovery')).toBeVisible();

    // Switch to restore tab
    await page.getByTestId('mode-tab-restore').click();
    await page.getByTestId('restore-code-input').fill('VR-DEMO01');
    await page.getByTestId('restore-submit-btn').click();

    // Resolve conflict modal
    await expect(page.getByTestId('conflict-comparison-view')).toBeVisible();
    await page.getByTestId('confirm-replace-draft-btn').click();
    await expect(page.getByText('Draft Restored!')).toBeVisible();

    // ==========================================
    // 5. DUPLICATE PASSPORT DETECTION (STATE-06)
    // ==========================================
    // Reset to start new application
    await page.getByTestId('start-new-application-btn').click();
    await page.getByLabel('Where are you traveling to?').selectOption('USA');
    await page.getByRole('radio', { name: /Tourism & Leisure/i }).check();
    await page.getByRole('button', { name: /Continue to Personal Details/i }).click();

    // In Identity step, enter seeded active passport ZZ1234567
    const passportInput = page.getByLabel(/Passport Number/i);
    await passportInput.fill('ZZ1234567');

    // Duplicate warning appears
    await expect(page.getByTestId('duplicate-passport-warning-card')).toBeVisible();
    await expect(page.getByText(/Active Application Found for this Passport/)).toBeVisible();

    // Click "Track Existing Application" to test pre-filled lookup
    await page.getByTestId('track-existing-app-btn').click();
    await expect(page.getByText('Track Your Application Status')).toBeVisible();
    await expect(
      page.getByLabel('Track Your Application Status').getByText('Vikram Seth'),
    ).toBeVisible();
  });
});
