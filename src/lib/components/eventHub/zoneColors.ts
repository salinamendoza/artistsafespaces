// Zone color assignment. Color is derived from the zone *name*: zones whose
// name starts with "Outside" get the Outside palette, "Inside" gets the
// Inside palette, anything else falls back to neutral. The same zone
// therefore gets the same colors in Run of Show, Zones, and Open Items.
//
// Amber is reserved exclusively for the "blocked" task status — do NOT add
// an amber entry here.

import type { Zone } from '$lib/types/db-types';

export interface ZoneColor {
  pill: string;
  dot: string;
}

const OUTSIDE: ZoneColor = {
  pill: 'bg-green-50 border-green-200 text-green-700',
  dot: 'bg-green-400'
};

const INSIDE: ZoneColor = {
  pill: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  dot: 'bg-indigo-400'
};

const NEUTRAL: ZoneColor = {
  pill: 'bg-gray-50 border-gray-200 text-gray-600',
  dot: 'bg-gray-300'
};

function colorForName(name: string): ZoneColor {
  const head = name.trim().toLowerCase();
  if (head.startsWith('outside')) return OUTSIDE;
  if (head.startsWith('inside')) return INSIDE;
  return NEUTRAL;
}

export function buildZoneColorMap(zones: Pick<Zone, 'id' | 'name'>[]): Map<number, ZoneColor> {
  const map = new Map<number, ZoneColor>();
  zones.forEach((z) => map.set(z.id, colorForName(z.name)));
  return map;
}

export function zoneColorFor(
  colorMap: Map<number, ZoneColor>,
  zoneId: number | null | undefined
): ZoneColor {
  if (zoneId == null) return NEUTRAL;
  return colorMap.get(zoneId) ?? NEUTRAL;
}
