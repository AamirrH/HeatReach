import type { Scenario } from "../types/domain";
import { optimize } from "./optimize";
export function sensitivity(s: Scenario) {
  const radii = [
    ...new Set([
      Math.max(50, s.radiusMeters - 60),
      s.radiusMeters,
      Math.min(1000, s.radiusMeters + 60),
    ]),
  ].sort((a, b) => a - b);
  const equalWeights = {
    ...s,
    zones: s.zones.map((z) => ({ ...z, vulnerabilityWeight: 1 })),
  };
  return {
    radii: radii.map((radiusMeters) => ({
      radiusMeters,
      result: optimize(s, { radiusMeters }),
    })),
    equalWeightResult: optimize(equalWeights),
  };
}
