import type { PageServerLoad } from './$types';
import type { Artist } from '$lib/types/db-types';

type ArtistWithCount = Artist & { booking_count: number };

export const load: PageServerLoad = async ({ platform }) => {
  const db = platform?.env?.DB;
  if (!db) return { artists: [] as ArtistWithCount[] };

  const result = await db
    .prepare(`
      SELECT a.*, COUNT(b.id) AS booking_count
      FROM artists a
      LEFT JOIN bookings b ON b.artist_id = a.id
      GROUP BY a.id
      ORDER BY a.name ASC
    `)
    .all<ArtistWithCount>();

  return { artists: result.results ?? [] };
};
