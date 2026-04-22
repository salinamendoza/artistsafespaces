import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event, Brief, ActivationType, Artist, Booking } from '$lib/types/db-types';
import { generateShareToken } from '$lib/server/tokens';

interface BookingWithArtist extends Booking {
  artist_name: string;
  artist_email: string | null;
}

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const eventId = parseInt(params.id);
  const briefId = parseInt(params.briefId);

  const [event, brief] = await Promise.all([
    db.prepare('SELECT * FROM events WHERE id = ?').bind(eventId).first<Event>(),
    db.prepare('SELECT * FROM briefs WHERE id = ? AND event_id = ?').bind(briefId, eventId).first<Brief>()
  ]);

  if (!event) throw error(404, 'Event not found');
  if (!brief) throw error(404, 'Brief not found');

  const [activationType, bookings, artists] = await Promise.all([
    db.prepare('SELECT * FROM activation_types WHERE id = ?').bind(brief.activation_type_id).first<ActivationType>(),
    db
      .prepare(`
        SELECT b.*, a.name AS artist_name, a.email AS artist_email
        FROM bookings b
        JOIN artists a ON a.id = b.artist_id
        WHERE b.brief_id = ?
        ORDER BY b.created_at ASC
      `)
      .bind(briefId)
      .all<BookingWithArtist>(),
    db.prepare('SELECT id, name FROM artists ORDER BY name ASC').all<Pick<Artist, 'id' | 'name'>>()
  ]);

  return {
    event,
    brief,
    activationType,
    bookings: bookings.results ?? [],
    artists: artists.results ?? []
  };
};

export const actions: Actions = {
  addBooking: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const briefId = parseInt(params.briefId);
    const form = await request.formData();
    const artist_id = parseInt(form.get('artist_id')?.toString() ?? '');
    const rate = parseFloat(form.get('rate')?.toString() ?? '0');
    const materials_allowance = parseFloat(form.get('materials_allowance')?.toString() ?? '0');
    const internal_notes = form.get('internal_notes')?.toString().trim() || null;

    if (!artist_id || isNaN(rate) || rate < 0) {
      return fail(400, { error: 'Artist and rate are required' });
    }

    const share_token = generateShareToken();

    try {
      await db
        .prepare(
          `INSERT INTO bookings (brief_id, artist_id, share_token, rate, materials_allowance, internal_notes)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(briefId, artist_id, share_token, rate, materials_allowance, internal_notes)
        .run();
    } catch (e) {
      return fail(400, { error: 'Artist is already booked to this brief' });
    }
    return { success: true };
  },

  updateBookingStatus: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });
    const form = await request.formData();
    const id = parseInt(form.get('id')?.toString() ?? '');
    const status = form.get('status')?.toString();
    if (!id || !status) return fail(400, { error: 'Missing fields' });
    await db.prepare('UPDATE bookings SET status = ? WHERE id = ?').bind(status, id).run();
    return { success: true };
  },

  updateBookingPayment: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });
    const form = await request.formData();
    const id = parseInt(form.get('id')?.toString() ?? '');
    const invoice_status = form.get('invoice_status')?.toString() ?? 'not_submitted';
    const invoice_notes = form.get('invoice_notes')?.toString().trim() || null;
    const rate = parseFloat(form.get('rate')?.toString() ?? '0');
    const materials_allowance = parseFloat(form.get('materials_allowance')?.toString() ?? '0');

    const nowStamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const submittedAt = invoice_status === 'submitted' || invoice_status === 'paid' ? nowStamp : null;
    const paidAt = invoice_status === 'paid' ? nowStamp : null;

    await db
      .prepare(
        `UPDATE bookings SET
          rate = ?, materials_allowance = ?,
          invoice_status = ?,
          invoice_submitted_at = COALESCE(invoice_submitted_at, ?),
          invoice_paid_at = CASE WHEN ? = 'paid' THEN COALESCE(invoice_paid_at, ?) ELSE NULL END,
          invoice_notes = ?
         WHERE id = ?`
      )
      .bind(rate, materials_allowance, invoice_status, submittedAt, invoice_status, paidAt, invoice_notes, id)
      .run();
    return { success: true };
  },

  updateBookingNotes: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });
    const form = await request.formData();
    const id = parseInt(form.get('id')?.toString() ?? '');
    const internal_notes = form.get('internal_notes')?.toString().trim() || null;
    if (!id) return fail(400, { error: 'Missing booking id' });
    await db.prepare('UPDATE bookings SET internal_notes = ? WHERE id = ?').bind(internal_notes, id).run();
    return { success: true };
  },

  deleteBooking: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });
    const form = await request.formData();
    const id = parseInt(form.get('id')?.toString() ?? '');
    if (!id) return fail(400, { error: 'Missing booking id' });
    await db.prepare('DELETE FROM bookings WHERE id = ?').bind(id).run();
    return { success: true };
  },

  markBriefStatus: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });
    const briefId = parseInt(params.briefId);
    const form = await request.formData();
    const status = form.get('status')?.toString() ?? 'draft';
    await db.prepare('UPDATE briefs SET status = ?, updated_at = datetime(\'now\') WHERE id = ?').bind(status, briefId).run();
    return { success: true };
  },

  deleteBrief: async ({ platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });
    const eventId = parseInt(params.id);
    const briefId = parseInt(params.briefId);
    const bookingCount = await db.prepare('SELECT COUNT(*) AS n FROM bookings WHERE brief_id = ?').bind(briefId).first<{ n: number }>();
    if ((bookingCount?.n ?? 0) > 0) {
      return fail(400, { error: 'Cannot delete — brief has bookings.' });
    }
    await db.prepare('DELETE FROM briefs WHERE id = ?').bind(briefId).run();
    throw redirect(303, `/admin/events/${eventId}`);
  }
};
