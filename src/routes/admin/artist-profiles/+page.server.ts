import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { ArtistProfile } from '$lib/types/artist-profile';
import { slugify } from '$lib/server/slug';

type ArtistProfileRow = ArtistProfile & { campaign_count: number };

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
  setHeaders({ 'cache-control': 'no-store' });

  const db = platform?.env?.DB;
  if (!db) return { artists: [] as ArtistProfileRow[] };

  const result = await db
    .prepare(
      `SELECT ap.*, (SELECT COUNT(*) FROM campaign_artists WHERE artist_profile_id = ap.id) AS campaign_count
         FROM artist_profiles ap
        ORDER BY ap.display_name ASC`
    )
    .all<ArtistProfileRow>();

  return { artists: result.results ?? [] };
};

export const actions: Actions = {
  create: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const display_name = form.get('display_name')?.toString().trim();
    if (!display_name) return fail(400, { error: 'Display name is required' });

    let slug = form.get('slug')?.toString().trim();
    if (!slug) slug = slugify(display_name);
    if (!slug) return fail(400, { error: 'Slug is required' });

    const bio = form.get('bio')?.toString().trim() || null;
    const instagram_handle = form.get('instagram_handle')?.toString().trim().replace(/^@+/, '') || null;
    const headshot_url = form.get('headshot_url')?.toString().trim() || null;
    const is_public = form.get('is_public') ? 1 : 0;

    try {
      await db
        .prepare(
          `INSERT INTO artist_profiles (slug, display_name, bio, instagram_handle, headshot_url, is_public)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(slug, display_name, bio, instagram_handle, headshot_url, is_public)
        .run();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/UNIQUE/i.test(msg)) return fail(400, { error: 'That slug is already taken.' });
      return fail(500, { error: 'Could not create profile.' });
    }
    return { success: true };
  },

  update: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const id = Number(form.get('id'));
    const display_name = form.get('display_name')?.toString().trim();
    const slug = form.get('slug')?.toString().trim();
    if (!id || !display_name || !slug) return fail(400, { error: 'Missing fields' });

    const bio = form.get('bio')?.toString().trim() || null;
    const instagram_handle = form.get('instagram_handle')?.toString().trim().replace(/^@+/, '') || null;
    const headshot_url = form.get('headshot_url')?.toString().trim() || null;
    const is_public = form.get('is_public') ? 1 : 0;

    try {
      await db
        .prepare(
          `UPDATE artist_profiles
              SET slug = ?, display_name = ?, bio = ?, instagram_handle = ?, headshot_url = ?, is_public = ?
            WHERE id = ?`
        )
        .bind(slug, display_name, bio, instagram_handle, headshot_url, is_public, id)
        .run();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/UNIQUE/i.test(msg)) return fail(400, { error: 'That slug is already taken.' });
      return fail(500, { error: 'Could not update profile.' });
    }
    return { success: true };
  }
};
