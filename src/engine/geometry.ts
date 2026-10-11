import type { Point } from "../types/domain";
export const EPSILON = 1e-9;
export const distance = (a: Point, b: Point) =>
  Math.hypot(a.x - b.x, a.y - b.y);
export const withinRadius = (a: Point, b: Point, radius: number) =>
  distance(a, b) <= radius + EPSILON;
