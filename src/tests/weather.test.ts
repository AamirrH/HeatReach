import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { clearWeatherCache, getWeatherContext } from "../services/weather";
const now = Date.parse("2026-10-11T10:00:00Z");
const location = {
  label: "Test region",
  latitude: 21.1458,
  longitude: 79.0882,
};
const payload = () => ({
  current: {
    time: now / 1000,
    temperature_2m: 32,
    apparent_temperature: 35,
    relative_humidity_2m: 50,
  },
});
beforeEach(clearWeatherCache);
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
it("parses forecast and reuses a labeled 30-minute cache without refetch", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => payload() });
  vi.stubGlobal("fetch", fetcher);
  const r = await getWeatherContext(location, { now });
  expect(r.status).toBe("live");
  if (r.status !== "unavailable") {
    expect(r.temperatureC).toBe(32);
    expect(r.observedAt).toBe("2026-10-11T10:00:00.000Z");
  }
  expect((await getWeatherContext(location, { now: now + 1000 })).status).toBe(
    "cached",
  );
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it("uses explicitly cached readings after failed expired-cache refresh", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => payload() })
    .mockRejectedValue(new Error("offline"));
  vi.stubGlobal("fetch", fetcher);
  await getWeatherContext(location, { now });
  const r = await getWeatherContext(location, { now: now + 31 * 60000 });
  expect(r.status).toBe("cached");
  expect("reason" in r && r.reason).toMatch(/unavailable/);
  expect(
    (await getWeatherContext(location, { now: now + 25 * 3600000 })).status,
  ).toBe("unavailable");
});
it.each([
  null,
  { current: { ...payload().current, temperature_2m: NaN } },
  { current: { ...payload().current, relative_humidity_2m: 101 } },
  { current: { ...payload().current, time: 1 } },
])("rejects invalid or stale forecast %#", async (data) => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => data }),
  );
  expect((await getWeatherContext(location, { now })).status).toBe(
    "unavailable",
  );
});
it("times out after six seconds", async () => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "fetch",
    vi.fn(
      (_: unknown, opts: RequestInit) =>
        new Promise((_, reject) =>
          opts.signal?.addEventListener("abort", () =>
            reject(new Error("aborted")),
          ),
        ),
    ),
  );
  const pending = getWeatherContext(location, { now });
  await vi.advanceTimersByTimeAsync(6001);
  expect(await pending).toEqual({
    status: "unavailable",
    reason: "Weather request cancelled or timed out.",
  });
});
