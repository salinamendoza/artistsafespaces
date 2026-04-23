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

/**
 * Compact relative-time label like "2h ago", "yesterday", "3d ago".
 * Assumes full 'YYYY-MM-DD HH:MM:SS' UTC timestamps from D1.
 */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '';
  const ts = new Date(iso + (iso.length > 10 ? 'Z' : '')).getTime();
  if (Number.isNaN(ts)) return '';
  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diffSec < 60) return 'just now';
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

