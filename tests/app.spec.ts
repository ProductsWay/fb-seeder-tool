import { test, expect } from "@playwright/test";

test("navigate to form and submit data", async ({ page }) => {
  // Go to http://localhost:3000/
  await page.goto(
    process.env?.PLAYWRIGHT_TEST_BASE_URL ?? "http://localhost:3000/"
  );

  // Click text=FB Seeder - Effortless Facebook Seeding
  expect(page.locator(".navbar")).toHaveText(
    "FB Seeder - Effortless Facebook Seeding"
  );

  // Click text=Get Started
  await page.locator("text=Get Started").click();

  // Click .btm-nav > button:nth-child(3)
  await page.locator(".btm-nav > button:nth-child(3)").click();

  // Click input[name="firstName"]
  await page.locator('input[name="firstName"]').click();

  // Fill input[name="firstName"]
  await page.locator('input[name="firstName"]').fill("Dung");
  expect(await page.locator('input[name="firstName"]')).toHaveValue("Dung");

  // Click input[name="lastName"]
  await page.locator('input[name="lastName"]').click();

  // Fill input[name="lastName"]
  await page.locator('input[name="lastName"]').fill("Huynh");
  expect(await page.locator('input[name="lastName"]')).toHaveValue("Huynh");

  // Click button:has-text("Submit")
  await page.locator('button:has-text("Submit")').click();
});
