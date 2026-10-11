import { expect, test } from "@playwright/test";
import { testCatalog, testPilot } from "../src/tests/fixtures/pilot";
test("weather success, cache expiry/failure, sensitivity, CSV and printable constraints", async ({
  page,
}) => {
  const now = Date.now();
  await page.clock.install({ time: now });
  await page.route("https://api.open-meteo.com/**", (route) =>
    route.fulfill({
      json: {
        current: {
          time: Math.floor(now / 1000),
          temperature_2m: 32,
          apparent_temperature: 35,
          relative_humidity_2m: 50,
        },
      },
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Load regional weather" }).click();
  await expect(page.getByText("Fetched forecast · 32 °C")).toBeVisible();
  await page.getByRole("button", { name: "Refresh weather" }).click();
  await expect(page.getByText("Cached forecast · 32 °C")).toBeVisible();
  await page.clock.fastForward(31 * 60000);
  await page.route("https://api.open-meteo.com/**", (route) => route.abort());
  await page.getByRole("button", { name: "Refresh weather" }).click();
  await expect(
    page.getByText(
      /Weather unavailable: network or response validation failed/,
    ),
  ).toBeVisible();
  await expect(page.getByTestId("selected-sites")).toHaveText("A + C");
  await page
    .getByText("Fairness & sensitivity · inspect the trade-offs")
    .click();
  await expect(
    page.getByText("180 m (current)", { exact: true }),
  ).toBeVisible();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download plan CSV" }).click();
  const download = await downloadEvent;
  const stream = await download.createReadStream();
  let csv = "";
  for await (const chunk of stream!) csv += chunk.toString();
  expect(csv).toContain("ILLUSTRATIVE");
  expect(csv).toContain('"A","Candidate A"');
  expect(csv).toContain("2150");
  expect(csv).toContain("not verified travel times");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".print-summary")).toBeVisible();
  await expect(page.locator(".print-summary")).toContainText(
    "Straight-line radius 180 m",
  );
  await expect(
    page.getByRole("button", { name: "Download plan CSV" }),
  ).toBeHidden();
});
test("public view withholds absent inventory and preserves planner state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByLabel("Planning budget", { exact: false }).fill("1");
  await page
    .getByRole("button", { name: "Public facilities", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "No currently verified public facilities",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View facility location ↗" }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "docs/screenshots/public-empty-375.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "Method & sources" }).click();
  await expect(page.locator("#method")).toBeVisible();
  await expect(page.getByTestId("selected-sites")).toHaveText("C");
});
test("verified catalog expiry and map-tile failure retain honest public state", async ({
  page,
}) => {
  const now = Date.now(),
    c = testCatalog(now);
  await page.clock.install({ time: now });
  await page.route("**/data/verified-facilities.json", (route) =>
    route.fulfill({ json: c }),
  );
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.abort(),
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "Public facilities", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Test-only facility" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Load OpenStreetMap" }).click();
  await expect(
    page.getByText(
      "Map tiles unavailable. The facility/zone tables remain usable.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View facility location ↗" }),
  ).toBeVisible();
  await page.clock.fastForward(61 * 60000);
  await expect(
    page.getByRole("heading", {
      name: "No currently verified public facilities",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View facility location ↗" }),
  ).toHaveCount(0);
});
test("documented pilot import is gated, computes a real plan, and never publishes candidates", async ({
  page,
}) => {
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.abort(),
  );
  await page.goto("/");
  await page.getByText("Geographic pilot · load documented local data").click();
  await page.getByLabel("Pilot JSON (maximum 1 MB)").setInputFiles({
    name: "test-only.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(testPilot())),
  });
  await expect(
    page.getByRole("button", { name: "Use documented pilot" }),
  ).toBeDisabled();
  await page
    .getByRole("checkbox", { name: /I have checked the source evidence/ })
    .check();
  await page.getByRole("button", { name: "Use documented pilot" }).click();
  await expect(
    page.getByText("OPERATOR-SUPPLIED PILOT", { exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("selected-sites")).toHaveText("TA");
  await page.getByRole("button", { name: "Load OpenStreetMap" }).click();
  await expect(
    page.getByText(
      "Map tiles unavailable. The facility/zone tables remain usable.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("table", { name: "Imported pilot geography and coverage" }),
  ).toContainText("Test proposal");
  await page
    .getByRole("button", { name: "Public facilities", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "No currently verified public facilities",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Community planner" }).click();
  await page
    .getByRole("button", { name: "Return to illustrative scenario" })
    .click();
  await expect(page.getByTestId("selected-sites")).toHaveText("A + C");
});
