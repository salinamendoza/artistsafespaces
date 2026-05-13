import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event } from '$lib/types/db-types';

function normalizeEmail(s: string): string {
  return s.trim().toLowerCase();
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const event = await db
    .prepare('SELECT id, name, client_name, event_date, location, status FROM events WHERE rsvp_token = ?')
    .bind(params.token)
    .first<Pick<Event, 'id' | 'name' | 'client_name' | 'event_date' | 'location' | 'status'>>();

  if (!event) throw error(404, 'RSVP link not found');

  return { event };
};

export const actions: Actions = {
  default: async ({ request, platform, params, getClientAddress }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const event = await db
      .prepare('SELECT id FROM events WHERE rsvp_token = ?')
      .bind(params.token)
      .first<{ id: number }>();
    if (!event) return fail(404, { error: 'RSVP link not found' });

    const form = await request.formData();
    const name = form.get('name')?.toString().trim() ?? '';
    const email = normalizeEmail(form.get('email')?.toString() ?? '');

    if (!name) return fail(400, { error: 'Name is required', values: { name, email } });
    if (!email || !isValidEmail(email)) {
      return fail(400, { error: 'Valid email is required', values: { name, email } });
    }

    let ip: string | null = null;
    try {
      ip = getClientAddress();
    } catch {
      ip = null;
    }
    const ua = request.headers.get('user-agent');

    try {
      await db
        .prepare(
          `INSERT INTO rsvps (event_id, name, email, ip_address, user_agent)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(event.id, name, email, ip, ua)
        .run();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('UNIQUE')) {
        // Treat duplicate email as success (idempotent RSVP).
        return { success: true, name, email, already: true };
      }
      return fail(500, { error: 'Could not save RSVP. Try again.', values: { name, email } });
    }

    return { success: true, name, email, already: false };
  }
};
