import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Campaign } from '$lib/types/campaign';
import type { ArtistProfile } from '$lib/types/artist-profile';

// datetime-local → D1-style 'YYYY-MM-DD HH:MM:SS' so string comparisons work
function normalizeDatetime(v: string | undefined): string | null {
  const s = (v ?? '').trim();
  if (!s) return null;
  const cleaned = s.replace('T', ' ');
  return cleaned.length === 16 ? `${cleaned}:00` : cleaned;
}

interface AttachedArtist {
  campaign_artist_id: number;
  artist_profile_id: number;
  slug: string;
  display_name: string;
  role: string | null;
  has_active_giveaway: number;
  entry_count: number;
}

export const load: PageServerLoad = async ({ params, platform, setHeaders }) => {
  setHeaders({ 'cache-control': 'no-store' });

  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const id = Number(params.id);
  const campaign = await db.prepare('SELECT * FROM campaigns WHERE id = ?').bind(id).first<Campaign>();
  if (!campaign) throw error(404, 'Not found');

  const attachedResult = await db
    .prepare(
      `SELECT ca.id AS campaign_artist_id, ca.role AS role,
              ap.id AS artist_profile_id, ap.slug AS slug, ap.display_name AS display_name,
              (SELECT COUNT(*) FROM giveaways g WHERE g.campaign_artist_id = ca.id AND g.is_active = 1) AS has_active_giveaway,
              (SELECT COUNT(*) FROM giveaway_entries ge
                 JOIN giveaways g ON g.id = ge.giveaway_id
                WHERE g.campaign_artist_id = ca.id AND ge.archived = 0) AS entry_count
         FROM campaign_artists ca
         JOIN artist_profiles ap ON ap.id = ca.artist_profile_id
        WHERE ca.campaign_id = ?
        ORDER BY ap.display_name ASC`
    )
    .bind(id)
    .all<AttachedArtist>();

  const availableResult = await db
    .prepare(
      `SELECT id, slug, display_name FROM artist_profiles
        WHERE id NOT IN (SELECT artist_profile_id FROM campaign_artists WHERE campaign_id = ?)
        ORDER BY display_name ASC`
    )
    .bind(id)
    .all<Pick<ArtistProfile, 'id' | 'slug' | 'display_name'>>();

  return {
    campaign,
    attached: attachedResult.results ?? [],
    available: availableResult.results ?? []
  };
};

export const actions: Actions = {
  update: async ({ params, request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const title = form.get('title')?.toString().trim();
    const slug = form.get('slug')?.toString().trim();
    if (!title || !slug) return fail(400, { error: 'Title and slug are required' });

    const description = form.get('description')?.toString().trim() || null;
    const event_date = form.get('event_date')?.toString().trim() || null;
    const location = form.get('location')?.toString().trim() || null;
    const is_active = form.get('is_active') ? 1 : 0;

    try {
      await db
        .prepare(
          `UPDATE campaigns SET title = ?, slug = ?, description = ?, event_date = ?, location = ?, is_active = ?
            WHERE id = ?`
        )
        .bind(title, slug, description, event_date, location, is_active, Number(params.id))
        .run();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/UNIQUE/i.test(msg)) return fail(400, { error: 'That slug is already in use.' });
      return fail(500, { error: 'Could not update campaign.' });
    }
    return { success: true };
  },

  attachArtist: async ({ params, request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const artistProfileId = Number(form.get('artist_profile_id'));
    const role = form.get('role')?.toString().trim() || null;
    if (!artistProfileId) return fail(400, { error: 'Pick an artist' });

    try {
      await db
        .prepare(
          `INSERT INTO campaign_artists (campaign_id, artist_profile_id, role) VALUES (?, ?, ?)`
        )
        .bind(Number(params.id), artistProfileId, role)
        .run();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/UNIQUE/i.test(msg)) return fail(400, { error: 'Already attached.' });
      return fail(500, { error: 'Could not attach artist.' });
    }
    return { success: true };
  },

  detachArtist: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const campaignArtistId = Number(form.get('campaign_artist_id'));
    if (!campaignArtistId) return fail(400, { error: 'Missing id' });

    await db.prepare('DELETE FROM campaign_artists WHERE id = ?').bind(campaignArtistId).run();
    return { success: true };
  },

  createGiveaway: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const campaignArtistId = Number(form.get('campaign_artist_id'));
    const title = form.get('title')?.toString().trim();
    if (!campaignArtistId || !title) return fail(400, { error: 'Giveaway title required' });

    const description = form.get('description')?.toString().trim() || null;
    const opens_at = normalizeDatetime(form.get('opens_at')?.toString());
    const closes_at = normalizeDatetime(form.get('closes_at')?.toString());

    await db
      .prepare(
        `INSERT INTO giveaways (campaign_artist_id, title, description, opens_at, closes_at)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(campaignArtistId, title, description, opens_at, closes_at)
      .run();

    return { success: true };
  },

  delete: async ({ params, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    await db.prepare('DELETE FROM campaigns WHERE id = ?').bind(Number(params.id)).run();
    throw redirect(303, '/admin/campaigns');
  }
};
