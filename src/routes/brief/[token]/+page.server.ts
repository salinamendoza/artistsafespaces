import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { parseBriefSchema, parseBriefData } from '$lib/server/brief-schema';
import type { Booking, Brief, Event, Artist, ActivationType } from '$lib/server/db-types';

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
  // brief
  br_id: number;
  br_title: string;
  br_brief_data_json: string;
  br_brief_body: string | null;
  br_terms_markdown: string | null;
  // event
  e_name: string;
  e_client_name: string | null;
  e_event_date: string | null;
  e_location: string | null;
  // artist
  a_name: string;
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
        br.id AS br_id, br.title AS br_title,
        br.brief_data_json AS br_brief_data_json, br.brief_body AS br_brief_body,
        br.terms_markdown AS br_terms_markdown,
        e.name AS e_name, e.client_name AS e_client_name,
        e.event_date AS e_event_date, e.location AS e_location,
        a.name AS a_name,
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

  return {
    booking: {
      id: row.b_id,
      rate: row.b_rate,
      materials_allowance: row.b_materials_allowance,
      status: row.b_status,
      accepted_at: row.b_accepted_at,
      declined_at: row.b_declined_at,
      declined_reason: row.b_declined_reason
    },
    brief: {
      title: row.br_title,
      body: row.br_brief_body,
      terms: row.br_terms_markdown
    },
    briefData: parseBriefData(row.br_brief_data_json),
    schema: parseBriefSchema(row.at_brief_schema_json),
    event: {
      name: row.e_name,
      client_name: row.e_client_name,
      event_date: row.e_event_date,
      location: row.e_location
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

    await db
      .prepare(
        `UPDATE bookings SET
          status = 'accepted',
          accepted_at = ?,
          accepted_ip = ?,
          accepted_terms_snapshot = ?
         WHERE id = ?`
      )
      .bind(nowStamp(), ip, booking.terms_markdown ?? '', booking.id)
      .run();

    return { accepted: true };
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
