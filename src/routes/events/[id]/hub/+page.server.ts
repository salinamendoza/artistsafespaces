import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Event, Zone, Activity, Task } from '$lib/types/db-types';

interface BookingSummaryRow {
  artist_name: string;
  rate: number;
  materials_allowance: number | null;
}

interface PartnerRow {
  paid_by: 'us' | 'client' | 'none';
  amount: number | null;
}

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export const load: PageServerLoad = async ({ platform, params, url, setHeaders }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  // Edge cache: short s-maxage with longer stale-while-revalidate so D1 hits
  // stay rare during press-day traffic. Browser revalidates each visit so
  // admin edits show up on the next refresh.
  setHeaders({
    'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
  });

  const id = parseInt(params.id);
  const token = url.searchParams.get('token')?.trim() ?? '';

  if (!Number.isInteger(id) || !token) {
    return { expired: true as const, eventName: null };
  }

  const event = await db.prepare('SELECT * FROM events WHERE id = ?').bind(id).first<Event>();
  if (!event) {
    return { expired: true as const, eventName: null };
  }

  const today = todayISODate();
  const tokenMatches = event.share_token != null && event.share_token === token;
  const notExpired = event.share_expires_at != null && event.share_expires_at >= today;

  if (!tokenMatches || !notExpired) {
    return { expired: true as const, eventName: event.name };
  }

  const [zonesRes, activitiesRes, tasksRes, bookingSummary, partnersResult] = await Promise.all([
    db
      .prepare('SELECT * FROM zones WHERE event_id = ? ORDER BY display_order, id')
      .bind(id)
      .all<Zone>(),
    db
      .prepare('SELECT * FROM activities WHERE event_id = ? ORDER BY start_time, display_order, id')
      .bind(id)
      .all<Activity>(),
    db
      .prepare(
        `SELECT * FROM tasks
          WHERE event_id = ?
          ORDER BY (status = 'blocked') DESC,
                   (status = 'open') DESC,
                   display_order, id`
      )
      .bind(id)
      .all<Task>(),
    db
      .prepare(
        `SELECT a.name AS artist_name, bk.rate, bk.materials_allowance
           FROM bookings bk
           JOIN briefs br ON br.id = bk.brief_id
           JOIN artists a ON a.id = bk.artist_id
          WHERE br.event_id = ?`
      )
      .bind(id)
      .all<BookingSummaryRow>(),
    db
      .prepare(`SELECT paid_by, amount FROM event_partners WHERE event_id = ?`)
      .bind(id)
      .all<PartnerRow>()
  ]);

  const bookings = bookingSummary.results ?? [];
  const artistCount = new Set(bookings.map((b) => b.artist_name)).size;
  const totalCost = bookings.reduce(
    (sum, b) => sum + (b.rate ?? 0) + (b.materials_allowance ?? 0),
    0
  );
  const partners = partnersResult.results ?? [];
  const partnerSpend = partners.reduce(
    (sum, p) => sum + (p.paid_by === 'us' || p.paid_by === 'client' ? p.amount ?? 0 : 0),
    0
  );

  return {
    expired: false as const,
    event,
    zones: zonesRes.results ?? [],
    activities: activitiesRes.results ?? [],
    tasks: tasksRes.results ?? [],
    stats: { artistCount, totalCost, partnerSpend }
  };
};
