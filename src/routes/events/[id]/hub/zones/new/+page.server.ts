import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { requirePartnerToken } from '$lib/server/partnerHub';

export const load: PageServerLoad = async ({ platform, params, url }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const eventId = parseInt(params.id);
  const token = url.searchParams.get('token')?.trim() ?? null;
  const event = await requirePartnerToken(db, eventId, token);

  return { event: { id: event.id, name: event.name }, token: token ?? '' };
};

function parseOrder(v: FormDataEntryValue | null): number | null {
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
    const name = form.get('name')?.toString().trim();
    if (!name) return fail(400, { error: 'Name is required' });

    const description = form.get('description')?.toString().trim() || null;
    let displayOrder = parseOrder(form.get('display_order'));
    if (displayOrder === null) {
      const max = await db
        .prepare('SELECT COALESCE(MAX(display_order), -1) AS m FROM zones WHERE event_id = ?')
        .bind(eventId)
        .first<{ m: number }>();
      displayOrder = (max?.m ?? -1) + 1;
    }

    await db
      .prepare(
        `INSERT INTO zones (event_id, name, description, display_order, created_by)
         VALUES (?, ?, ?, ?, 'partner')`
      )
      .bind(eventId, name, description, displayOrder)
      .run();

    throw redirect(303, `/events/${eventId}/hub?token=${token}`);
  }
};
