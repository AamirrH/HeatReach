export type Provenance = "illustrative" | "modelled" | "verified";
export type SiteKind = "existing" | "candidate";
export type SiteStatus =
  | "illustrative_existing"
  | "illustrative_candidate"
  | "verified_open"
  | "eligible_candidate"
  | "unavailable";
export interface Point {
  x: number;
  y: number;
}
export interface DemandZone extends Point {
  id: string;
  name: string;
  estimatedPopulation: number;
  vulnerabilityWeight: number;
  vulnerabilityBasis: string;
  provenance: Provenance;
}
export interface CoolingSite extends Point {
  id: string;
  name: string;
  kind: SiteKind;
  status: SiteStatus;
  eligible: boolean;
  costUnits: number;
  provenance: Provenance;
  verificationNote: string;
}
export interface PlanningControls {
  radiusMeters: number;
  budgetUnits: number;
  maxNewSites: number;
}
export interface Scenario extends PlanningControls {
  id: string;
  name: string;
  mode: "illustrative" | "verified-pilot";
  description: string;
  coordinateSystem: "local-meters";
  dataAsOf: string;
  zones: DemandZone[];
  sites: CoolingSite[];
  weatherLocation?: { label: string; latitude: number; longitude: number };
  sourceManifest: {
    label: string;
    type: Provenance;
    sourceUrl: string | null;
    note: string;
  }[];
}
export interface CoverageMetrics {
  selectedSiteIds: string[];
  beforeCoveredZoneIds: string[];
  afterCoveredZoneIds: string[];
  newlyCoveredZoneIds: string[];
  stillUncoveredZoneIds: string[];
  beforeRawPeople: number;
  afterRawPeople: number;
  newRawPeople: number;
  beforeWeightedReach: number;
  afterWeightedReach: number;
  incrementalWeightedReach: number;
  totalCostUnits: number;
}
export interface PlanResult extends CoverageMetrics {
  baseline: CoverageMetrics;
  warnings: string[];
  explanations: {
    siteId: string;
    newZoneIds: string[];
    marginalWeightedReach: number;
  }[];
}
