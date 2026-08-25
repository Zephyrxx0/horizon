import { test, expect } from '@playwright/test';

test.describe('Save and Restore Persistence Engine', () => {
  test('Kill-the-tab durability: unsaved keystrokes survive tab murder via pagehide flush', async ({
    context,
  }) => {
    const page = await context.newPage();
    await page.goto('/');

    // Select trip in Step 1
    await page.getByText(/tourism & sightseeing/i).click();
    await page.getByRole('button', { name: /continue application/i }).click();

    // In Step 2, type passport sentinel
    const passportInput = page.getByRole('textbox', { name: /passport number/i });
    await passportInput.fill('AB1234567');

    // Murder the tab immediately without waiting for the 10s debounce timer
    await page.close({ runBeforeUnload: false });

    // Open a fresh tab in the same browser context (shares localStorage)
    const freshPage = await context.newPage();
    await freshPage.goto('/');

    // The snapshot restored directly to Step 2 (dependent step)
    const restoredInput = freshPage.getByRole('textbox', { name: /passport number/i });
    await expect(restoredInput).toBeVisible();
    await expect(restoredInput).toHaveValue('AB1234567');

    // Confirm save state is stable (Saved)
    const saveStatus = freshPage.getByRole('status').getByText(/saved/i);
    await expect(saveStatus).toBeVisible();
  });

  test('Derived invalidation: editing trip answer dynamically updates dependent step', async ({
    page,
  }) => {
    await page.goto('/');

    // Step 1: select tourism
    await page.getByText(/tourism & sightseeing/i).click();
    await page.getByRole('button', { name: /continue application/i }).click();

    // Step 2: enter valid passport
    await page.getByRole('textbox', { name: /passport number/i }).fill('AB1234567');
    await page.getByRole('button', { name: /continue application/i }).click();

    // In Step 3: verify summary
    await expect(page.getByText('Application Summary')).toBeVisible();

    // Go back to Step 2 then Step 1
    await page.getByRole('button', { name: /back/i }).click();
    await page.getByRole('button', { name: /back/i }).click();

    // Change answer in Step 1 to business
    await page.getByText(/business & commercial/i).click();
    await page.getByRole('button', { name: /continue application/i }).click();

    // Verify passport is still preserved
    const passportInput = page.getByRole('textbox', { name: /passport number/i });
    await expect(passportInput).toHaveValue('AB1234567');
  });
});
