import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event, Activity } from '$lib/types/db-types';

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

  const activitiesRes = await db
    .prepare(
      `SELECT id, title, start_time, end_time, notes
         FROM activities
        WHERE event_id = ?
        ORDER BY start_time, display_order, id`
    )
    .bind(event.id)
    .all<Pick<Activity, 'id' | 'title' | 'start_time' | 'end_time' | 'notes'>>();

  return { event, activities: activitiesRes.results ?? [] };
};

export const actions: Actions = {
  default: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const event = await db
      .prepare('SELECT id FROM events WHERE rsvp_token = ?')
      .bind(params.token)
      .first<{ id: number }>();
    if (!event) return fail(404, { error: 'RSVP link not found' });

    const form = await request.formData();

    // Honeypot: a hidden field real users never fill. Bots auto-fill all
    // inputs. If it has any value, silently pretend success — a clear
    // rejection would just teach the bot to retry.
    const honeypot = form.get('website')?.toString().trim();
    if (honeypot) {
      return { success: true, name: 'thanks', email: '', already: false, interests: [] };
    }

    const name = form.get('name')?.toString().trim() ?? '';
    const email = normalizeEmail(form.get('email')?.toString() ?? '');

    if (!name) return fail(400, { error: 'Name is required', values: { name, email } });
    if (!email || !isValidEmail(email)) {
      return fail(400, { error: 'Valid email is required', values: { name, email } });
    }

    const ip = request.headers.get('CF-Connecting-IP') ?? null;
    const ua = request.headers.get('User-Agent') ?? null;

    // 200 RSVPs/hr per IP, matching /g/[token]. Real attendees on shared
    // venue WiFi or carrier-NAT stay well under; a script from one IP
    // hits the wall.
    if (ip) {
      const rate = await db
        .prepare(
          `SELECT COUNT(*) AS count FROM rsvps
            WHERE ip_address = ? AND created_at >= datetime('now', '-1 hour')`
        )
        .bind(ip)
        .first<{ count: number }>();
      if ((rate?.count ?? 0) >= 200) {
        return fail(429, {
          error: 'Too many RSVPs from this network. Try again in an hour.',
          values: { name, email }
        });
      }
    }

    const interestIds = form
      .getAll('interest')
      .map((v) => parseInt(v.toString()))
      .filter((n) => Number.isInteger(n) && n > 0);

    let rsvpId: number;
    let already = false;
    try {
      const insert = await db
        .prepare(
          `INSERT INTO rsvps (event_id, name, email, ip_address, user_agent)
           VALUES (?, ?, ?, ?, ?)
           RETURNING id`
        )
        .bind(event.id, name, email, ip, ua)
        .first<{ id: number }>();
      rsvpId = insert?.id ?? 0;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('UNIQUE')) {
        const existing = await db
          .prepare('SELECT id FROM rsvps WHERE event_id = ? AND email = ?')
          .bind(event.id, email)
          .first<{ id: number }>();
        rsvpId = existing?.id ?? 0;
        already = true;
      } else {
        return fail(500, { error: 'Could not save RSVP. Try again.', values: { name, email } });
      }
    }

    if (rsvpId) {
      // Refresh interests: clear and re-insert. Cheap, idempotent.
      await db.prepare('DELETE FROM rsvp_activity_interests WHERE rsvp_id = ?').bind(rsvpId).run();
      for (const aid of interestIds) {
        await db
          .prepare(
            `INSERT OR IGNORE INTO rsvp_activity_interests (rsvp_id, activity_id) VALUES (?, ?)`
          )
          .bind(rsvpId, aid)
          .run();
      }
    }

    return { success: true, name, email, already, interests: interestIds };
  }
};
