import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const name = form.get('name')?.toString().trim();
    if (!name) return fail(400, { error: 'Event name is required' });

    const client_name = form.get('client_name')?.toString().trim() || null;
    const event_date = form.get('event_date')?.toString().trim() || null;
    const location = form.get('location')?.toString().trim() || null;
    const status = form.get('status')?.toString().trim() || 'planning';
    const internal_notes = form.get('internal_notes')?.toString().trim() || null;
    const billing_to = form.get('billing_to')?.toString().trim() || null;
    const invoice_email = form.get('invoice_email')?.toString().trim() || null;

    const result = await db
      .prepare(
        `INSERT INTO events (name, client_name, event_date, location, status, internal_notes, billing_to, invoice_email)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
      )
      .bind(name, client_name, event_date, location, status, internal_notes, billing_to, invoice_email)
      .first<{ id: number }>();

    throw redirect(303, `/admin/events/${result?.id ?? ''}`);
  }
};
