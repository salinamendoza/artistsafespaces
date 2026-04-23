import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { ActivityRow } from '$lib/types/activity';

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

interface ArtistAppRow {
  id: number;
  name: string;
  email: string;
  location: string;
  medium: string;
  bio: string;
  website: string | null;
  instagram: string | null;
  interests: string | null;
  created_at: string;
}

interface PartnerAppRow {
  id: number;
  organization_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  org_type: string;
  interests: string | null;
  message: string | null;
  created_at: string;
}

type ViewType = 'active' | 'archived' | 'artist-apps' | 'partner-apps';

export const load: PageServerLoad = async ({ platform, url, setHeaders }) => {
  // Never cache the admin dashboard — status changes need to be reflected on reload.
  setHeaders({ 'cache-control': 'no-store' });

  const db = platform?.env?.DB;
  if (!db) {
    return { contacts: [], artistApps: [], partnerApps: [], activity: [] as ActivityRow[], stats: { total: 0, contacted: 0, archived: 0, artistApplications: 0, partnerApplications: 0 }, view: 'active' as ViewType };
  }

  const rawView = url.searchParams.get('view') ?? 'active';
  const view: ViewType = ['active', 'archived', 'artist-apps', 'partner-apps'].includes(rawView)
    ? rawView as ViewType
    : 'active';

  const [statsResult, artistCount, partnerCount] = await Promise.all([
    db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN contacted = 1 THEN 1 ELSE 0 END) as contacted,
        SUM(CASE WHEN archived = 1 THEN 1 ELSE 0 END) as archived
      FROM contact_submissions
    `).first<{ total: number; contacted: number; archived: number }>(),
    db.prepare('SELECT COUNT(*) as count FROM artist_applications').first<{ count: number }>(),
    db.prepare('SELECT COUNT(*) as count FROM partner_applications').first<{ count: number }>()
  ]);

  // Activity feed — seven simple queries instead of one big UNION ALL.
  // D1's SDK was silently failing on the UNION form even though the SQL
  // worked in the D1 Console. Seven small parallel queries are also more
  // resilient: one bad table doesn't wipe out the whole feed, and each
  // failure logs independently.
  const fetchActivity = async <T extends Record<string, unknown>>(
    sql: string,
    label: string
  ): Promise<T[]> => {
    try {
      const r = await db.prepare(sql).all<T>();
      return r.results ?? [];
    } catch (err) {
      console.error(`activity query failed (${label}):`, err);
      return [];
    }
  };

  type Raw = {
    ts: string | null;
    actor: string | null;
    title: string | null;
    context: string | null;
    event_id: number | null;
    brief_id: number | null;
  };

  const [acceptedRows, declinedRows, invSubRows, invPaidRows, contactRows, artistAppRows, partnerAppRows] = await Promise.all([
    fetchActivity<Raw>(`
      SELECT b.accepted_at AS ts, a.name AS actor, br.title AS title, e.name AS context, e.id AS event_id, br.id AS brief_id
      FROM bookings b
      LEFT JOIN artists a ON a.id = b.artist_id
      LEFT JOIN briefs br ON br.id = b.brief_id
      LEFT JOIN events e ON e.id = br.event_id
      WHERE b.accepted_at IS NOT NULL
      ORDER BY b.accepted_at DESC LIMIT 20
    `, 'brief_accepted'),
    fetchActivity<Raw>(`
      SELECT b.declined_at AS ts, a.name AS actor, br.title AS title, e.name AS context, e.id AS event_id, br.id AS brief_id
      FROM bookings b
      LEFT JOIN artists a ON a.id = b.artist_id
      LEFT JOIN briefs br ON br.id = b.brief_id
      LEFT JOIN events e ON e.id = br.event_id
      WHERE b.declined_at IS NOT NULL
      ORDER BY b.declined_at DESC LIMIT 20
    `, 'brief_declined'),
    fetchActivity<Raw>(`
      SELECT b.invoice_submitted_at AS ts, a.name AS actor, br.title AS title, e.name AS context, e.id AS event_id, br.id AS brief_id
      FROM bookings b
      LEFT JOIN artists a ON a.id = b.artist_id
      LEFT JOIN briefs br ON br.id = b.brief_id
      LEFT JOIN events e ON e.id = br.event_id
      WHERE b.invoice_submitted_at IS NOT NULL
      ORDER BY b.invoice_submitted_at DESC LIMIT 20
    `, 'invoice_submitted'),
    fetchActivity<Raw>(`
      SELECT b.invoice_paid_at AS ts, a.name AS actor, br.title AS title, e.name AS context, e.id AS event_id, br.id AS brief_id
      FROM bookings b
      LEFT JOIN artists a ON a.id = b.artist_id
      LEFT JOIN briefs br ON br.id = b.brief_id
      LEFT JOIN events e ON e.id = br.event_id
      WHERE b.invoice_paid_at IS NOT NULL
      ORDER BY b.invoice_paid_at DESC LIMIT 20
    `, 'invoice_paid'),
    fetchActivity<Raw>(`
      SELECT created_at AS ts, name AS actor, NULL AS title, subject AS context, NULL AS event_id, NULL AS brief_id
      FROM contact_submissions ORDER BY created_at DESC LIMIT 20
    `, 'contact_submitted'),
    fetchActivity<Raw>(`
      SELECT created_at AS ts, name AS actor, NULL AS title, medium AS context, NULL AS event_id, NULL AS brief_id
      FROM artist_applications ORDER BY created_at DESC LIMIT 20
    `, 'artist_applied'),
    fetchActivity<Raw>(`
      SELECT created_at AS ts, contact_name AS actor, NULL AS title, organization_name AS context, NULL AS event_id, NULL AS brief_id
      FROM partner_applications ORDER BY created_at DESC LIMIT 20
    `, 'partner_applied')
  ]);

  const tag = (rows: Raw[], t: ActivityRow['type']): ActivityRow[] =>
    rows.filter((r) => r.ts).map((r) => ({ type: t, ts: r.ts as string, actor: r.actor, title: r.title, context: r.context, event_id: r.event_id, brief_id: r.brief_id }));

  const activity: ActivityRow[] = [
    ...tag(acceptedRows, 'brief_accepted'),
    ...tag(declinedRows, 'brief_declined'),
    ...tag(invSubRows, 'invoice_submitted'),
    ...tag(invPaidRows, 'invoice_paid'),
    ...tag(contactRows, 'contact_submitted'),
    ...tag(artistAppRows, 'artist_applied'),
    ...tag(partnerAppRows, 'partner_applied')
  ]
    .sort((a, b) => (b.ts > a.ts ? 1 : b.ts < a.ts ? -1 : 0))
    .slice(0, 50);

  let contacts: ContactRow[] = [];
  let artistApps: ArtistAppRow[] = [];
  let partnerApps: PartnerAppRow[] = [];

  if (view === 'artist-apps') {
    const result = await db.prepare('SELECT * FROM artist_applications ORDER BY created_at DESC').all<ArtistAppRow>();
    artistApps = result.results ?? [];
  } else if (view === 'partner-apps') {
    const result = await db.prepare('SELECT * FROM partner_applications ORDER BY created_at DESC').all<PartnerAppRow>();
    partnerApps = result.results ?? [];
  } else {
    const archivedFlag = view === 'archived' ? 1 : 0;
    const result = await db.prepare('SELECT * FROM contact_submissions WHERE archived = ? ORDER BY created_at DESC')
      .bind(archivedFlag)
      .all<ContactRow>();
    contacts = result.results ?? [];
  }

  return {
    contacts,
    artistApps,
    partnerApps,
    activity,
    stats: {
      total: statsResult?.total ?? 0,
      contacted: statsResult?.contacted ?? 0,
      archived: statsResult?.archived ?? 0,
      artistApplications: artistCount?.count ?? 0,
      partnerApplications: partnerCount?.count ?? 0
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
