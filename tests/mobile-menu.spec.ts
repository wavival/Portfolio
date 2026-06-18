import { test, expect } from "@playwright/test";

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, closes via Escape, and updates aria-expanded", async ({ page }) => {
    await page.goto("/");

    const btn = page.locator("#menu-btn");
    const menu = page.locator("#mobile-menu");

    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveClass(/opacity-0/);

    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toHaveClass(/opacity-100/);

    await page.keyboard.press("Escape");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveClass(/opacity-0/);
  });

  test("clicking a same-page anchor closes the menu", async ({ page }) => {
    await page.goto("/");

    await page.locator("#menu-btn").click();
    await expect(page.locator("#mobile-menu")).toHaveClass(/opacity-100/);

    await page.locator('#mobile-menu a[href="/#stack"]').first().click();

    await expect(page.locator("#menu-btn")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#mobile-menu")).toHaveClass(/opacity-0/);
  });
});
