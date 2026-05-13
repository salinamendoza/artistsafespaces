import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event, EventPartner, Rsvp } from '$lib/types/db-types';

interface BriefRow {
  id: number;
  title: string;
  status: string;
  activation_type_name: string;
  booking_count: number;
  created_at: string;
}

interface BookingSummaryRow {
  artist_name: string;
  rate: number;
  materials_allowance: number | null;
  brief_title: string;
  activation_type_name: string;
}

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const id = parseInt(params.id);
  const event = await db.prepare('SELECT * FROM events WHERE id = ?').bind(id).first<Event>();
  if (!event) throw error(404, 'Event not found');

  const [briefs, bookingSummary, partnersResult, rsvpsResult] = await Promise.all([
    db
      .prepare(`
        SELECT br.id, br.title, br.status, br.created_at,
               at.name AS activation_type_name,
               (SELECT COUNT(*) FROM bookings WHERE brief_id = br.id) AS booking_count
        FROM briefs br
        JOIN activation_types at ON at.id = br.activation_type_id
        WHERE br.event_id = ?
        ORDER BY br.created_at DESC
      `)
      .bind(id)
      .all<BriefRow>(),
    db
      .prepare(`
        SELECT a.name AS artist_name, bk.rate, bk.materials_allowance,
               br.title AS brief_title, at.name AS activation_type_name
        FROM bookings bk
        JOIN briefs br ON br.id = bk.brief_id
        JOIN artists a ON a.id = bk.artist_id
        JOIN activation_types at ON at.id = br.activation_type_id
        WHERE br.event_id = ?
        ORDER BY at.name, a.name
      `)
      .bind(id)
      .all<BookingSummaryRow>(),
    db
      .prepare(`SELECT * FROM event_partners WHERE event_id = ? ORDER BY created_at ASC`)
      .bind(id)
      .all<EventPartner>(),
    db
      .prepare(`SELECT * FROM rsvps WHERE event_id = ? ORDER BY created_at DESC`)
      .bind(id)
      .all<Rsvp>()
  ]);

  const bookings = bookingSummary.results ?? [];
  const uniqueArtists = new Set(bookings.map((b) => b.artist_name)).size;
  const totalRate = bookings.reduce((sum, b) => sum + (b.rate ?? 0), 0);
  const totalMaterials = bookings.reduce((sum, b) => sum + (b.materials_allowance ?? 0), 0);

  const partners = partnersResult.results ?? [];
  const partnerSpendByUs = partners.reduce((s, p) => s + (p.paid_by === 'us' ? p.amount ?? 0 : 0), 0);
  const partnerSpendByClient = partners.reduce((s, p) => s + (p.paid_by === 'client' ? p.amount ?? 0 : 0), 0);

  return {
    event,
    briefs: briefs.results ?? [],
    partners,
    eventStats: {
      artistCount: uniqueArtists,
      totalRate,
      totalMaterials,
      totalCost: totalRate + totalMaterials,
      breakdown: bookings
    },
    partnerStats: {
      count: partners.length,
      totalSpend: partnerSpendByUs + partnerSpendByClient,
      spendByUs: partnerSpendByUs,
      spendByClient: partnerSpendByClient
    },
    rsvps: rsvpsResult.results ?? []
  };
};

export const actions: Actions = {
  delete: async ({ platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const id = parseInt(params.id);
    const briefCount = await db
      .prepare('SELECT COUNT(*) AS n FROM briefs WHERE event_id = ?')
      .bind(id)
      .first<{ n: number }>();

    if ((briefCount?.n ?? 0) > 0) {
      return fail(400, { error: 'Cannot delete — event has briefs. Delete them first.' });
    }

    await db.prepare('DELETE FROM events WHERE id = ?').bind(id).run();
    throw redirect(303, '/admin/events');
  },
  clearRsvps: async ({ platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const id = parseInt(params.id);
    await db.prepare('DELETE FROM rsvps WHERE event_id = ?').bind(id).run();
    throw redirect(303, `/admin/events/${id}`);
  },
  deletePartner: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const id = parseInt(params.id);
    const form = await request.formData();
    const partnerId = parseInt(form.get('partnerId')?.toString() ?? '');
    if (!partnerId) return fail(400, { error: 'Missing partner id' });

    await db
      .prepare('DELETE FROM event_partners WHERE id = ? AND event_id = ?')
      .bind(partnerId, id)
      .run();

    throw redirect(303, `/admin/events/${id}`);
  }
};
