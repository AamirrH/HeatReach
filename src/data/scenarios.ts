import { parseScenario } from '../engine/validation';
export async function loadScenario(signal?: AbortSignal) {
  const response = await fetch(`${import.meta.env.BASE_URL}fixtures/illustrative_district.json`, { signal });
  if (!response.ok) throw new Error(`Scenario could not be loaded (HTTP ${response.status}). Try reloading.`);
  return parseScenario(await response.json());
}
