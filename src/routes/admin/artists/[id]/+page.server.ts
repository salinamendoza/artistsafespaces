import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Artist } from '$lib/server/db-types';

interface BookingRow {
  id: number;
  share_token: string;
  rate: number;
  status: string;
  invoice_status: string;
  created_at: string;
  brief_title: string;
  brief_id: number;
  event_id: number;
  event_name: string;
  event_date: string | null;
}

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const id = parseInt(params.id);
  const artist = await db.prepare('SELECT * FROM artists WHERE id = ?').bind(id).first<Artist>();
  if (!artist) throw error(404, 'Artist not found');

  const bookings = await db
    .prepare(`
      SELECT b.id, b.share_token, b.rate, b.status, b.invoice_status, b.created_at,
             br.title AS brief_title, br.id AS brief_id,
             e.id AS event_id, e.name AS event_name, e.event_date
      FROM bookings b
      JOIN briefs br ON br.id = b.brief_id
      JOIN events e ON e.id = br.event_id
      WHERE b.artist_id = ?
      ORDER BY b.created_at DESC
    `)
    .bind(id)
    .all<BookingRow>();

  return { artist, bookings: bookings.results ?? [] };
};

export const actions: Actions = {
  delete: async ({ platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const id = parseInt(params.id);
    const hasBookings = await db
      .prepare('SELECT COUNT(*) AS n FROM bookings WHERE artist_id = ?')
      .bind(id)
      .first<{ n: number }>();

    if ((hasBookings?.n ?? 0) > 0) {
      return fail(400, { error: 'Cannot delete — artist has bookings. Cancel bookings first.' });
    }

    await db.prepare('DELETE FROM artists WHERE id = ?').bind(id).run();
    throw redirect(303, '/admin/artists');
  }
};
