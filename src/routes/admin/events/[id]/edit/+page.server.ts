import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event } from '$lib/types/db-types';

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const id = parseInt(params.id);
  const event = await db.prepare('SELECT * FROM events WHERE id = ?').bind(id).first<Event>();
  if (!event) throw error(404, 'Event not found');

  return { event };
};

export const actions: Actions = {
  default: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const id = parseInt(params.id);
    const form = await request.formData();
    const name = form.get('name')?.toString().trim();
    if (!name) return fail(400, { error: 'Event name is required' });

    const client_name = form.get('client_name')?.toString().trim() || null;
    const event_date = form.get('event_date')?.toString().trim() || null;
    const location = form.get('location')?.toString().trim() || null;
    const status = form.get('status')?.toString().trim() || 'planning';
    const internal_notes = form.get('internal_notes')?.toString().trim() || null;

    await db
      .prepare(
        `UPDATE events SET name = ?, client_name = ?, event_date = ?, location = ?, status = ?, internal_notes = ? WHERE id = ?`
      )
      .bind(name, client_name, event_date, location, status, internal_notes, id)
      .run();

    throw redirect(303, `/admin/events/${id}`);
  }
};
