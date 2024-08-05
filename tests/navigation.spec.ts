import { test, expect } from "@playwright/test";

test.describe("navigation", () => {
  test("home to routesOverview", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "routesOverview" }).click();
    await expect(page).toHaveURL("http://localhost:3000/routesOverview");
  });
});
