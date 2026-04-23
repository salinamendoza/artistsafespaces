import type { PageServerLoad } from './$types';
import type { Artist } from '$lib/types/db-types';

type ArtistWithCount = Artist & { booking_count: number; total_booked: number };

export const load: PageServerLoad = async ({ platform }) => {
  const db = platform?.env?.DB;
  if (!db) return { artists: [] as ArtistWithCount[] };

  // total_booked: sum of rate + materials across accepted + completed bookings.
  // Declined and cancelled bookings don't count. Invited (not yet accepted) also
  // don't count — they're potential, not committed.
  const result = await db
    .prepare(`
      SELECT
        a.*,
        COUNT(b.id) AS booking_count,
        COALESCE(SUM(CASE WHEN b.status IN ('accepted', 'completed')
          THEN COALESCE(b.rate, 0) + COALESCE(b.materials_allowance, 0)
          ELSE 0 END), 0) AS total_booked
      FROM artists a
      LEFT JOIN bookings b ON b.artist_id = a.id
      GROUP BY a.id
      ORDER BY a.name ASC
    `)
    .all<ArtistWithCount>();

  return { artists: result.results ?? [] };
};
