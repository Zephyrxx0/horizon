import { test, expect } from '@playwright/test';

test.describe('Save and Restore Persistence Engine', () => {
  test('Kill-the-tab durability: unsaved keystrokes survive tab murder via pagehide flush', async ({
    context,
  }) => {
    const page = await context.newPage();
    await page.goto('/');

    // Select trip in Stage 1
    await page.getByRole('radio', { name: /Tourism & Leisure/i }).check();
    await page.getByRole('button', { name: /continue to personal details/i }).click();

    // In Stage 2a, type passport sentinel
    const passportInput = page.getByRole('textbox', { name: /passport number/i });
    await passportInput.fill('AB1234567');

    // Murder the tab immediately without waiting for the 10s debounce timer
    await page.close({ runBeforeUnload: false });

    // Open a fresh tab in the same browser context (shares localStorage)
    const freshPage = await context.newPage();
    await freshPage.goto('/');

    // The snapshot restored directly to Stage 2a (or shows resume banner)
    const restoredInput = freshPage.getByRole('textbox', { name: /passport number/i });
    await expect(restoredInput).toBeVisible();
    await expect(restoredInput).toHaveValue('AB1234567');

    // Confirm save state is stable (Saved)
    const saveStatus = freshPage.getByRole('status').getByText(/saved/i);
    await expect(saveStatus).toBeVisible();
  });

  test('Derived persistence: editing trip answer dynamically preserves personal answers', async ({
    page,
  }) => {
    await page.goto('/');

    // Stage 1: select tourism
    await page.getByRole('radio', { name: /Tourism & Leisure/i }).check();
    await page.getByRole('button', { name: /continue to personal details/i }).click();

    // Stage 2a: enter valid passport and first name
    await page.getByLabel(/first \/ given name/i).fill('Rahul');
    await page.getByRole('textbox', { name: /passport number/i }).fill('AB1234567');

    // Go back to Stage 1
    await page.getByRole('button', { name: 'Back', exact: true }).click();

    // Change purpose in Stage 1 to business
    await page.getByRole('radio', { name: /Business & Conferences/i }).check();
    await page.getByRole('button', { name: /continue to personal details/i }).click();

    // Verify passport and first name are still preserved
    const firstNameInput = page.getByLabel(/first \/ given name/i);
    await expect(firstNameInput).toHaveValue('Rahul');
    const passportInput = page.getByRole('textbox', { name: /passport number/i });
    await expect(passportInput).toHaveValue('AB1234567');
  });
});
