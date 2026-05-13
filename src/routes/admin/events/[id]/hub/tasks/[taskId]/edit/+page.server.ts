import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event, Zone, Activity, Task, TaskStatus } from '$lib/types/db-types';

const TASK_STATUSES: TaskStatus[] = ['open', 'blocked', 'done'];

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const eventId = parseInt(params.id);
  const taskId = parseInt(params.taskId);

  const [event, task, zonesRes, activitiesRes] = await Promise.all([
    db
      .prepare('SELECT id, name FROM events WHERE id = ?')
      .bind(eventId)
      .first<Pick<Event, 'id' | 'name'>>(),
    db
      .prepare('SELECT * FROM tasks WHERE id = ? AND event_id = ?')
      .bind(taskId, eventId)
      .first<Task>(),
    db
      .prepare('SELECT id, name FROM zones WHERE event_id = ? ORDER BY display_order, id')
      .bind(eventId)
      .all<Pick<Zone, 'id' | 'name'>>(),
    db
      .prepare(
        'SELECT id, title, start_time FROM activities WHERE event_id = ? ORDER BY start_time, display_order, id'
      )
      .bind(eventId)
      .all<Pick<Activity, 'id' | 'title' | 'start_time'>>()
  ]);

  if (!event) throw error(404, 'Event not found');
  if (!task) throw error(404, 'Task not found');

  return {
    event,
    task,
    zones: zonesRes.results ?? [],
    activities: activitiesRes.results ?? []
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
  save: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const taskId = parseInt(params.taskId);
    const form = await request.formData();
    const title = form.get('title')?.toString().trim();
    if (!title) return fail(400, { error: 'Title is required' });

    const owner = form.get('owner')?.toString().trim() || null;
    const status = normalizeStatus(form.get('status'));
    const zoneId = parseInt0(form.get('zone_id'));
    const activityId = parseInt0(form.get('activity_id'));
    const dueDate = form.get('due_date')?.toString().trim() || null;
    const notes = form.get('notes')?.toString().trim() || null;
    const displayOrder = parseInt0(form.get('display_order')) ?? 0;

    await db
      .prepare(
        `UPDATE tasks SET zone_id = ?, activity_id = ?, title = ?, owner = ?,
                          status = ?, due_date = ?, notes = ?, display_order = ?
         WHERE id = ? AND event_id = ?`
      )
      .bind(zoneId, activityId, title, owner, status, dueDate, notes, displayOrder, taskId, eventId)
      .run();

    throw redirect(303, `/admin/events/${eventId}/hub`);
  },
  delete: async ({ platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const taskId = parseInt(params.taskId);

    await db
      .prepare('DELETE FROM tasks WHERE id = ? AND event_id = ?')
      .bind(taskId, eventId)
      .run();

    throw redirect(303, `/admin/events/${eventId}/hub`);
  }
};
