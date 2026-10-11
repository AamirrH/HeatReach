import { expect, it } from 'vitest';
import { distance, withinRadius } from '../engine/geometry';
it('uses Euclidean local meters and includes the radius boundary', () => {
  expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  expect(withinRadius({ x: 0, y: 0 }, { x: 180, y: 0 }, 180)).toBe(true);
  expect(withinRadius({ x: 0, y: 0 }, { x: 180.00001, y: 0 }, 180)).toBe(false);
});
