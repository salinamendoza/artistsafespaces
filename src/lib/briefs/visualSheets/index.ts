import type { Component } from 'svelte';

/**
 * Visual sheet registry — auto-populated from `./sheets/*.svelte`.
 *
 * To add a new sheet:
 *   1. Drop the source HTML preview at `./sources/<slug>.html` (optional but
 *      recommended for traceability).
 *   2. Convert it once into `./sheets/<slug>.svelte` (CSS scoped to a
 *      `.<slug>-root` wrapper, modal state via Svelte reactivity, etc.).
 *   3. That's it — the registry below picks it up by filename and the admin
 *      brief-edit dropdown shows it without any code changes here.
 *
 * Slug convention: `<eventname>-<client>-<type>-<year>`.
 */
const sheetModules = import.meta.glob<{ default: Component }>('./sheets/*.svelte');

export const visualSheetRegistry: Record<string, () => Promise<{ default: Component }>> = Object.fromEntries(
  Object.entries(sheetModules).map(([path, loader]) => {
    const match = path.match(/\/sheets\/(.+)\.svelte$/);
    if (!match) throw new Error(`Unexpected visual sheet path: ${path}`);
    return [match[1], loader];
  })
);

export function hasVisualSheet(slug: string | null | undefined): boolean {
  return !!slug && slug in visualSheetRegistry;
}

export function getVisualSheetSlugs(): string[] {
  return Object.keys(visualSheetRegistry).sort();
}
