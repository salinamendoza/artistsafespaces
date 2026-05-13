import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Zone, Activity, Task, TaskStatus } from '$lib/types/db-types';
import { validatePartnerToken, requirePartnerToken } from '$lib/server/partnerHub';

const TASK_STATUSES: TaskStatus[] = ['open', 'blocked', 'done'];

interface BookingSummaryRow {
  artist_name: string;
  rate: number;
  materials_allowance: number | null;
}

interface PartnerRow {
  paid_by: 'us' | 'client' | 'none';
  amount: number | null;
}

export const load: PageServerLoad = async ({ platform, params, url, setHeaders }) => {
  const db = platform?.env?.DB;
  if (!db) {
    return { expired: true as const, eventName: null, token: null };
  }

  setHeaders({
    'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
  });

  const id = parseInt(params.id);
  const token = url.searchParams.get('token')?.trim() ?? null;
  const event = await validatePartnerToken(db, id, token);

  if (!event) {
    return { expired: true as const, eventName: null, token };
  }

  const [zonesRes, activitiesRes, tasksRes, bookingSummary, partnersResult] = await Promise.all([
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
      .all<Task>(),
    db
      .prepare(
        `SELECT a.name AS artist_name, bk.rate, bk.materials_allowance
           FROM bookings bk
           JOIN briefs br ON br.id = bk.brief_id
           JOIN artists a ON a.id = bk.artist_id
          WHERE br.event_id = ?`
      )
      .bind(id)
      .all<BookingSummaryRow>(),
    db
      .prepare(`SELECT paid_by, amount FROM event_partners WHERE event_id = ?`)
      .bind(id)
      .all<PartnerRow>()
  ]);

  const bookings = bookingSummary.results ?? [];
  const artistCount = new Set(bookings.map((b) => b.artist_name)).size;
  const totalCost = bookings.reduce(
    (sum, b) => sum + (b.rate ?? 0) + (b.materials_allowance ?? 0),
    0
  );
  const partners = partnersResult.results ?? [];
  const partnerSpend = partners.reduce(
    (sum, p) => sum + (p.paid_by === 'us' || p.paid_by === 'client' ? p.amount ?? 0 : 0),
    0
  );

  return {
    expired: false as const,
    token: token ?? '',
    event,
    zones: zonesRes.results ?? [],
    activities: activitiesRes.results ?? [],
    tasks: tasksRes.results ?? [],
    stats: { artistCount, totalCost, partnerSpend }
  };
};

export const actions: Actions = {
  toggleTaskStatus: async ({ request, platform, params, url }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const token = url.searchParams.get('token')?.trim() ?? null;
    await requirePartnerToken(db, eventId, token);

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
      .prepare(
        `UPDATE tasks SET status = ?, status_updated_at = datetime('now')
         WHERE id = ? AND event_id = ?`
      )
      .bind(status, taskId, eventId)
      .run();

    return { toggled: { task_id: taskId, status } };
  }
};
