import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { ArtistProfile } from '$lib/types/artist-profile';
import type { Campaign } from '$lib/types/campaign';
import type { Giveaway } from '$lib/types/giveaway';
import { validateEntry } from '$lib/server/giveaway-validation';

export interface CampaignAppearance {
  campaign: Campaign;
  role: string | null;
  campaign_artist_id: number;
  giveaway: Giveaway | null;
}

export const load: PageServerLoad = async ({ params, platform, setHeaders }) => {
  setHeaders({ 'cache-control': 'no-store' });

  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const artist = await db
    .prepare('SELECT * FROM artist_profiles WHERE slug = ? AND is_public = 1')
    .bind(params.slug)
    .first<ArtistProfile>();

  if (!artist) throw error(404, 'Not found');

  const appearancesResult = await db
    .prepare(
      `SELECT ca.id AS campaign_artist_id, ca.role AS role,
              c.id AS c_id, c.slug AS c_slug, c.title AS c_title, c.description AS c_description,
              c.event_date AS c_event_date, c.location AS c_location, c.is_active AS c_is_active,
              c.created_at AS c_created_at
         FROM campaign_artists ca
         JOIN campaigns c ON c.id = ca.campaign_id
        WHERE ca.artist_profile_id = ? AND c.is_active = 1
        ORDER BY c.event_date DESC, c.created_at DESC`
    )
    .bind(artist.id)
    .all<{
      campaign_artist_id: number;
      role: string | null;
      c_id: number;
      c_slug: string;
      c_title: string;
      c_description: string | null;
      c_event_date: string | null;
      c_location: string | null;
      c_is_active: number;
      c_created_at: string;
    }>();

  const appearances: CampaignAppearance[] = [];
  for (const row of appearancesResult.results ?? []) {
    const giveaway = await db
      .prepare(
        `SELECT * FROM giveaways
          WHERE campaign_artist_id = ? AND is_active = 1
          ORDER BY created_at DESC LIMIT 1`
      )
      .bind(row.campaign_artist_id)
      .first<Giveaway>();

    appearances.push({
      campaign_artist_id: row.campaign_artist_id,
      role: row.role,
      campaign: {
        id: row.c_id,
        slug: row.c_slug,
        title: row.c_title,
        description: row.c_description,
        event_date: row.c_event_date,
        location: row.c_location,
        is_active: row.c_is_active,
        created_at: row.c_created_at
      },
      giveaway: giveaway ?? null
    });
  }

  return { artist, appearances };
};

function withinWindow(g: Giveaway, nowIso: string): boolean {
  if (g.opens_at && nowIso < g.opens_at) return false;
  if (g.closes_at && nowIso > g.closes_at) return false;
  return true;
}

export const actions: Actions = {
  enter: async ({ params, request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const giveawayId = Number(form.get('giveaway_id'));
    if (!giveawayId) return fail(400, { error: 'Missing giveaway.' });

    const artist = await db
      .prepare('SELECT id FROM artist_profiles WHERE slug = ? AND is_public = 1')
      .bind(params.slug)
      .first<{ id: number }>();
    if (!artist) return fail(404, { error: 'Profile not found.' });

    const giveaway = await db
      .prepare(
        `SELECT g.*
           FROM giveaways g
           JOIN campaign_artists ca ON ca.id = g.campaign_artist_id
           JOIN campaigns c ON c.id = ca.campaign_id
          WHERE g.id = ?
            AND g.is_active = 1
            AND c.is_active = 1
            AND ca.artist_profile_id = ?`
      )
      .bind(giveawayId, artist.id)
      .first<Giveaway>();
    if (!giveaway) return fail(400, { error: 'This giveaway isn’t open right now.' });

    const nowIso = new Date().toISOString().slice(0, 19).replace('T', ' ');
    if (!withinWindow(giveaway, nowIso)) {
      return fail(400, { error: 'This giveaway isn’t open right now.' });
    }

    const result = validateEntry({
      name: form.get('name')?.toString(),
      email: form.get('email')?.toString(),
      phone: form.get('phone')?.toString(),
      instagram_handle: form.get('instagram_handle')?.toString()
    });
    if (!result.ok) {
      return fail(400, { field: result.field, error: result.error });
    }

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
      if (/UNIQUE/i.test(msg)) {
        return fail(409, { error: 'Looks like you already entered this one.' });
      }
      console.error('giveaway entry insert failed');
      return fail(500, { error: 'Something went wrong. Try again.' });
    }

    return { success: true };
  }
};
