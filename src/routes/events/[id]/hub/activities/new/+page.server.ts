import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Zone } from '$lib/types/db-types';
import { requirePartnerToken } from '$lib/server/partnerHub';

export const load: PageServerLoad = async ({ platform, params, url }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const eventId = parseInt(params.id);
  const token = url.searchParams.get('token')?.trim() ?? null;
  const event = await requirePartnerToken(db, eventId, token);

  const zonesRes = await db
    .prepare('SELECT id, name FROM zones WHERE event_id = ? ORDER BY display_order, id')
    .bind(eventId)
    .all<Pick<Zone, 'id' | 'name'>>();

  return {
    event: { id: event.id, name: event.name },
    zones: zonesRes.results ?? [],
    token: token ?? ''
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
  default: async ({ request, platform, params, url }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const token = url.searchParams.get('token')?.trim() ?? null;
    await requirePartnerToken(db, eventId, token);

    const form = await request.formData();
    const title = form.get('title')?.toString().trim();
    const startTime = form.get('start_time')?.toString().trim();
    if (!title) return fail(400, { error: 'Title is required' });
    if (!startTime) return fail(400, { error: 'Start time is required' });

    const endTime = form.get('end_time')?.toString().trim() || null;
    const notes = form.get('notes')?.toString().trim() || null;
    const zoneId = parseInt0(form.get('zone_id'));

    const max = await db
      .prepare('SELECT COALESCE(MAX(display_order), -1) AS m FROM activities WHERE event_id = ?')
      .bind(eventId)
      .first<{ m: number }>();
    const displayOrder = (max?.m ?? -1) + 1;

    await db
      .prepare(
        `INSERT INTO activities (event_id, zone_id, title, start_time, end_time, notes, display_order, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'partner')`
      )
      .bind(eventId, zoneId, title, startTime, endTime, notes, displayOrder)
      .run();

    throw redirect(303, `/events/${eventId}/hub?token=${token}`);
  }
};
