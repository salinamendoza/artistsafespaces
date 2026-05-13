import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event, Zone, Activity } from '$lib/types/db-types';

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const eventId = parseInt(params.id);
  const activityId = parseInt(params.activityId);

  const [event, activity, zonesRes, taskCountRow] = await Promise.all([
    db
      .prepare('SELECT id, name FROM events WHERE id = ?')
      .bind(eventId)
      .first<Pick<Event, 'id' | 'name'>>(),
    db
      .prepare('SELECT * FROM activities WHERE id = ? AND event_id = ?')
      .bind(activityId, eventId)
      .first<Activity>(),
    db
      .prepare('SELECT id, name FROM zones WHERE event_id = ? ORDER BY display_order, id')
      .bind(eventId)
      .all<Pick<Zone, 'id' | 'name'>>(),
    db
      .prepare('SELECT COUNT(*) AS n FROM tasks WHERE activity_id = ?')
      .bind(activityId)
      .first<{ n: number }>()
  ]);

  if (!event) throw error(404, 'Event not found');
  if (!activity) throw error(404, 'Activity not found');

  return {
    event,
    activity,
    zones: zonesRes.results ?? [],
    taskCount: taskCountRow?.n ?? 0
  };
};

function parseInt0(v: FormDataEntryValue | null): number | null {
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
    const activityId = parseInt(params.activityId);
    const form = await request.formData();
    const title = form.get('title')?.toString().trim();
    const startTime = form.get('start_time')?.toString().trim();
    if (!title) return fail(400, { error: 'Title is required' });
    if (!startTime) return fail(400, { error: 'Start time is required' });

    const endTime = form.get('end_time')?.toString().trim() || null;
    const notes = form.get('notes')?.toString().trim() || null;
    const zoneId = parseInt0(form.get('zone_id'));
    const displayOrder = parseInt0(form.get('display_order')) ?? 0;

    await db
      .prepare(
        `UPDATE activities SET zone_id = ?, title = ?, start_time = ?, end_time = ?,
                               notes = ?, display_order = ?
         WHERE id = ? AND event_id = ?`
      )
      .bind(zoneId, title, startTime, endTime, notes, displayOrder, activityId, eventId)
      .run();

    throw redirect(303, `/admin/events/${eventId}/hub`);
  },
  delete: async ({ platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const activityId = parseInt(params.activityId);

    await db
      .prepare('DELETE FROM activities WHERE id = ? AND event_id = ?')
      .bind(activityId, eventId)
      .run();

    throw redirect(303, `/admin/events/${eventId}/hub`);
  }
};
