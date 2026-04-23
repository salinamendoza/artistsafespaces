import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { parseBriefSchema, parseBriefData } from '$lib/types/brief-schema';
import type { Booking, Brief, Event, Artist, ActivationType } from '$lib/types/db-types';
import { AS_CORE_TERMS } from '$lib/briefs/coreTerms';

function composeTerms(briefTerms: string | null): string {
  if (!briefTerms || !briefTerms.trim()) return AS_CORE_TERMS;
  return `${AS_CORE_TERMS}\n\n---\n\n## Brief-specific terms\n\n${briefTerms.trim()}`;
}

interface LoadedRow {
  // booking
  b_id: number;
  b_share_token: string;
  b_rate: number;
  b_materials_allowance: number | null;
  b_status: string;
  b_accepted_at: string | null;
  b_declined_at: string | null;
  b_declined_reason: string | null;
  b_invoice_status: 'not_submitted' | 'submitted' | 'paid';
  b_invoice_submitted_at: string | null;
  b_invoice_paid_at: string | null;
  b_invoice_notes: string | null;
  b_invoice_url: string | null;
  b_payment_link_url: string | null;
  // brief
  br_id: number;
  br_title: string;
  br_brief_data_json: string;
  br_brief_body: string | null;
  br_terms_markdown: string | null;
  br_visual_sheet_slug: string | null;
  // event
  e_id: number;
  e_name: string;
  e_client_name: string | null;
  e_event_date: string | null;
  e_location: string | null;
  // artist
  a_name: string;
  a_email: string | null;
  // activation type
  at_name: string;
  at_brief_schema_json: string;
}

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const row = await db
    .prepare(`
      SELECT
        b.id AS b_id, b.share_token AS b_share_token, b.rate AS b_rate,
        b.materials_allowance AS b_materials_allowance, b.status AS b_status,
        b.accepted_at AS b_accepted_at, b.declined_at AS b_declined_at,
        b.declined_reason AS b_declined_reason,
        b.invoice_status AS b_invoice_status,
        b.invoice_submitted_at AS b_invoice_submitted_at,
        b.invoice_paid_at AS b_invoice_paid_at,
        b.invoice_notes AS b_invoice_notes,
        b.invoice_url AS b_invoice_url,
        b.payment_link_url AS b_payment_link_url,
        br.id AS br_id, br.title AS br_title,
        br.brief_data_json AS br_brief_data_json, br.brief_body AS br_brief_body,
        br.terms_markdown AS br_terms_markdown,
        br.visual_sheet_slug AS br_visual_sheet_slug,
        e.id AS e_id, e.name AS e_name, e.client_name AS e_client_name,
        e.event_date AS e_event_date, e.location AS e_location,
        a.name AS a_name, a.email AS a_email,
        at.name AS at_name, at.brief_schema_json AS at_brief_schema_json
      FROM bookings b
      JOIN briefs br ON br.id = b.brief_id
      JOIN events e ON e.id = br.event_id
      JOIN artists a ON a.id = b.artist_id
      JOIN activation_types at ON at.id = br.activation_type_id
      WHERE b.share_token = ?
    `)
    .bind(params.token)
    .first<LoadedRow>();

  if (!row) throw error(404, 'Brief not found');

  // Pull billing fields in a separate query so the page still loads if
  // migration 0008 hasn't been applied to this D1 yet.
  let billing_to: string | null = null;
  let invoice_email: string | null = null;
  try {
    const billing = await db
      .prepare('SELECT billing_to, invoice_email FROM events WHERE id = ?')
      .bind(row.e_id)
      .first<{ billing_to: string | null; invoice_email: string | null }>();
    if (billing) {
      billing_to = billing.billing_to;
      invoice_email = billing.invoice_email;
    }
  } catch {
    // columns don't exist — caller hasn't run migration 0008 yet; fall back to nulls
  }

  return {
    booking: {
      id: row.b_id,
      rate: row.b_rate,
      materials_allowance: row.b_materials_allowance,
      status: row.b_status,
      accepted_at: row.b_accepted_at,
      declined_at: row.b_declined_at,
      declined_reason: row.b_declined_reason,
      invoice_status: row.b_invoice_status ?? 'not_submitted',
      invoice_submitted_at: row.b_invoice_submitted_at,
      invoice_paid_at: row.b_invoice_paid_at,
      invoice_notes: row.b_invoice_notes,
      invoice_url: row.b_invoice_url,
      payment_link_url: row.b_payment_link_url
    },
    brief: {
      title: row.br_title,
      body: row.br_brief_body,
      terms: composeTerms(row.br_terms_markdown),
      visualSheetSlug: row.br_visual_sheet_slug
    },
    briefData: parseBriefData(row.br_brief_data_json),
    schema: parseBriefSchema(row.at_brief_schema_json),
    event: {
      name: row.e_name,
      client_name: row.e_client_name,
      event_date: row.e_event_date,
      location: row.e_location,
      billing_to,
      invoice_email
    },
    artist: {
      name: row.a_name,
      email: row.a_email
    },
    artistName: row.a_name,
    activationTypeName: row.at_name
  };
};

