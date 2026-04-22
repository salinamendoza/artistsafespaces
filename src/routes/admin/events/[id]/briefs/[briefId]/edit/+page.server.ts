import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Event, Brief, ActivationType } from '$lib/server/db-types';
import { parseBriefSchema, parseBriefData } from '$lib/server/brief-schema';

export const load: PageServerLoad = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) throw error(500, 'Database unavailable');

  const eventId = parseInt(params.id);
  const briefId = parseInt(params.briefId);

  const [event, brief] = await Promise.all([
    db.prepare('SELECT * FROM events WHERE id = ?').bind(eventId).first<Event>(),
    db.prepare('SELECT * FROM briefs WHERE id = ? AND event_id = ?').bind(briefId, eventId).first<Brief>()
  ]);

  if (!event) throw error(404, 'Event not found');
  if (!brief) throw error(404, 'Brief not found');

  const activationType = await db
    .prepare('SELECT * FROM activation_types WHERE id = ?')
    .bind(brief.activation_type_id)
    .first<ActivationType>();

  const schema = activationType ? parseBriefSchema(activationType.brief_schema_json) : [];
  const briefData = parseBriefData(brief.brief_data_json);

  return { event, brief, activationType, schema, briefData };
};

export const actions: Actions = {
  default: async ({ request, platform, params }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const eventId = parseInt(params.id);
    const briefId = parseInt(params.briefId);

    const brief = await db.prepare('SELECT * FROM briefs WHERE id = ?').bind(briefId).first<Brief>();
    if (!brief) return fail(404, { error: 'Brief not found' });

    const activationType = await db
      .prepare('SELECT * FROM activation_types WHERE id = ?')
      .bind(brief.activation_type_id)
      .first<ActivationType>();
    if (!activationType) return fail(500, { error: 'Activation type missing' });

    const schema = parseBriefSchema(activationType.brief_schema_json);
    const form = await request.formData();

    const title = form.get('title')?.toString().trim();
    if (!title) return fail(400, { error: 'Title is required' });

    const data: Record<string, string> = {};
    for (const field of schema) {
      const value = form.get(`field_${field.key}`)?.toString() ?? '';
      data[field.key] = value;
    }

    const brief_body = form.get('brief_body')?.toString() ?? '';
    const terms_markdown = form.get('terms_markdown')?.toString() ?? '';

    await db
      .prepare(
        `UPDATE briefs SET
          title = ?, brief_data_json = ?, brief_body = ?, terms_markdown = ?,
          updated_at = datetime('now')
         WHERE id = ?`
      )
      .bind(title, JSON.stringify(data), brief_body, terms_markdown, briefId)
      .run();

    throw redirect(303, `/admin/events/${eventId}/briefs/${briefId}`);
  }
};
