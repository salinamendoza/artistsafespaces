import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event, Zone, Activity, TaskStatus } from '$lib/types/db-types';

const TASK_STATUSES: TaskStatus[] = ['open', 'blocked', 'done'];

export const load: PageServerLoad = async ({ platform, params, url }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const id = parseInt(params.id);
  const [event, zonesRes, activitiesRes] = await Promise.all([
    db
      .prepare('SELECT id, name FROM events WHERE id = ?')
      .bind(id)
      .first<Pick<Event, 'id' | 'name'>>(),
    db
      .prepare('SELECT id, name FROM zones WHERE event_id = ? ORDER BY display_order, id')
      .bind(id)
      .all<Pick<Zone, 'id' | 'name'>>(),
    db
      .prepare(
        'SELECT id, title, start_time FROM activities WHERE event_id = ? ORDER BY start_time, display_order, id'
      )
      .bind(id)
      .all<Pick<Activity, 'id' | 'title' | 'start_time'>>()
  ]);
  if (!event) throw error(404, 'Event not found');

  const preZone = parseInt(url.searchParams.get('zone') ?? '');
  const preActivity = parseInt(url.searchParams.get('activity') ?? '');

  return {
    event,
    zones: zonesRes.results ?? [],
    activities: activitiesRes.results ?? [],
    preZone: Number.isInteger(preZone) ? preZone : null,
    preActivity: Number.isInteger(preActivity) ? preActivity : null
  };
};

function parseInt0(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = v.toString().trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isInteger(n) ? n : null;
}

function normalizeStatus(v: FormDataEntryValue | null): TaskStatus {
  const s = v?.toString();
  return TASK_STATUSES.includes(s as TaskStatus) ? (s as TaskStatus) : 'open';
}

export const actions: Actions = {
  default: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const form = await request.formData();
    const title = form.get('title')?.toString().trim();
    if (!title) return fail(400, { error: 'Title is required' });

    const owner = form.get('owner')?.toString().trim() || null;
    const status = normalizeStatus(form.get('status'));
    const zoneId = parseInt0(form.get('zone_id'));
    const activityId = parseInt0(form.get('activity_id'));
    const dueDate = form.get('due_date')?.toString().trim() || null;
    const notes = form.get('notes')?.toString().trim() || null;

    let displayOrder = parseInt0(form.get('display_order'));
    if (displayOrder === null) {
      const max = await db
        .prepare(
          'SELECT COALESCE(MAX(display_order), -1) AS m FROM tasks WHERE event_id = ?'
        )
        .bind(eventId)
        .first<{ m: number }>();
      displayOrder = (max?.m ?? -1) + 1;
    }

    await db
      .prepare(
        `INSERT INTO tasks (event_id, zone_id, activity_id, title, owner, status, due_date, notes, display_order, status_updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
      )
      .bind(eventId, zoneId, activityId, title, owner, status, dueDate, notes, displayOrder)
      .run();

    throw redirect(303, `/admin/events/${eventId}/hub`);
  }
};
