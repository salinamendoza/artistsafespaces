import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event } from '$lib/types/db-types';

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const id = parseInt(params.id);
  const event = await db.prepare('SELECT id, name FROM events WHERE id = ?').bind(id).first<Pick<Event, 'id' | 'name'>>();
  if (!event) throw error(404, 'Event not found');

  return { event };
};

function parseAmount(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = v.toString().trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function normalizePaidBy(v: FormDataEntryValue | null): 'us' | 'client' | 'none' {
  const s = v?.toString();
  return s === 'us' || s === 'client' ? s : 'none';
}

export const actions: Actions = {
  default: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const form = await request.formData();
    const name = form.get('name')?.toString().trim();
    if (!name) return fail(400, { error: 'Name is required' });

    const role = form.get('role')?.toString().trim() || null;
    const paid_by = normalizePaidBy(form.get('paid_by'));
    const amount = parseAmount(form.get('amount'));
    const website = form.get('website')?.toString().trim() || null;
    const contact = form.get('contact')?.toString().trim() || null;
    const notes = form.get('notes')?.toString().trim() || null;

    await db
      .prepare(
        `INSERT INTO event_partners (event_id, name, role, paid_by, amount, website, contact, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(eventId, name, role, paid_by, amount, website, contact, notes)
      .run();

    throw redirect(303, `/admin/events/${eventId}`);
  }
};
