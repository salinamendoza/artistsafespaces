import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event, Zone } from '$lib/types/db-types';

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const id = parseInt(params.id);
  const [event, zonesRes] = await Promise.all([
    db
      .prepare('SELECT id, name FROM events WHERE id = ?')
      .bind(id)
      .first<Pick<Event, 'id' | 'name'>>(),
    db
      .prepare('SELECT id, name FROM zones WHERE event_id = ? ORDER BY display_order, id')
      .bind(id)
      .all<Pick<Zone, 'id' | 'name'>>()
  ]);
  if (!event) throw error(404, 'Event not found');

  return { event, zones: zonesRes.results ?? [] };
};

function parseInt0(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = v.toString().trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isInteger(n) ? n : null;
}

export const actions: Actions = {
  default: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const form = await request.formData();
    const title = form.get('title')?.toString().trim();
    const startTime = form.get('start_time')?.toString().trim();
    if (!title) return fail(400, { error: 'Title is required' });
    if (!startTime) return fail(400, { error: 'Start time is required' });

    const endTime = form.get('end_time')?.toString().trim() || null;
    const notes = form.get('notes')?.toString().trim() || null;
    const zoneId = parseInt0(form.get('zone_id'));
    let displayOrder = parseInt0(form.get('display_order'));
    if (displayOrder === null) {
      const max = await db
        .prepare(
          'SELECT COALESCE(MAX(display_order), -1) AS m FROM activities WHERE event_id = ?'
        )
        .bind(eventId)
        .first<{ m: number }>();
      displayOrder = (max?.m ?? -1) + 1;
    }

    await db
      .prepare(
        `INSERT INTO activities (event_id, zone_id, title, start_time, end_time, notes, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(eventId, zoneId, title, startTime, endTime, notes, displayOrder)
      .run();

    throw redirect(303, `/admin/events/${eventId}/hub`);
  }
};
