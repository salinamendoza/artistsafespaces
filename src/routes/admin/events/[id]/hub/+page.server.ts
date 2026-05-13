import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event, Zone, Activity, Task, TaskStatus } from '$lib/types/db-types';

const TASK_STATUSES: TaskStatus[] = ['open', 'blocked', 'done'];

function randomHex(bytes: number): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
}

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const id = parseInt(params.id);
  const event = await db.prepare('SELECT * FROM events WHERE id = ?').bind(id).first<Event>();
  if (!event) throw error(404, 'Event not found');

  const [zonesRes, activitiesRes, tasksRes] = await Promise.all([
    db
      .prepare('SELECT * FROM zones WHERE event_id = ? ORDER BY display_order, id')
      .bind(id)
      .all<Zone>(),
    db
      .prepare('SELECT * FROM activities WHERE event_id = ? ORDER BY start_time, display_order, id')
      .bind(id)
      .all<Activity>(),
    db
      .prepare(
        `SELECT * FROM tasks
          WHERE event_id = ?
          ORDER BY (status = 'blocked') DESC,
                   (status = 'open') DESC,
                   display_order, id`
      )
      .bind(id)
      .all<Task>()
  ]);

  return {
    event,
    zones: zonesRes.results ?? [],
    activities: activitiesRes.results ?? [],
    tasks: tasksRes.results ?? []
  };
};

export const actions: Actions = {
  toggleTaskStatus: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const form = await request.formData();
    const taskId = parseInt(form.get('task_id')?.toString() ?? '');
    const status = form.get('status')?.toString() as TaskStatus | undefined;

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return fail(400, { error: 'Invalid task id' });
    }
    if (!status || !TASK_STATUSES.includes(status)) {
      return fail(400, { error: 'Invalid status' });
    }

    await db
      .prepare('UPDATE tasks SET status = ? WHERE id = ? AND event_id = ?')
      .bind(status, taskId, eventId)
      .run();

    return { toggled: { task_id: taskId, status } };
  },

  rotateToken: async ({ platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const newToken = randomHex(16);

    await db
      .prepare('UPDATE events SET share_token = ? WHERE id = ?')
      .bind(newToken, eventId)
      .run();

    throw redirect(303, `/admin/events/${eventId}/hub`);
  }
};
