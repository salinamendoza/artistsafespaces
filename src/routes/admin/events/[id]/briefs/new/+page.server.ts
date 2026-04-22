import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event, ActivationType } from '$lib/server/db-types';
import { parseBriefSchema } from '$lib/server/brief-schema';

export const load: PageServerLoad = async ({ platform, params, url }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const eventId = parseInt(params.id);
  const event = await db.prepare('SELECT * FROM events WHERE id = ?').bind(eventId).first<Event>();
  if (!event) throw error(404, 'Event not found');

  const activationTypes = await db
    .prepare('SELECT * FROM activation_types ORDER BY name ASC')
    .all<ActivationType>();

  const typeSlug = url.searchParams.get('type');
  const selectedType = typeSlug
    ? activationTypes.results?.find((t) => t.slug === typeSlug) ?? null
    : null;

  const schema = selectedType ? parseBriefSchema(selectedType.brief_schema_json) : [];

  return {
    event,
    activationTypes: activationTypes.results ?? [],
    selectedType,
    schema
  };
};

export const actions: Actions = {
  default: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const form = await request.formData();

    const activation_type_id = parseInt(form.get('activation_type_id')?.toString() ?? '');
    const title = form.get('title')?.toString().trim();
    if (!activation_type_id || !title) {
      return fail(400, { error: 'Activation type and title are required' });
    }

    const activationType = await db
      .prepare('SELECT * FROM activation_types WHERE id = ?')
      .bind(activation_type_id)
      .first<ActivationType>();
    if (!activationType) return fail(400, { error: 'Invalid activation type' });

    const schema = parseBriefSchema(activationType.brief_schema_json);
    const data: Record<string, string> = {};
    for (const field of schema) {
      const value = form.get(`field_${field.key}`)?.toString() ?? '';
      data[field.key] = value;
    }

    const brief_body = form.get('brief_body')?.toString() ?? activationType.brief_body_template ?? '';
    const terms_markdown = form.get('terms_markdown')?.toString() ?? activationType.terms_template ?? '';

    const result = await db
      .prepare(
        `INSERT INTO briefs (event_id, activation_type_id, title, brief_data_json, brief_body, terms_markdown, status)
         VALUES (?, ?, ?, ?, ?, ?, 'draft') RETURNING id`
      )
      .bind(eventId, activation_type_id, title, JSON.stringify(data), brief_body, terms_markdown)
      .first<{ id: number }>();

    throw redirect(303, `/admin/events/${eventId}/briefs/${result?.id ?? ''}`);
  }
};
