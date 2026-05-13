import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event, Zone } from '$lib/types/db-types';

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const eventId = parseInt(params.id);
  const zoneId = parseInt(params.zoneId);

  const [event, zone, counts] = await Promise.all([
    db
      .prepare('SELECT id, name FROM events WHERE id = ?')
      .bind(eventId)
      .first<Pick<Event, 'id' | 'name'>>(),
    db
      .prepare('SELECT * FROM zones WHERE id = ? AND event_id = ?')
      .bind(zoneId, eventId)
      .first<Zone>(),
    db
      .prepare(
        `SELECT
            (SELECT COUNT(*) FROM activities WHERE zone_id = ?) AS activity_count,
            (SELECT COUNT(*) FROM tasks      WHERE zone_id = ?) AS task_count`
      )
      .bind(zoneId, zoneId)
      .first<{ activity_count: number; task_count: number }>()
  ]);

  if (!event) throw error(404, 'Event not found');
  if (!zone) throw error(404, 'Zone not found');

  return {
    event,
    zone,
    counts: counts ?? { activity_count: 0, task_count: 0 }
  };
};

function parseOrder(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = v.toString().trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isInteger(n) ? n : null;
}

export const actions: Actions = {
  save: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const zoneId = parseInt(params.zoneId);
    const form = await request.formData();
    const name = form.get('name')?.toString().trim();
    if (!name) return fail(400, { error: 'Name is required' });

    const description = form.get('description')?.toString().trim() || null;
    const displayOrder = parseOrder(form.get('display_order')) ?? 0;

    await db
      .prepare(
        `UPDATE zones SET name = ?, description = ?, display_order = ?
         WHERE id = ? AND event_id = ?`
      )
      .bind(name, description, displayOrder, zoneId, eventId)
      .run();

    throw redirect(303, `/admin/events/${eventId}/hub`);
  },
  delete: async ({ platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const zoneId = parseInt(params.zoneId);

    await db
      .prepare('DELETE FROM zones WHERE id = ? AND event_id = ?')
      .bind(zoneId, eventId)
      .run();

    throw redirect(303, `/admin/events/${eventId}/hub`);
  }
};
