import { expect, test } from "@playwright/test";
for (const viewport of [
  { width: 1280, height: 900 },
  { width: 375, height: 812 },
]) {
  test(`complete planning workflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page.getByTestId("selected-sites")).toHaveText("A + C");
    await expect(
      page.getByText("2,150", { exact: true }).first(),
    ).toBeVisible();
    await page.screenshot({
      path: `docs/screenshots/planner-${viewport.width}.png`,
      fullPage: true,
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.getByLabel("Planning budget", { exact: false }).fill("1");
    await page.getByRole("button", { name: "Optimize Coverage" }).click();
    await expect(page.getByTestId("selected-sites")).toHaveText("C");
    await expect(
      page.getByText("1,480", { exact: true }).first(),
    ).toBeVisible();
    await page.getByLabel("Include Candidate C").uncheck();
    await expect(page.getByTestId("selected-sites")).not.toHaveText("C");
    await page.getByRole("button", { name: "Reset example" }).click();
    await expect(page.getByTestId("selected-sites")).toHaveText("A + C");
    await page.getByLabel("Maximum new sites", { exact: false }).fill("0");
    await expect(page.getByTestId("selected-sites")).toHaveText("No new sites");
    await page.getByRole("button", { name: "Reset example" }).click();
    await page.getByText("Explore zone & site data").click();
    await expect(page.locator('[data-zone-id="Z3"]')).toContainText(
      "New access",
    );
    await expect(
      page.getByText("ILLUSTRATIVE SCENARIO", { exact: true }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
}
test("keyboard navigation, invalid inputs and external network independence", async ({
  page,
}) => {
  await page.route("**/*", (route) =>
    route.request().url().startsWith("http://127.0.0.1:4173")
      ? route.continue()
      : route.abort(),
  );
  await page.goto("/");
  await expect(page.getByTestId("selected-sites")).toHaveText("A + C");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.getByLabel("Planning budget", { exact: false }).fill("-1");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByTestId("selected-sites")).toHaveCount(0);
  await page.getByRole("button", { name: "Reset example" }).click();
  await expect(page.getByTestId("selected-sites")).toHaveText("A + C");
});
