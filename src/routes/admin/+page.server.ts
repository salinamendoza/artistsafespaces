import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

interface ContactRow {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  archived: number;
  archive_note: string | null;
  contacted: number;
  contact_note: string | null;
}

export const load: PageServerLoad = async ({ platform, url }) => {
  const db = platform?.env?.DB;
  if (!db) {
    return { contacts: [], stats: { total: 0, contacted: 0, archived: 0 }, view: 'active' };
  }

  const view = url.searchParams.get('view') === 'archived' ? 'archived' : 'active';
  const archivedFlag = view === 'archived' ? 1 : 0;

  const [contacts, statsResult] = await Promise.all([
    db.prepare('SELECT * FROM contact_submissions WHERE archived = ? ORDER BY created_at DESC')
      .bind(archivedFlag)
      .all<ContactRow>(),
    db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN contacted = 1 THEN 1 ELSE 0 END) as contacted,
        SUM(CASE WHEN archived = 1 THEN 1 ELSE 0 END) as archived
      FROM contact_submissions
    `).first<{ total: number; contacted: number; archived: number }>()
  ]);

  return {
    contacts: contacts.results ?? [],
    stats: {
      total: statsResult?.total ?? 0,
      contacted: statsResult?.contacted ?? 0,
      archived: statsResult?.archived ?? 0
    },
    view
  };
};

export const actions: Actions = {
  markContacted: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const id = form.get('id')?.toString();
    const contactNote = form.get('contact_note')?.toString() ?? '';
    const contacted = form.get('contacted')?.toString() === '1' ? 0 : 1;

    if (!id) return fail(400, { error: 'Missing contact ID' });

    await db.prepare('UPDATE contact_submissions SET contacted = ?, contact_note = ? WHERE id = ?')
      .bind(contacted, contactNote || null, parseInt(id))
      .run();

    return { success: true };
  },

  archive: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const id = form.get('id')?.toString();
    const archiveNote = form.get('archive_note')?.toString() ?? '';

    if (!id) return fail(400, { error: 'Missing contact ID' });
    if (!archiveNote.trim()) return fail(400, { error: 'Archive note is required' });

    await db.prepare('UPDATE contact_submissions SET archived = 1, archive_note = ? WHERE id = ?')
      .bind(archiveNote.trim(), parseInt(id))
      .run();

    return { success: true };
  },

  unarchive: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });

    const form = await request.formData();
    const id = form.get('id')?.toString();

    if (!id) return fail(400, { error: 'Missing contact ID' });

    await db.prepare('UPDATE contact_submissions SET archived = 0, archive_note = NULL WHERE id = ?')
      .bind(parseInt(id))
      .run();

    return { success: true };
  },

  logout: async ({ cookies }) => {
    cookies.delete('admin_session', { path: '/' });
    throw redirect(303, '/admin/login');
  }
};
