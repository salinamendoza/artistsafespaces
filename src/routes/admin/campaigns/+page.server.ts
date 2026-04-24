import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Campaign } from '$lib/types/campaign';
import { slugify } from '$lib/server/slug';

type CampaignWithCounts = Campaign & { artist_count: number; entry_count: number };

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
  setHeaders({ 'cache-control': 'no-store' });

  const db = platform?.env?.DB;
  if (!db) return { campaigns: [] as CampaignWithCounts[] };

  const result = await db
    .prepare(
      `SELECT c.*,
              (SELECT COUNT(*) FROM campaign_artists WHERE campaign_id = c.id) AS artist_count,
              (SELECT COUNT(*) FROM giveaway_entries ge
                 JOIN giveaways g ON g.id = ge.giveaway_id
                 JOIN campaign_artists ca ON ca.id = g.campaign_artist_id
                WHERE ca.campaign_id = c.id AND ge.archived = 0) AS entry_count
         FROM campaigns c
        ORDER BY
          CASE WHEN c.event_date IS NULL THEN 1 ELSE 0 END,
          c.event_date DESC,
          c.created_at DESC`
    )
    .all<CampaignWithCounts>();

  return { campaigns: result.results ?? [] };
};

export const actions: Actions = {
  create: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const title = form.get('title')?.toString().trim();
    if (!title) return fail(400, { error: 'Title is required' });

    let slug = form.get('slug')?.toString().trim();
    if (!slug) slug = slugify(title);
    if (!slug) return fail(400, { error: 'Slug is required' });

    const description = form.get('description')?.toString().trim() || null;
    const event_date = form.get('event_date')?.toString().trim() || null;
    const location = form.get('location')?.toString().trim() || null;

    try {
      await db
        .prepare(
          `INSERT INTO campaigns (slug, title, description, event_date, location)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(slug, title, description, event_date, location)
        .run();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/UNIQUE/i.test(msg)) return fail(400, { error: 'That slug is already in use.' });
      return fail(500, { error: 'Could not create campaign.' });
    }
    return { success: true };
  }
};
