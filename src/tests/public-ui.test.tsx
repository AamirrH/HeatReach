import { afterEach, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PublicFacilities } from "../components/PublicFacilities";
import { PilotImport } from "../components/PilotImport";
import { WeatherContext } from "../components/WeatherContext";
import { testCatalog } from "./fixtures/pilot";
import { clearWeatherCache } from "../services/weather";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  clearWeatherCache();
});
it("shows an honest empty public view and manual emergency link", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ...testCatalog(), facilities: [] }),
    }),
  );
  render(<PublicFacilities />);
  expect(
    await screen.findByRole("heading", {
      name: "No currently verified public facilities",
    }),
  ).toBeVisible();
  expect(
    screen.queryByText("View facility location ↗"),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "call 112" })).toHaveAttribute(
    "href",
    "tel:112",
  );
});
it("shows current published evidence and filters facility search", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => testCatalog() }),
  );
  const user = userEvent.setup();
  render(<PublicFacilities />);
  expect(
    await screen.findByRole("heading", { name: "Test-only facility" }),
  ).toBeVisible();
  expect(screen.getByText("Not documented")).toBeVisible();
  await user.type(screen.getByRole("searchbox"), "missing");
  expect(
    screen.queryByRole("heading", { name: "Test-only facility" }),
  ).not.toBeInTheDocument();
});
it("fails closed for invalid public records rather than showing candidates", async () => {
  const c = testCatalog();
  Object.assign(c.facilities[0], { kind: "candidate" });
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => c }),
  );
  render(<PublicFacilities />);
  expect(await screen.findByRole("alert")).toBeVisible();
  expect(
    screen.queryByText("View facility location ↗"),
  ).not.toBeInTheDocument();
});
it("rejects malformed imports without invoking the pilot callback", async () => {
  const user = userEvent.setup(),
    onImport = vi.fn();
  render(
    <PilotImport imported={false} onImport={onImport} onReset={() => {}} />,
  );
  await user.click(
    screen.getByText("Geographic pilot · load documented local data"),
  );
  const file = new File(["{}"], "bad.json", { type: "application/json" });
  Object.defineProperty(file, "text", { value: async () => "{}" });
  await user.upload(screen.getByLabelText("Pilot JSON (maximum 1 MB)"), file);
  expect(await screen.findByRole("alert")).toBeVisible();
  expect(onImport).not.toHaveBeenCalled();
});
it("loads weather only on request and explains failure", async () => {
  const fetcher = vi.fn().mockRejectedValue(new Error("offline"));
  vi.stubGlobal("fetch", fetcher);
  const user = userEvent.setup();
  render(
    <WeatherContext
      location={{ label: "Region", latitude: 21, longitude: 79 }}
    />,
  );
  expect(fetcher).not.toHaveBeenCalled();
  await user.click(
    screen.getByRole("button", { name: "Load regional weather" }),
  );
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent(
      "Planning remains available",
    ),
  );
});
