import { z } from "zod";
import { controlsSchema, parseScenario } from "./validation";
import type { Scenario } from "../types/domain";
const text = z.string().trim().min(1).max(2000);
const url = z
  .url()
  .refine((s) => s.startsWith("https://"), "Evidence must use an HTTPS URL");
const coordinates = {
  latitude: z.number().finite().min(-85).max(85),
  longitude: z.number().finite().min(-180).max(180),
};
const evidence = z.object({
  sourceUrl: url,
  license: text,
  asOf: z.iso.date(),
  note: text,
  resolution: text,
});
export const verificationSchema = z
  .object({
    checkedAt: z.iso.datetime({ offset: true }),
    validUntil: z.iso.datetime({ offset: true }),
    method: text,
    sourceUrl: url,
    verifiedBy: text,
  })
  .superRefine((v, ctx) => {
    const duration = Date.parse(v.validUntil) - Date.parse(v.checkedAt);
    if (duration <= 0 || duration > 30 * 86400000)
      ctx.addIssue({
        code: "custom",
        message: "Verification must expire within 30 days after the check",
      });
  });
const facilityFields = {
  address: text,
  openingHours: text,
  timezone: z.string().refine((s) => {
    try {
      new Intl.DateTimeFormat("en", { timeZone: s });
      return true;
    } catch {
      return false;
    }
  }, "Use an IANA timezone"),
  publicContact: text,
  accessibility: text,
  services: z.array(text).min(1).max(20),
  capacity: z.number().int().nonnegative().nullable(),
  verification: verificationSchema,
};
export const publicFacilitySchema = z.object({
  id: text,
  name: text,
  ...coordinates,
  kind: z.literal("existing"),
  provenance: z.literal("verified"),
  status: z.enum(["verified_open", "unavailable"]),
  publicAccess: z.boolean(),
  permissionConfirmed: z.boolean(),
  evidence,
  ...facilityFields,
});
export const catalogSchema = z
  .object({
    version: z.literal(1),
    updatedAt: z.iso.datetime({ offset: true }),
    publisher: text,
    facilities: z.array(publicFacilitySchema).max(200),
  })
  .superRefine((c, ctx) => {
    if (new Set(c.facilities.map((f) => f.id)).size !== c.facilities.length)
      ctx.addIssue({ code: "custom", message: "Facility IDs must be unique" });
  });
const siteBase = {
  id: text,
  name: text,
  ...coordinates,
  evidence,
  costUnits: z.number().finite().nonnegative(),
  eligible: z.boolean(),
  permissionConfirmed: z.boolean(),
};
export const pilotSchema = z
  .object({
    version: z.literal(1),
    id: text,
    name: text,
    description: text,
    dataAsOf: z.iso.date(),
    origin: z.object(coordinates),
    controls: controlsSchema,
    zones: z
      .array(
        z.object({
          id: text,
          name: text,
          ...coordinates,
          estimatedPopulation: z.number().finite().nonnegative(),
          vulnerabilityWeight: z.number().min(1).max(2),
          vulnerabilityBasis: text,
          provenance: z.enum(["modelled", "verified"]),
          evidence,
        }),
      )
      .min(1)
      .max(20),
    sites: z
      .array(
        z.discriminatedUnion("kind", [
          z
            .object({
              ...siteBase,
              kind: z.literal("candidate"),
              status: z.enum(["eligible_candidate", "unavailable"]),
              provenance: z.enum(["modelled", "verified"]),
              verificationNote: text,
              openingHours: text,
              accessibility: text,
              capacity: z.number().int().nonnegative().nullable(),
              services: z.array(text).min(1).max(20),
            })
            .refine((s) => s.costUnits > 0, "Candidate costs must be positive")
            .refine(
              (s) => !s.eligible || s.permissionConfirmed,
              "Eligible candidates require confirmed site permission",
            ),
          publicFacilitySchema.extend({
            costUnits: z.literal(0),
            eligible: z.literal(false),
          }),
        ]),
      )
      .max(32),
  })
  .superRefine((p, ctx) => {
    const items = [...p.zones, ...p.sites];
    if (new Set(items.map((v) => v.id)).size !== items.length)
      ctx.addIssue({
        code: "custom",
        message: "All zone/site IDs must be unique",
      });
    if (p.sites.filter((s) => s.kind === "candidate").length > 12)
      ctx.addIssue({
        code: "custom",
        message: "At most 12 candidates supported",
      });
    for (const item of items) {
      const projected = project(item, p.origin);
      if (Math.hypot(projected.x, projected.y) > 5000)
        ctx.addIssue({
          code: "custom",
          message: `${item.id}: pilot must stay within 5 km of the projection origin`,
        });
    }
  });
