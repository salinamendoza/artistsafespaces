import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event, Brief, ActivationType, Artist, Booking } from '$lib/types/db-types';
import type { Giveaway } from '$lib/types/giveaway';
import { generateShareToken } from '$lib/server/tokens';

interface BookingWithArtist extends Booking {
  artist_name: string;
  artist_email: string | null;
}

export interface BookingWithGiveaway extends BookingWithArtist {
  giveaway: Giveaway | null;
  giveaway_entry_count: number;
  giveaway_url: string | null;
}

// datetime-local → D1-style 'YYYY-MM-DD HH:MM:SS'
function normalizeDatetime(v: string | undefined): string | null {
  const s = (v ?? '').trim();
  if (!s) return null;
  const cleaned = s.replace('T', ' ');
  return cleaned.length === 16 ? `${cleaned}:00` : cleaned;
}

export const load: PageServerLoad = async ({ platform, params, url }) => {
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

  const [activationType, bookingsResult, artists] = await Promise.all([
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

  const rawBookings = bookingsResult.results ?? [];
  const bookingIds = rawBookings.map((b) => b.id);

  // Giveaways only exist on live-muralist bookings by policy, but the query
  // doesn't need that gate — giveaways are inserted/updated through this page.
  const giveawayMap = new Map<number, Giveaway>();
  const entryCountMap = new Map<number, number>();
  if (bookingIds.length > 0) {
    const placeholders = bookingIds.map(() => '?').join(',');
    const [gRes, eRes] = await Promise.all([
      db
        .prepare(`SELECT * FROM giveaways WHERE booking_id IN (${placeholders})`)
        .bind(...bookingIds)
        .all<Giveaway>(),
      db
        .prepare(
          `SELECT g.booking_id AS booking_id, COUNT(ge.id) AS n
             FROM giveaways g
             LEFT JOIN giveaway_entries ge ON ge.giveaway_id = g.id AND ge.archived = 0
            WHERE g.booking_id IN (${placeholders})
            GROUP BY g.booking_id`
        )
        .bind(...bookingIds)
        .all<{ booking_id: number; n: number }>()
    ]);
    for (const g of gRes.results ?? []) giveawayMap.set(g.booking_id, g);
    for (const row of eRes.results ?? []) entryCountMap.set(row.booking_id, row.n);
  }

  const bookings: BookingWithGiveaway[] = rawBookings.map((b) => {
    const g = giveawayMap.get(b.id) ?? null;
    const entry_count = entryCountMap.get(b.id) ?? 0;
    const giveaway_url = g ? `${url.origin}/g/${g.public_token}` : null;
    return {
      ...b,
      giveaway: g,
      giveaway_entry_count: entry_count,
      giveaway_url
    };
  });

  return {
    event,
    brief,
    activationType,
    bookings,
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
    const invoice_url = form.get('invoice_url')?.toString().trim() || null;
    const payment_link_url = form.get('payment_link_url')?.toString().trim() || null;
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
          invoice_notes = ?,
          invoice_url = ?,
          payment_link_url = ?
         WHERE id = ?`
      )
      .bind(rate, materials_allowance, invoice_status, submittedAt, invoice_status, paidAt, invoice_notes, invoice_url, payment_link_url, id)
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
  },

  createGiveaway: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const booking_id = parseInt(form.get('booking_id')?.toString() ?? '');
    const title = form.get('title')?.toString().trim() || 'Win a custom mural';
    const description = form.get('description')?.toString().trim() || null;
    const opens_at = normalizeDatetime(form.get('opens_at')?.toString());
    const closes_at = normalizeDatetime(form.get('closes_at')?.toString());
    if (!booking_id) return fail(400, { error: 'Missing booking' });

    const public_token = generateShareToken();

    try {
      await db
        .prepare(
          `INSERT INTO giveaways (booking_id, public_token, title, description, opens_at, closes_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(booking_id, public_token, title, description, opens_at, closes_at)
        .run();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/UNIQUE/i.test(msg)) return fail(400, { error: 'Giveaway already exists for this booking.' });
      return fail(500, { error: 'Could not create giveaway.' });
    }
    return { success: true };
  },

  updateGiveaway: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const id = parseInt(form.get('giveaway_id')?.toString() ?? '');
    const title = form.get('title')?.toString().trim();
    if (!id || !title) return fail(400, { error: 'Title is required' });

    const description = form.get('description')?.toString().trim() || null;
    const opens_at = normalizeDatetime(form.get('opens_at')?.toString());
    const closes_at = normalizeDatetime(form.get('closes_at')?.toString());
    const is_active = form.get('is_active') ? 1 : 0;

    await db
      .prepare(
        `UPDATE giveaways SET title = ?, description = ?, opens_at = ?, closes_at = ?, is_active = ?
          WHERE id = ?`
      )
      .bind(title, description, opens_at, closes_at, is_active, id)
      .run();
    return { success: true };
  },

  deleteGiveaway: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const id = parseInt(form.get('giveaway_id')?.toString() ?? '');
    if (!id) return fail(400, { error: 'Missing id' });

    await db.prepare('DELETE FROM giveaways WHERE id = ?').bind(id).run();
    return { success: true };
  }
};
