// import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });


import { test, expect } from "@playwright/test";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test("Go to login page", async ({ page }) => {
  await page.goto("http://frontend:3000/");

  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: "Login" }).click();

  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Login Page")).toBeVisible();
});