export type GeographicPilot = z.infer<typeof pilotSchema>;
export type PublicFacility = z.infer<typeof publicFacilitySchema>;
export type FacilityCatalog = z.infer<typeof catalogSchema>;
export function project(
  p: { latitude: number; longitude: number },
  origin: { latitude: number; longitude: number },
) {
  const rad = Math.PI / 180,
    earth = 6371008.8;
  const deltaLongitude = ((p.longitude - origin.longitude + 540) % 360) - 180;
  return {
    x: earth * rad * deltaLongitude * Math.cos(origin.latitude * rad),
    y: earth * rad * (p.latitude - origin.latitude),
  };
}
export function verificationCurrent(
  v: z.infer<typeof verificationSchema>,
  now = Date.now(),
) {
  return Date.parse(v.checkedAt) <= now && now < Date.parse(v.validUntil);
}
export function publicFacilities(catalog: FacilityCatalog, now = Date.now()) {
  if (Date.parse(catalog.updatedAt) > now) return [];
  return catalog.facilities.filter(
    (f) =>
      f.status === "verified_open" &&
      f.publicAccess &&
      f.permissionConfirmed &&
      Date.parse(f.evidence.asOf) <= now &&
      verificationCurrent(f.verification, now),
  );
}
export function pilotToScenario(
  p: GeographicPilot,
  now = Date.now(),
): Scenario {
  return parseScenario({
    id: p.id,
    name: p.name,
    description: p.description,
    mode: "verified-pilot",
    coordinateSystem: "local-meters",
    dataAsOf: p.dataAsOf,
    weatherLocation: {
      label: `${p.name} regional weather (context only)`,
      latitude: p.origin.latitude,
      longitude: p.origin.longitude,
    },
    ...p.controls,
    zones: p.zones.map((z) => ({ ...z, ...project(z, p.origin) })),
    sites: p.sites.map((s) => ({
      ...s,
      ...project(s, p.origin),
      status:
        s.kind === "existing" &&
        (!verificationCurrent(s.verification, now) ||
          !s.publicAccess ||
          !s.permissionConfirmed)
          ? "unavailable"
          : s.status,
      verificationNote:
        s.kind === "existing"
          ? `${s.verification.method}; checked ${s.verification.checkedAt}; expiry ${s.verification.validUntil}`
          : s.verificationNote,
    })),
    sourceManifest: [...p.zones, ...p.sites].map((v) => ({
      label: `${v.id}: ${v.name}`,
      type: v.provenance,
      sourceUrl: v.evidence.sourceUrl,
      note: `${v.evidence.note}; as of ${v.evidence.asOf}; resolution: ${v.evidence.resolution}; license: ${v.evidence.license}${"kind" in v ? `; hours: ${v.openingHours}; capacity: ${v.capacity ?? "unknown"}; accessibility: ${v.accessibility}; services: ${v.services.join(", ")}` : ""}`,
    })),
  });
}
export function parsePilot(input: unknown, now = Date.now()) {
  const pilot = pilotSchema.parse(input);
  for (const item of [...pilot.zones, ...pilot.sites])
    if (Date.parse(item.evidence.asOf) > now)
      throw new Error(`${item.id}: source date cannot be in the future`);
  if (Date.parse(pilot.dataAsOf) > now)
    throw new Error("Pilot data date cannot be in the future");
  pilotToScenario(pilot, now);
  return pilot;
}
