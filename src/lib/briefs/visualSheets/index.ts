import type { Component } from 'svelte';

export const visualSheetRegistry: Record<string, () => Promise<{ default: Component }>> = {
  'helms-screenprint-2026': () => import('./HelmsScreenprintSheet.svelte')
};

export function hasVisualSheet(slug: string | null | undefined): boolean {
  return !!slug && slug in visualSheetRegistry;
}

export function getVisualSheetSlugs(): string[] {
  return Object.keys(visualSheetRegistry);
}
