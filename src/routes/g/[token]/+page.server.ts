import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Giveaway } from '$lib/types/giveaway';
import { validateEntry } from '$lib/server/giveaway-validation';
import { parseBriefData } from '$lib/types/brief-schema';

export interface GiveawayView {
  giveaway: Giveaway;
  artist_name: string;
  artist_bio: string | null;
  artist_instagram: string | null;
  artist_headshot_url: string | null;
  event_name: string;
  event_date: string | null;
  event_location: string | null;
  activation_type_name: string;
  theme: string | null;
}

export const load: PageServerLoad = async ({ params, platform, setHeaders }) => {
  setHeaders({ 'cache-control': 'no-store' });

  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const row = await db
    .prepare(
      `SELECT g.id, g.booking_id, g.public_token, g.title, g.description,
              g.opens_at, g.closes_at, g.is_active, g.created_at,
              a.name AS artist_name, a.bio AS artist_bio, a.instagram_handle AS artist_instagram,
              a.headshot_url AS artist_headshot_url,
              e.name AS event_name, e.event_date AS event_date, e.location AS event_location,
              at.name AS activation_type_name,
              br.brief_data_json AS brief_data_json
         FROM giveaways g
         JOIN bookings b ON b.id = g.booking_id
         JOIN artists a ON a.id = b.artist_id
         JOIN briefs br ON br.id = b.brief_id
         JOIN events e ON e.id = br.event_id
         JOIN activation_types at ON at.id = br.activation_type_id
        WHERE g.public_token = ? AND g.is_active = 1`
    )
    .bind(params.token)
    .first<{
      id: number;
      booking_id: number;
      public_token: string;
      title: string;
      description: string | null;
      opens_at: string | null;
      closes_at: string | null;
      is_active: number;
      created_at: string;
      artist_name: string;
      artist_bio: string | null;
      artist_instagram: string | null;
      artist_headshot_url: string | null;
      event_name: string;
      event_date: string | null;
      event_location: string | null;
      activation_type_name: string;
      brief_data_json: string;
    }>();

  if (!row) throw error(404, 'Not found');

  const briefData = parseBriefData(row.brief_data_json);
  const themeRaw = briefData.theme?.trim();

  const view: GiveawayView = {
    giveaway: {
      id: row.id,
      booking_id: row.booking_id,
      public_token: row.public_token,
      title: row.title,
      description: row.description,
      opens_at: row.opens_at,
      closes_at: row.closes_at,
      is_active: row.is_active,
      created_at: row.created_at
    },
    artist_name: row.artist_name,
    artist_bio: row.artist_bio,
    artist_instagram: row.artist_instagram,
    artist_headshot_url: row.artist_headshot_url,
    event_name: row.event_name,
    event_date: row.event_date,
    event_location: row.event_location,
    activation_type_name: row.activation_type_name,
    theme: themeRaw ? themeRaw : null
  };

  return { view };
};

export const actions: Actions = {
  enter: async ({ params, request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const giveaway = await db
      .prepare('SELECT * FROM giveaways WHERE public_token = ? AND is_active = 1')
      .bind(params.token)
      .first<Giveaway>();
    if (!giveaway) return fail(404, { error: 'This giveaway isn’t open.' });

    const form = await request.formData();
    const result = validateEntry({
      name: form.get('name')?.toString(),
      email: form.get('email')?.toString(),
      phone: form.get('phone')?.toString(),
      instagram_handle: form.get('instagram_handle')?.toString()
    });
    if (!result.ok) return fail(400, { field: result.field, error: result.error });

    const ip = request.headers.get('CF-Connecting-IP') ?? null;
    const ua = request.headers.get('User-Agent') ?? null;

    if (ip) {
      const rate = await db
        .prepare(
          `SELECT COUNT(*) AS count FROM giveaway_entries
            WHERE ip_address = ? AND created_at >= datetime('now', '-1 hour')`
        )
        .bind(ip)
        .first<{ count: number }>();
      if ((rate?.count ?? 0) >= 5) {
        return fail(429, { error: 'Too many entries from this network. Try again in an hour.' });
      }
    }

    try {
      await db
        .prepare(
          `INSERT INTO giveaway_entries
             (giveaway_id, name, email, phone, instagram_handle, ip_address, user_agent)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          giveaway.id,
          result.value.name,
          result.value.email,
          result.value.phone,
          result.value.instagram_handle,
          ip,
          ua
        )
        .run();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/UNIQUE/i.test(msg)) return fail(409, { error: 'Looks like you already entered this one.' });
      console.error('giveaway entry insert failed');
      return fail(500, { error: 'Something went wrong. Try again.' });
    }

    return { success: true };
  }
};
