/**
 * Format a D1 date string for display.
 *
 * Date-only values ('YYYY-MM-DD' — e.g. event_date) are interpreted in the
 * viewer's LOCAL timezone. `new Date('2026-05-02')` would otherwise be parsed
 * as UTC midnight and shift back a day in negative-UTC zones (a 5/2 event
 * date displaying as "May 1" for Pacific viewers).
 *
 * Full timestamps ('YYYY-MM-DD HH:MM:SS' from D1's CURRENT_TIMESTAMP) are
 * interpreted as UTC and rendered in the viewer's local zone.
 */
export function formatDate(iso: string | null | undefined, options: Intl.DateTimeFormatOptions): string {
  if (!iso) return '';
  if (iso.length <= 10) {
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return '';
    return new Date(y, m - 1, d).toLocaleDateString('en-US', options);
  }
  return new Date(iso + 'Z').toLocaleDateString('en-US', options);
}
