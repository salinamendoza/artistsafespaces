import { error } from '@sveltejs/kit';
import type { Event } from '$lib/types/db-types';

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Validate a partner-hub token against an event. Returns the event row on
 * success. Returns null when the token is missing, doesn't match, or the
 * link has expired — callers render a friendly expired page in that case
 * rather than a 404.
 */
export async function validatePartnerToken(
  db: D1Database,
  eventId: number,
  token: string | null
): Promise<Event | null> {
  if (!Number.isInteger(eventId) || !token) return null;
  const event = await db.prepare('SELECT * FROM events WHERE id = ?').bind(eventId).first<Event>();
  if (!event) return null;
  const tokenMatches = event.share_token != null && event.share_token === token;
  const today = todayISODate();
  const notExpired = event.share_expires_at != null && event.share_expires_at >= today;
  if (!tokenMatches || !notExpired) return null;
  return event;
}

/**
 * Same as validatePartnerToken, but throws a 403 instead of returning null.
 * Use this inside form actions where any failure should reject the write.
 */
export async function requirePartnerToken(
  db: D1Database,
  eventId: number,
  token: string | null
): Promise<Event> {
  const event = await validatePartnerToken(db, eventId, token);
  if (!event) throw error(403, 'Partner link is invalid or expired.');
  return event;
}
