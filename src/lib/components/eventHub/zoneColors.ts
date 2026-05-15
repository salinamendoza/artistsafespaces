// Zone color assignment. Deterministic: zones are sorted by (display_order, id)
// in the page load, then the i-th zone gets palette[i % palette.length]. The
// same zone therefore gets the same colors in Run of Show, Zones, and Open
// Items on the same page render.
//
// Palette is intentionally small and muted. Amber is reserved exclusively for
// the "blocked" task status — do NOT add an amber entry here.

import type { Zone } from '$lib/types/db-types';

export interface ZoneColor {
  pill: string;
  dot: string;
}

export const ZONE_PALETTE: ZoneColor[] = [
  { pill: 'bg-green-50 border-green-200 text-green-700', dot: 'bg-green-400' },
  { pill: 'bg-indigo-50 border-indigo-200 text-indigo-700', dot: 'bg-indigo-400' },
  { pill: 'bg-rose-50 border-rose-200 text-rose-700', dot: 'bg-rose-400' },
  { pill: 'bg-sky-50 border-sky-200 text-sky-700', dot: 'bg-sky-400' },
  { pill: 'bg-stone-50 border-stone-200 text-stone-700', dot: 'bg-stone-400' }
];

const NEUTRAL: ZoneColor = {
  pill: 'bg-gray-50 border-gray-200 text-gray-600',
  dot: 'bg-gray-300'
};

export function buildZoneColorMap(zones: Pick<Zone, 'id'>[]): Map<number, ZoneColor> {
  const map = new Map<number, ZoneColor>();
  zones.forEach((z, i) => {
    map.set(z.id, ZONE_PALETTE[i % ZONE_PALETTE.length]);
  });
  return map;
}

export function zoneColorFor(
  colorMap: Map<number, ZoneColor>,
  zoneId: number | null | undefined
): ZoneColor {
  if (zoneId == null) return NEUTRAL;
  return colorMap.get(zoneId) ?? NEUTRAL;
}
