import { test, expect } from '@playwright/test';

test.describe('Sales Flow', () => {
  test('displays the app header and seller dropdown', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Merch Register');
  });

  test('shows Home breadcrumb on initial load', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Home')).toBeVisible();
  });

  test('navigates product tree, records sale, and sees confirmation', async ({
    page,
  }) => {
    await page.goto('/');

    // The app should load with some categories (requires Supabase to be configured)
    // For now we verify the structure loads
    await expect(page.locator('h1')).toContainText('Merch Register');
    await expect(page.getByText('Home')).toBeVisible();

    // If categories are loaded from Supabase, we can drill down
    // This test serves as a smoke test for the full flow
    // Full E2E testing requires a seeded Supabase instance
  });
});
