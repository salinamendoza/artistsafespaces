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
  public_token: string;
  event_id: number;
  event_name: string;
  brief_id: number;
  brief_title: string;
  artist_id: number;
  artist_name: string;
}

export const load: PageServerLoad = async ({ platform, url, setHeaders }) => {
  setHeaders({ 'cache-control': 'no-store' });

  const db = platform?.env?.DB;
  if (!db) {
    return {
      entries: [] as EntryRow[],
      events: [] as { id: number; name: string }[],
      artists: [] as { id: number; name: string }[],
      filter: { eventId: null, artistId: null, giveawayId: null, view: 'active' as 'active' | 'archived' }
    };
  }

  const eventIdParam = url.searchParams.get('event');
  const artistIdParam = url.searchParams.get('artist');
  const giveawayIdParam = url.searchParams.get('giveaway');
  const viewParam = url.searchParams.get('view') === 'archived' ? 'archived' : 'active';

  const eventId = eventIdParam ? Number(eventIdParam) : null;
  const artistId = artistIdParam ? Number(artistIdParam) : null;
  const giveawayId = giveawayIdParam ? Number(giveawayIdParam) : null;

  const eventsResult = await db
    .prepare(
      `SELECT DISTINCT e.id, e.name
         FROM events e
         JOIN briefs br ON br.event_id = e.id
         JOIN bookings b ON b.brief_id = br.id
         JOIN giveaways g ON g.booking_id = b.id
        ORDER BY e.event_date DESC, e.name ASC`
    )
    .all<{ id: number; name: string }>();

  const artistsResult = eventId
    ? await db
        .prepare(
          `SELECT DISTINCT a.id, a.name
             FROM artists a
             JOIN bookings b ON b.artist_id = a.id
             JOIN briefs br ON br.id = b.brief_id
             JOIN giveaways g ON g.booking_id = b.id
            WHERE br.event_id = ?
            ORDER BY a.name ASC`
        )
        .bind(eventId)
        .all<{ id: number; name: string }>()
    : await db
        .prepare(
          `SELECT DISTINCT a.id, a.name
             FROM artists a
             JOIN bookings b ON b.artist_id = a.id
             JOIN giveaways g ON g.booking_id = b.id
            ORDER BY a.name ASC`
        )
        .all<{ id: number; name: string }>();

  const where: string[] = ['ge.archived = ?'];
  const binds: (number | string)[] = [viewParam === 'archived' ? 1 : 0];
  if (eventId) {
    where.push('e.id = ?');
    binds.push(eventId);
  }
  if (artistId) {
    where.push('a.id = ?');
    binds.push(artistId);
  }
  if (giveawayId) {
    where.push('g.id = ?');
    binds.push(giveawayId);
  }

  const entriesResult = await db
    .prepare(
      `SELECT ge.id, ge.created_at, ge.name, ge.email, ge.phone, ge.instagram_handle,
              ge.is_winner, ge.contacted_at, ge.contacted_note, ge.archived, ge.archived_note,
              g.id AS giveaway_id, g.title AS giveaway_title, g.public_token AS public_token,
              e.id AS event_id, e.name AS event_name,
              br.id AS brief_id, br.title AS brief_title,
              a.id AS artist_id, a.name AS artist_name
         FROM giveaway_entries ge
         JOIN giveaways g ON g.id = ge.giveaway_id
         JOIN bookings b ON b.id = g.booking_id
         JOIN briefs br ON br.id = b.brief_id
         JOIN events e ON e.id = br.event_id
         JOIN artists a ON a.id = b.artist_id
        WHERE ${where.join(' AND ')}
        ORDER BY ge.created_at DESC`
    )
    .bind(...binds)
    .all<EntryRow>();

  return {
    entries: entriesResult.results ?? [],
    events: eventsResult.results ?? [],
    artists: artistsResult.results ?? [],
    filter: { eventId, artistId, giveawayId, view: viewParam }
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
      .prepare(`UPDATE giveaway_entries SET contacted_at = datetime('now'), contacted_note = ? WHERE id = ?`)
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
    await db.prepare('UPDATE giveaway_entries SET contacted_at = NULL, contacted_note = NULL WHERE id = ?').bind(id).run();
    return { success: true };
  },

  toggleWinner: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });
    const form = await request.formData();
    const id = Number(form.get('id'));
    if (!id) return fail(400, { error: 'Missing id' });
    await db.prepare('UPDATE giveaway_entries SET is_winner = 1 - is_winner WHERE id = ?').bind(id).run();
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
    await db.prepare('UPDATE giveaway_entries SET archived = 1, archived_note = ? WHERE id = ?').bind(note, id).run();
    return { success: true };
  },

  unarchive: async ({ request, platform }) => {
    const db = platform?.env?.DB;
    if (!db) return fail(500, { error: 'Database unavailable' });
    const form = await request.formData();
    const id = Number(form.get('id'));
    if (!id) return fail(400, { error: 'Missing id' });
    await db.prepare('UPDATE giveaway_entries SET archived = 0, archived_note = NULL WHERE id = ?').bind(id).run();
    return { success: true };
  }
};
