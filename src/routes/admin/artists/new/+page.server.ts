import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { ActivationType } from '$lib/types/db-types';

export const load: PageServerLoad = async ({ platform }) => {
  const db = platform?.env?.DB;
  if (!db) return { activationTypes: [] as Pick<ActivationType, 'slug' | 'name'>[] };

  const result = await db
    .prepare('SELECT slug, name FROM activation_types ORDER BY name ASC')
    .all<Pick<ActivationType, 'slug' | 'name'>>();

  return { activationTypes: result.results ?? [] };
};

export const actions: Actions = {
  default: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const name = form.get('name')?.toString().trim();
    if (!name) return fail(400, { error: 'Name is required' });

    const email = form.get('email')?.toString().trim() || null;
    const phone = form.get('phone')?.toString().trim() || null;
    const city = form.get('city')?.toString().trim() || null;
    const bio = form.get('bio')?.toString().trim() || null;
    const portfolio_url = form.get('portfolio_url')?.toString().trim() || null;
    const instagram_handle = form.get('instagram_handle')?.toString().trim() || null;
    const internal_notes = form.get('internal_notes')?.toString().trim() || null;
    const specialties = form.getAll('specialties').map((v) => v.toString());
    const specialties_json = specialties.length ? JSON.stringify(specialties) : null;

    const result = await db
      .prepare(
        `INSERT INTO artists (name, email, phone, city, bio, portfolio_url, instagram_handle, specialties_json, internal_notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         RETURNING id`
      )
      .bind(name, email, phone, city, bio, portfolio_url, instagram_handle, specialties_json, internal_notes)
      .first<{ id: number }>();

    throw redirect(303, `/admin/artists/${result?.id ?? ''}`);
  }
};
