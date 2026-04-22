import type { PageServerLoad } from './$types';
import type { Event } from '$lib/server/db-types';

type EventWithCounts = Event & { brief_count: number; booking_count: number };

export const load: PageServerLoad = async ({ platform }) => {
  const db = platform?.env?.DB;
  if (!db) return { events: [] as EventWithCounts[] };

  const result = await db
    .prepare(`
      SELECT e.*,
        (SELECT COUNT(*) FROM briefs WHERE event_id = e.id) AS brief_count,
        (SELECT COUNT(*) FROM bookings bk
           JOIN briefs br ON br.id = bk.brief_id
           WHERE br.event_id = e.id) AS booking_count
      FROM events e
      ORDER BY
        CASE WHEN e.event_date IS NULL THEN 1 ELSE 0 END,
        e.event_date DESC,
        e.created_at DESC
    `)
    .all<EventWithCounts>();

  return { events: result.results ?? [] };
};
