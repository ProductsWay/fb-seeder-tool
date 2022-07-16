import { expect, test } from "@playwright/test";

test("navigate to form and submit data", async ({ page }) => {
  // Go to http://localhost:5173/
  await page.goto(
    process.env?.PLAYWRIGHT_TEST_BASE_URL ?? "http://localhost:5173/"
  );

  // Click text=FB Seeder - Effortless Facebook Seeding
  expect(page.locator(".navbar")).toHaveText(
    "FB Seeder - Effortless Facebook Seeding"
  );

  // Click text=Get Started
  await page.locator("text=Get Started").click();

  // Click .btm-nav > button:nth-child(3)
  await page.locator(".btm-nav > button:nth-child(3)").click();

  // Fill input[name="accessToken"]
  await page.locator('textarea[name="accessToken"]').fill("fbToken");
  expect(await page.locator('textarea[name="accessToken"]')).toHaveValue(
    "fbToken"
  );

  // Click button:has-text("Submit")
  await page.locator('button:has-text("Save")').click();
});
