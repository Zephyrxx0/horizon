import { test, expect } from '@playwright/test';

test.describe('Phase 2: Guided Journey (Visa Selection & Personal Details)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage to start clean
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('Happy Path: complete Stage 1 and all Stage 2 sub-steps end-to-end', async ({ page }) => {
    // --- STAGE 1: Visa Selection ---
    await expect(page.getByText('Select Your Visa & Destination')).toBeVisible();

    // Select Destination Country USA
    const destSelect = page.getByLabel('Where are you traveling to?');
    await destSelect.selectOption('USA');

    // Select Tourism
    await page.getByRole('radio', { name: /Tourism & Leisure/i }).check();

    // Verify Recommended Badge & Fee Breakdown
    await expect(page.getByText('B1/B2 Visitor Visa')).toBeVisible();
    await expect(page.getByText('Recommended for your trip')).toBeVisible();
    await expect(page.getByText('₹14,000')).toBeVisible();
    await expect(page.getByText('Required Document Checklist').first()).toBeVisible();

    // Click Continue
    await page.getByRole('button', { name: /Continue to Personal Details/i }).click();

    // --- STAGE 2a: Identity & Passport ---
    await expect(page.getByText('Stage 2a of 5 • Identity & Passport')).toBeVisible();

    await page.getByLabel(/First \/ Given Name/i).fill('Rahul');
    await page.getByLabel(/Last Name \/ Surname/i).fill('Sharma');
    await page.getByLabel(/Date of Birth/i).fill('1992-06-15');
    await page.getByLabel(/Gender/i).selectOption('male');

    // Passport number with auto-formatting
    const passportInput = page.getByLabel(/Passport Number/i);
    await passportInput.fill('aa1234567');
    await expect(passportInput).toHaveValue('AA1234567');

    await page.getByLabel(/Date of Issue/i).fill('2020-01-10');

    // Future expiry > 6 months
    await page.getByLabel(/Date of Expiry/i).fill('2030-01-10');

    await page.getByRole('button', { name: /Continue to Contact & Address/i }).click();

    // --- STAGE 2b: Contact & Address ---
    await expect(page.getByText('Stage 2b of 5 • Contact & Address')).toBeVisible();

    await page.getByLabel(/Email Address/i).fill('rahul.sharma@example.com');

    // Phone with auto-prefix
    const phoneInput = page.getByLabel(/Mobile Phone Number/i);
    await phoneInput.fill('9876543210');
    await expect(phoneInput).toHaveValue('+91 98765 43210');

    await page
      .getByLabel(/Residential Address \(Line 1\)/i)
      .fill('Flat 402, Sunshine Heights, MG Road');
    await page.getByLabel(/City \/ Town/i).fill('Bengaluru');
    await page.getByLabel(/State \/ UT/i).fill('Karnataka');
    await page.getByLabel(/6-Digit PIN Code/i).fill('560001');

    await page.getByRole('button', { name: /Continue to Trip Details/i }).click();

    // --- STAGE 2c: Trip Details (Progressive Disclosure for Tourist) ---
    await expect(page.getByText(/Stage 2c of 5 • B1\/B2 Visitor Visa Specifics/i)).toBeVisible();

    await page.getByLabel(/Planned Arrival Date/i).fill('2026-11-20');
    await page
      .getByLabel(/Hotel Name or Stay Address/i)
      .fill('Hilton Midtown, 1335 6th Ave, New York, NY');

    await page.getByRole('button', { name: /Continue to Document Upload/i }).click();

    // --- STAGE 3: Reached Documents Placeholder ---
    await expect(page.getByText('Stage 3: Document Upload Pipeline')).toBeVisible();
  });

  test('Validation & Error Summary: displays top accessible summary with jump links on invalid fields', async ({
    page,
  }) => {
    // Advance to Stage 2a
    await page.getByRole('button', { name: /Continue to Personal Details/i }).click();
    await expect(page.getByText('Stage 2a of 5 • Identity & Passport')).toBeVisible();

    // Click Continue without filling required fields
    await page.getByRole('button', { name: /Continue to Contact & Address/i }).click();

    // Verify ErrorSummary appeared
    const errorAlert = page.getByRole('alert');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert.getByText('There is a problem')).toBeVisible();

    // Click an error link and check that it focuses the problem input
    const firstNameErrorLink = page.getByRole('link', { name: /First Name:/i });
    await expect(firstNameErrorLink).toBeVisible();
    await firstNameErrorLink.click();

    await expect(page.getByLabel(/First \/ Given Name/i)).toBeFocused();
  });

  test('Passport Expiry Warning: warns when validity <6 months and requires explicit confirmation (PERS-05)', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /Continue to Personal Details/i }).click();

    await page.getByLabel(/First \/ Given Name/i).fill('Ananya');
    await page.getByLabel(/Last Name \/ Surname/i).fill('Verma');
    await page.getByLabel(/Date of Birth/i).fill('1998-03-22');
    await page.getByLabel(/Gender/i).selectOption('female');
    await page.getByLabel(/Passport Number/i).fill('AB9876543');
    await page.getByLabel(/Date of Issue/i).fill('2018-05-10');

    // Expiry date 2 months from today
    const twoMonthsLater = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    await page.getByLabel(/Date of Expiry/i).fill(twoMonthsLater);

    // Verify amber warning card appears
    await expect(page.getByText('Passport Validity Alert')).toBeVisible();
    await expect(page.getByText(/6 months of remaining validity/i)).toBeVisible();

    // Try to continue without checking confirmation
    await page.getByRole('button', { name: /Continue to Contact & Address/i }).click();

    // Should stay on Stage 2a with error summary
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText('Validity Confirmation:')).toBeVisible();

    // Check confirmation checkbox
    const confirmCheckbox = page.getByRole('checkbox', {
      name: /I understand the 6-month validity requirement/i,
    });
    await confirmCheckbox.check();

    // Continue should now succeed to Stage 2b
    await page.getByRole('button', { name: /Continue to Contact & Address/i }).click();
    await expect(page.getByText('Stage 2b of 5 • Contact & Address')).toBeVisible();
  });

  test('Draft Persistence & Resumption: reloads on first incomplete step with resume banner (STATE-04)', async ({
    page,
  }) => {
    // Fill Stage 1
    await page.getByLabel('Where are you traveling to?').selectOption('UK');
    await page.getByRole('radio', { name: /Education & Studies/i }).check();
    await page.getByRole('button', { name: /Continue to Personal Details/i }).click();

    // Fill Stage 2a
    await page.getByLabel(/First \/ Given Name/i).fill('Vikram');
    await page.getByLabel(/Last Name \/ Surname/i).fill('Singh');
    await page.getByLabel(/Date of Birth/i).fill('2001-11-05');
    await page.getByLabel(/Gender/i).selectOption('male');
    await page.getByLabel(/Passport Number/i).fill('KL5544332');
    await page.getByLabel(/Date of Issue/i).fill('2022-01-01');
    await page.getByLabel(/Date of Expiry/i).fill('2032-01-01');

    await page.getByRole('button', { name: /Continue to Contact & Address/i }).click();
    await expect(page.getByText('Stage 2b of 5 • Contact & Address')).toBeVisible();

    // Reload page (pagehide triggers instant flush)
    await page.reload();

    // Direct restoration: app restored directly to Stage 2b with answers intact
    await expect(page.getByText('Stage 2b of 5 • Contact & Address')).toBeVisible();

    // Go back to Stage 1 to test ResumeBanner discovery
    await page.getByRole('button', { name: /Back/i }).click(); // back to Stage 2a
    await page.getByRole('button', { name: /Back/i }).click(); // back to Stage 1

    // Now on Stage 1, ResumeBanner should be visible with target step (Contact & Address)
    const resumeBtn = page.getByRole('button', { name: /Continue Application/i });
    await expect(resumeBtn).toBeVisible();
    await resumeBtn.click();

    // Jumps directly back to Stage 2b
    await expect(page.getByText('Stage 2b of 5 • Contact & Address')).toBeVisible();
  });
});
