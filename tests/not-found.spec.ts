import { test, expect } from "@playwright/test";

test("ES 404 page renders heading and is noindex", async ({ page }) => {
  await page.goto("/404");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(/no existe/i);

  const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  expect(robots).toContain("noindex");
});

test("EN 404 page renders heading, is lang=en and noindex", async ({ page }) => {
  await page.goto("/en/404");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/doesn't exist/i);

  const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  expect(robots).toContain("noindex");
});
