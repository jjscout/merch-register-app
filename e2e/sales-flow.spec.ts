import { test, expect } from '@playwright/test';

test.describe('Sales Flow', () => {
  test('displays the app header', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Merch Register');
  });

  test('shows setup instructions when Supabase is not configured', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByText('Setup Required')).toBeVisible();
    await expect(page.getByText('Supabase is not configured')).toBeVisible();
  });

  // These tests require a configured Supabase instance with seeded data.
  // Uncomment once .env is set up and seed has been run.
  //
  // test('shows seller dropdown and categories on load', async ({ page }) => {
  //   await page.goto('/');
  //   await expect(page.locator('select#seller-select')).toBeVisible();
  //   await expect(page.getByText('Home')).toBeVisible();
  // });
  //
  // test('navigates product tree, records sale, sees confirmation', async ({ page }) => {
  //   await page.goto('/');
  //   // Click a root category
  //   await page.getByRole('button', { name: 'T-Shirts' }).click();
  //   // Click a subcategory
  //   await page.getByRole('button', { name: 'Men' }).click();
  //   // Select a product
  //   await page.getByRole('button', { name: /Large Tee/ }).click();
  //   // Submit the sale form
  //   await page.getByRole('button', { name: 'Record Sale' }).click();
  //   // Verify confirmation
  //   await expect(page.getByText('Sale Recorded!')).toBeVisible();
  //   // Return to browsing
  //   await page.getByRole('button', { name: 'New Sale' }).click();
  //   await expect(page.getByText('Home')).toBeVisible();
  // });
});