function nowStamp(): string {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

export const actions: Actions = {
  accept: async ({ request, platform, params, getClientAddress }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    if (form.get('terms_accepted') !== 'on') {
      return fail(400, { error: 'You must accept the terms to continue.' });
    }

    const booking = await db
      .prepare(`
        SELECT b.id, b.status, br.terms_markdown
        FROM bookings b
        JOIN briefs br ON br.id = b.brief_id
        WHERE b.share_token = ?
      `)
      .bind(params.token)
      .first<{ id: number; status: string; terms_markdown: string | null }>();

    if (!booking) return fail(404, { error: 'Brief not found' });
    if (booking.status !== 'invited') {
      return fail(400, { error: 'This brief has already been responded to.' });
    }

    let ip: string | null = null;
    try {
      ip = getClientAddress();
    } catch {}

    const snapshot = composeTerms(booking.terms_markdown);

    await db
      .prepare(
        `UPDATE bookings SET
          status = 'accepted',
          accepted_at = ?,
          accepted_ip = ?,
          accepted_terms_snapshot = ?
         WHERE id = ?`
      )
      .bind(nowStamp(), ip, snapshot, booking.id)
      .run();

    return { accepted: true };
  },

  submitInvoice: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const invoice_url = form.get('invoice_url')?.toString().trim() || null;
    const payment_link_url = form.get('payment_link_url')?.toString().trim() || null;
    const invoice_notes = form.get('invoice_notes')?.toString().trim() || null;

    if (!invoice_url && !payment_link_url && !invoice_notes) {
      return fail(400, { error: 'Add at least an invoice link, a payment link, or a note.' });
    }

    const booking = await db
      .prepare('SELECT id, status, invoice_submitted_at FROM bookings WHERE share_token = ?')
      .bind(params.token)
      .first<{ id: number; status: string; invoice_submitted_at: string | null }>();

    if (!booking) return fail(404, { error: 'Brief not found' });
    if (booking.status !== 'accepted') {
      return fail(400, { error: 'Please accept the brief first.' });
    }

    const submittedAt = booking.invoice_submitted_at ?? nowStamp();

    await db
      .prepare(
        `UPDATE bookings SET
          invoice_url = ?,
          payment_link_url = ?,
          invoice_notes = ?,
          invoice_status = CASE WHEN invoice_status = 'paid' THEN 'paid' ELSE 'submitted' END,
          invoice_submitted_at = ?
         WHERE id = ?`
      )
      .bind(invoice_url, payment_link_url, invoice_notes, submittedAt, booking.id)
      .run();

    return { invoiceSubmitted: true };
  },

  decline: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const reason = form.get('declined_reason')?.toString().trim() || null;

    const booking = await db
      .prepare('SELECT id, status FROM bookings WHERE share_token = ?')
      .bind(params.token)
      .first<{ id: number; status: string }>();

    if (!booking) return fail(404, { error: 'Brief not found' });
    if (booking.status !== 'invited') {
      return fail(400, { error: 'This brief has already been responded to.' });
    }

    await db
      .prepare(`UPDATE bookings SET status = 'declined', declined_at = ?, declined_reason = ? WHERE id = ?`)
      .bind(nowStamp(), reason, booking.id)
      .run();

    return { declined: true };
  }
};
