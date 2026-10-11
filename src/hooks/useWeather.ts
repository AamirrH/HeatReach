import { useEffect, useRef, useState } from "react";
import type { Scenario } from "../types/domain";
import type { WeatherContext } from "../types/weather";
import { getWeatherContext } from "../services/weather";
export function useWeather(location: NonNullable<Scenario["weatherLocation"]>) {
  const [state, setState] = useState<WeatherContext | null>(null);
  const [loading, setLoading] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    const timer = setInterval(
      () =>
        setState((current) =>
          current?.status === "live" &&
          Date.now() - Date.parse(current.fetchedAt) >= 30 * 60 * 1000
            ? {
                ...current,
                status: "cached",
                reason:
                  "Older than 30 minutes; refresh to request current context.",
              }
            : current,
        ),
      30000,
    );
    return () => clearInterval(timer);
  }, []);
  async function load() {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    const result = await getWeatherContext(location, {
      signal: controller.signal,
    });
    if (!controller.signal.aborted) {
      setState(result);
      setLoading(false);
    } else if (request.current === controller) setLoading(false);
  }
  return { state, loading, load };
}
