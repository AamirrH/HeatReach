import { useWeather } from "../hooks/useWeather";
import type { Scenario } from "../types/domain";
export function WeatherContext({
  location,
}: {
  location: NonNullable<Scenario["weatherLocation"]>;
}) {
  const { state, loading, load } = useWeather(location);
  const time = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  return (
    <section
      className="panel extension weather"
      aria-labelledby="weather-title"
    >
      <div className="extension-heading">
        <div>
          <span className="eyebrow">REGIONAL CONTEXT ONLY</span>
          <h2 id="weather-title">{location.label}</h2>
        </div>
        <button className="secondary-button" onClick={load} disabled={loading}>
          {loading
            ? "Loading forecast…"
            : state
              ? "Refresh weather"
              : "Load regional weather"}
        </button>
      </div>
      <p>
        Modelled forecast context does not change zone weights or the
        recommended plan. It cannot resolve street-level exposure.
      </p>
      <div role="status">
        {state?.status === "unavailable" ? (
          <p className="warning">{state.reason} Planning remains available.</p>
        ) : state ? (
          <>
            <p>
              <strong>
                {state.status === "live"
                  ? "Fetched forecast"
                  : "Cached forecast"}{" "}
                · {state.temperatureC} °C
              </strong>{" "}
              · Feels like {state.apparentTemperatureC} °C · Humidity{" "}
              {state.relativeHumidity}%
            </p>
            <small>
              Forecast time: {time(state.observedAt)} IST. Fetched:{" "}
              {time(state.fetchedAt)} IST.
              {state.status === "cached" && ` ${state.reason}`}
            </small>
          </>
        ) : (
          <p>
            Weather is not loaded. Loading contacts Open-Meteo for this region
            only; no device location is requested.
          </p>
        )}
      </div>
      <small>
        Weather data:{" "}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>
        ,{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
        >
          CC BY 4.0
        </a>
        . Free endpoint for non-commercial use;{" "}
        <a
          href="https://open-meteo.com/en/terms"
          target="_blank"
          rel="noreferrer"
        >
          terms
        </a>
        .
      </small>
    </section>
  );
}
