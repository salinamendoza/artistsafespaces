import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event } from '$lib/server/db-types';

interface BriefRow {
  id: number;
  title: string;
  status: string;
  activation_type_name: string;
  booking_count: number;
  created_at: string;
}

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const id = parseInt(params.id);
  const event = await db.prepare('SELECT * FROM events WHERE id = ?').bind(id).first<Event>();
  if (!event) throw error(404, 'Event not found');

  const briefs = await db
    .prepare(`
      SELECT br.id, br.title, br.status, br.created_at,
             at.name AS activation_type_name,
             (SELECT COUNT(*) FROM bookings WHERE brief_id = br.id) AS booking_count
      FROM briefs br
      JOIN activation_types at ON at.id = br.activation_type_id
      WHERE br.event_id = ?
      ORDER BY br.created_at DESC
    `)
    .bind(id)
    .all<BriefRow>();

  return { event, briefs: briefs.results ?? [] };
};

export const actions: Actions = {
  delete: async ({ platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const id = parseInt(params.id);
    const briefCount = await db
      .prepare('SELECT COUNT(*) AS n FROM briefs WHERE event_id = ?')
      .bind(id)
      .first<{ n: number }>();

    if ((briefCount?.n ?? 0) > 0) {
      return fail(400, { error: 'Cannot delete — event has briefs. Delete them first.' });
    }

    await db.prepare('DELETE FROM events WHERE id = ?').bind(id).run();
    throw redirect(303, '/admin/events');
  }
};
