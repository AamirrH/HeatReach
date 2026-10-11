import { z } from "zod";
import type { Scenario } from "../types/domain";
import type { WeatherContext, WeatherReading } from "../types/weather";
const TTL = 30 * 60 * 1000;
const responseSchema = z.object({
  current: z.object({
    time: z.number().finite(),
    temperature_2m: z.number().finite(),
    apparent_temperature: z.number().finite(),
    relative_humidity_2m: z.number().min(0).max(100),
  }),
});
const cache = new Map<string, WeatherReading>();
export function clearWeatherCache() {
  cache.clear();
}
export async function getWeatherContext(
  location: NonNullable<Scenario["weatherLocation"]>,
  options: { signal?: AbortSignal; force?: boolean; now?: number } = {},
): Promise<WeatherContext> {
  const now = options.now ?? Date.now();
  const key = `${location.latitude},${location.longitude}`;
  const previous = cache.get(key);
  if (
    !options.force &&
    previous &&
    now - Date.parse(previous.fetchedAt) < TTL &&
    now >= Date.parse(previous.fetchedAt)
  )
    return {
      ...previous,
      locationLabel: location.label,
      status: "cached",
      reason: "Fetched within the last 30 minutes.",
    };
  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.addEventListener("abort", abort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timer = setTimeout(abort, 6000);
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature",
    timeformat: "unixtime",
    timezone: "Asia/Kolkata",
    temperature_unit: "celsius",
  }).toString();
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok)
      throw new Error(`Weather service returned HTTP ${response.status}.`);
    const data = responseSchema.parse(await response.json());
    const observation = data.current.time * 1000;
    if (Math.abs(observation - now) > 3 * 60 * 60 * 1000)
      throw new Error(
        "Weather timestamp is outside the current three-hour context window.",
      );
    const reading: WeatherReading = {
      fetchedAt: new Date(now).toISOString(),
      observedAt: new Date(observation).toISOString(),
      sourceUrl: url.toString(),
      locationLabel: location.label,
      temperatureC: data.current.temperature_2m,
      apparentTemperatureC: data.current.apparent_temperature,
      relativeHumidity: data.current.relative_humidity_2m,
    };
    cache.set(key, reading);
    return { status: "live", ...reading };
  } catch {
    const reason = controller.signal.aborted
      ? "Weather request cancelled or timed out."
      : "Weather unavailable: network or response validation failed.";
    // At most 24 hours of explicitly stale context; never relabel a failed refresh live.
    return previous &&
      now >= Date.parse(previous.fetchedAt) &&
      now - Date.parse(previous.fetchedAt) < 24 * 60 * 60 * 1000
      ? { ...previous, locationLabel: location.label, status: "cached", reason }
      : { status: "unavailable", reason };
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  }
}
