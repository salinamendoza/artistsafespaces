import type { ActivityRow } from '$lib/types/activity';

type Raw = {
  ts: string | null;
  actor: string | null;
  title: string | null;
  context: string | null;
  event_id: number | null;
  brief_id: number | null;
};

/**
 * Load the admin activity feed. Seven small queries in parallel rather than
 * one UNION ALL — the union form was silently failing through the SvelteKit
 * server function even though the same SQL worked in the D1 Console.
 */
export async function loadActivity(db: D1Database, limit: number): Promise<ActivityRow[]> {
  const per = Math.max(limit, 20);

  const run = async (sql: string, label: string): Promise<Raw[]> => {
    try {
      const r = await db.prepare(sql).all<Raw>();
      return r.results ?? [];
    } catch (err) {
      console.error(`activity query failed (${label}):`, err);
      return [];
    }
  };

  const [accepted, declined, invSub, invPaid, contacts, artistApps, partnerApps] = await Promise.all([
    run(`
      SELECT b.accepted_at AS ts, a.name AS actor, br.title AS title, e.name AS context, e.id AS event_id, br.id AS brief_id
      FROM bookings b
      LEFT JOIN artists a ON a.id = b.artist_id
      LEFT JOIN briefs br ON br.id = b.brief_id
      LEFT JOIN events e ON e.id = br.event_id
      WHERE b.accepted_at IS NOT NULL
      ORDER BY b.accepted_at DESC LIMIT ${per}
    `, 'brief_accepted'),
    run(`
      SELECT b.declined_at AS ts, a.name AS actor, br.title AS title, e.name AS context, e.id AS event_id, br.id AS brief_id
      FROM bookings b
      LEFT JOIN artists a ON a.id = b.artist_id
      LEFT JOIN briefs br ON br.id = b.brief_id
      LEFT JOIN events e ON e.id = br.event_id
      WHERE b.declined_at IS NOT NULL
      ORDER BY b.declined_at DESC LIMIT ${per}
    `, 'brief_declined'),
    run(`
      SELECT b.invoice_submitted_at AS ts, a.name AS actor, br.title AS title, e.name AS context, e.id AS event_id, br.id AS brief_id
      FROM bookings b
      LEFT JOIN artists a ON a.id = b.artist_id
      LEFT JOIN briefs br ON br.id = b.brief_id
      LEFT JOIN events e ON e.id = br.event_id
      WHERE b.invoice_submitted_at IS NOT NULL
      ORDER BY b.invoice_submitted_at DESC LIMIT ${per}
    `, 'invoice_submitted'),
    run(`
      SELECT b.invoice_paid_at AS ts, a.name AS actor, br.title AS title, e.name AS context, e.id AS event_id, br.id AS brief_id
      FROM bookings b
      LEFT JOIN artists a ON a.id = b.artist_id
      LEFT JOIN briefs br ON br.id = b.brief_id
      LEFT JOIN events e ON e.id = br.event_id
      WHERE b.invoice_paid_at IS NOT NULL
      ORDER BY b.invoice_paid_at DESC LIMIT ${per}
    `, 'invoice_paid'),
    run(`
      SELECT created_at AS ts, name AS actor, NULL AS title, subject AS context, NULL AS event_id, NULL AS brief_id
      FROM contact_submissions ORDER BY created_at DESC LIMIT ${per}
    `, 'contact_submitted'),
    run(`
      SELECT created_at AS ts, name AS actor, NULL AS title, medium AS context, NULL AS event_id, NULL AS brief_id
      FROM artist_applications ORDER BY created_at DESC LIMIT ${per}
    `, 'artist_applied'),
    run(`
      SELECT created_at AS ts, contact_name AS actor, NULL AS title, organization_name AS context, NULL AS event_id, NULL AS brief_id
      FROM partner_applications ORDER BY created_at DESC LIMIT ${per}
    `, 'partner_applied')
  ]);

  const tag = (rows: Raw[], t: ActivityRow['type']): ActivityRow[] =>
    rows.filter((r) => r.ts).map((r) => ({
      type: t,
      ts: r.ts as string,
      actor: r.actor,
      title: r.title,
      context: r.context,
      event_id: r.event_id,
      brief_id: r.brief_id
    }));

  return [
    ...tag(accepted, 'brief_accepted'),
    ...tag(declined, 'brief_declined'),
    ...tag(invSub, 'invoice_submitted'),
    ...tag(invPaid, 'invoice_paid'),
    ...tag(contacts, 'contact_submitted'),
    ...tag(artistApps, 'artist_applied'),
    ...tag(partnerApps, 'partner_applied')
  ]
    .sort((a, b) => (b.ts > a.ts ? 1 : b.ts < a.ts ? -1 : 0))
    .slice(0, limit);
}
