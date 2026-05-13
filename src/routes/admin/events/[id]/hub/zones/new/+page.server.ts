import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event } from '$lib/types/db-types';

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const id = parseInt(params.id);
  const event = await db
    .prepare('SELECT id, name FROM events WHERE id = ?')
    .bind(id)
    .first<Pick<Event, 'id' | 'name'>>();
  if (!event) throw error(404, 'Event not found');

  return { event };
};

function parseOrder(v: FormDataEntryValue | null): number | null {
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
        `INSERT INTO zones (event_id, name, description, display_order)
         VALUES (?, ?, ?, ?)`
      )
      .bind(eventId, name, description, displayOrder)
      .run();

    throw redirect(303, `/admin/events/${eventId}/hub`);
  }
};
