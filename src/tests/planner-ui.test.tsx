import { afterEach, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import fixture from "../../public/fixtures/illustrative_district.json";
afterEach(() => vi.unstubAllGlobals());
function mockFixture(data: unknown = fixture) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => data }),
  );
}
it("edits budget and availability, resets, and keeps provenance visible", async () => {
  mockFixture();
  const user = userEvent.setup();
  render(<App />);
  expect(await screen.findByTestId("selected-sites")).toHaveTextContent(
    "A + C",
  );
  expect(screen.getByText("ILLUSTRATIVE SCENARIO")).toBeVisible();
  expect(screen.getByText("Proposed—not operational")).toBeVisible();
  const budget = screen.getByLabelText(/Planning budget/);
  await user.clear(budget);
  expect(screen.queryByTestId("selected-sites")).not.toBeInTheDocument();
  await user.type(budget, "1");
  expect(screen.getByTestId("selected-sites")).toHaveTextContent(/^C$/);
  await user.click(screen.getByRole("button", { name: /Optimize Coverage/ }));
  expect(screen.getByText(/Plan recalculated/)).toHaveTextContent("1480");
  await user.click(screen.getByLabelText("Include Candidate C"));
  expect(screen.getByTestId("selected-sites")).not.toHaveTextContent("C");
  await user.click(screen.getByRole("button", { name: "Reset example" }));
  expect(screen.getByTestId("selected-sites")).toHaveTextContent("A + C");
  expect(screen.getByText("ILLUSTRATIVE SCENARIO")).toBeVisible();
});
it("changes radius and cap and handles no additional feasible access", async () => {
  mockFixture();
  const user = userEvent.setup();
  render(<App />);
  await screen.findByTestId("selected-sites");
  const cap = screen.getByLabelText(/Maximum new sites/);
  await user.clear(cap);
  await user.type(cap, "0");
  expect(screen.getByTestId("selected-sites")).toHaveTextContent(
    "No new sites",
  );
  expect(
    screen.getByText(/No additional weighted access is feasible/),
  ).toBeVisible();
  const radius = screen.getByLabelText(/Coverage radius meters/);
  await user.clear(radius);
  await user.type(radius, "1000");
  expect(screen.getByText("All zones within radius")).toBeVisible();
});
it("keeps map, zone table and recommendations consistent", async () => {
  mockFixture();
  const user = userEvent.setup();
  render(<App />);
  await screen.findByTestId("selected-sites");
  const map = screen.getByRole("img", {
    name: "Illustrative district coverage map",
  });
  expect(map).toHaveAccessibleDescription(/Selected sites: A, C/);
  await user.click(screen.getByText("Explore zone & site data"));
  const row = document.querySelector('[data-zone-id="Z3"]') as HTMLElement;
  expect(within(row).getByText("New access")).toBeVisible();
  expect(within(row).getByText("C")).toBeVisible();
});
it("fails gracefully for invalid fixture data", async () => {
  mockFixture({ ...fixture, radiusMeters: -1 });
  render(<App />);
  expect(await screen.findByRole("alert")).toHaveTextContent("radiusMeters");
  expect(screen.queryByTestId("selected-sites")).not.toBeInTheDocument();
});
it("fails gracefully for network failure without fabricating data", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Offline")));
  render(<App />);
  expect(await screen.findByRole("alert")).toHaveTextContent("Offline");
});
it("has no weather API dependency or unsupported safety claims", async () => {
  const fetcher = vi.fn(async (url: string) => {
    if (url.includes("fixtures/"))
      return { ok: true, json: async () => fixture };
    throw new Error("Weather unavailable");
  });
  vi.stubGlobal("fetch", fetcher);
  render(<App />);
  await waitFor(() =>
    expect(screen.getByTestId("selected-sites")).toHaveTextContent("A + C"),
  );
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(document.body.textContent).not.toMatch(
    /lives saved|heatstroke detect|open now/i,
  );
  expect(
    screen.getByText(/not verified travel times or medical safety guidance/),
  ).toBeVisible();
});
