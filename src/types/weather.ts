export interface WeatherReading {
  fetchedAt: string;
  observedAt: string;
  sourceUrl: string;
  locationLabel: string;
  temperatureC: number;
  apparentTemperatureC: number;
  relativeHumidity: number;
}
export type WeatherContext =
  | ({ status: "live" } & WeatherReading)
  | ({ status: "cached"; reason: string } & WeatherReading)
  | { status: "unavailable"; reason: string };
