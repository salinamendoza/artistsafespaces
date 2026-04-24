import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export interface EntryRow {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  instagram_handle: string | null;
  is_winner: number;
  contacted_at: string | null;
  contacted_note: string | null;
  archived: number;
  archived_note: string | null;
  giveaway_id: number;
  giveaway_title: string;
  campaign_id: number;
  campaign_title: string;
  artist_profile_id: number;
  artist_display_name: string;
}

export const load: PageServerLoad = async ({ platform, url, setHeaders }) => {
  setHeaders({ 'cache-control': 'no-store' });

  const db = platform?.env?.DB;
  if (!db) {
    return {
      entries: [] as EntryRow[],
      campaigns: [] as { id: number; title: string }[],
      artists: [] as { id: number; display_name: string }[],
      filter: { campaignId: null, artistId: null, view: 'active' as 'active' | 'archived' }
    };
  }

  const campaignIdParam = url.searchParams.get('campaign');
  const artistIdParam = url.searchParams.get('artist');
  const viewParam = url.searchParams.get('view') === 'archived' ? 'archived' : 'active';

  const campaignId = campaignIdParam ? Number(campaignIdParam) : null;
  const artistId = artistIdParam ? Number(artistIdParam) : null;

  // Cascading artist filter: only show artists attached to the chosen campaign
  const campaignsResult = await db
    .prepare('SELECT id, title FROM campaigns ORDER BY created_at DESC')
    .all<{ id: number; title: string }>();

  const artistsResult = campaignId
    ? await db
        .prepare(
          `SELECT ap.id, ap.display_name
             FROM artist_profiles ap
             JOIN campaign_artists ca ON ca.artist_profile_id = ap.id
            WHERE ca.campaign_id = ?
            ORDER BY ap.display_name ASC`
        )
        .bind(campaignId)
        .all<{ id: number; display_name: string }>()
    : await db
        .prepare('SELECT id, display_name FROM artist_profiles ORDER BY display_name ASC')
        .all<{ id: number; display_name: string }>();

  const where: string[] = ['ge.archived = ?'];
  const binds: (number | string)[] = [viewParam === 'archived' ? 1 : 0];
  if (campaignId) {
    where.push('c.id = ?');
    binds.push(campaignId);
  }
  if (artistId) {
    where.push('ap.id = ?');
    binds.push(artistId);
  }

  const entriesResult = await db
    .prepare(
      `SELECT ge.id, ge.created_at, ge.name, ge.email, ge.phone, ge.instagram_handle,
              ge.is_winner, ge.contacted_at, ge.contacted_note, ge.archived, ge.archived_note,
              g.id AS giveaway_id, g.title AS giveaway_title,
              c.id AS campaign_id, c.title AS campaign_title,
              ap.id AS artist_profile_id, ap.display_name AS artist_display_name
         FROM giveaway_entries ge
         JOIN giveaways g ON g.id = ge.giveaway_id
         JOIN campaign_artists ca ON ca.id = g.campaign_artist_id
         JOIN campaigns c ON c.id = ca.campaign_id
         JOIN artist_profiles ap ON ap.id = ca.artist_profile_id
        WHERE ${where.join(' AND ')}
        ORDER BY ge.created_at DESC`
    )
    .bind(...binds)
    .all<EntryRow>();

  return {
    entries: entriesResult.results ?? [],
    campaigns: campaignsResult.results ?? [],
    artists: artistsResult.results ?? [],
    filter: { campaignId, artistId, view: viewParam }
  };
};

export const actions: Actions = {
  markContacted: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const id = Number(form.get('id'));
    const note = form.get('contacted_note')?.toString().trim() || null;
    if (!id) return fail(400, { error: 'Missing id' });
    if (!note) return fail(400, { error: 'Note is required' });

    await db
      .prepare(
        `UPDATE giveaway_entries SET contacted_at = datetime('now'), contacted_note = ? WHERE id = ?`
      )
      .bind(note, id)
      .run();
    return { success: true };
  },

  undoContacted: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const id = Number(form.get('id'));
    if (!id) return fail(400, { error: 'Missing id' });

    await db
      .prepare('UPDATE giveaway_entries SET contacted_at = NULL, contacted_note = NULL WHERE id = ?')
      .bind(id)
      .run();
    return { success: true };
  },

  toggleWinner: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const id = Number(form.get('id'));
    if (!id) return fail(400, { error: 'Missing id' });

    await db
      .prepare('UPDATE giveaway_entries SET is_winner = 1 - is_winner WHERE id = ?')
      .bind(id)
      .run();
    return { success: true };
  },

  archive: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const id = Number(form.get('id'));
    const note = form.get('archived_note')?.toString().trim();
    if (!id) return fail(400, { error: 'Missing id' });
    if (!note) return fail(400, { error: 'Archive note is required' });

    await db
      .prepare('UPDATE giveaway_entries SET archived = 1, archived_note = ? WHERE id = ?')
      .bind(note, id)
      .run();
    return { success: true };
  },

  unarchive: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const id = Number(form.get('id'));
    if (!id) return fail(400, { error: 'Missing id' });

    await db
      .prepare('UPDATE giveaway_entries SET archived = 0, archived_note = NULL WHERE id = ?')
      .bind(id)
      .run();
    return { success: true };
  }
};
