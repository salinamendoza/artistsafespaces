-- Public RSVPs per event. Mirrors the giveaway pattern (/g/[token]) but
-- separate column + table so leaking one URL doesn't expose the other.
--
-- Data ethics: RSVPs are collected for the event and deleted after it
-- concludes. The admin event page renders a delete-RSVPs button so Sam can
-- clear them post-event. No CRM hand-off, no list-sharing.
--
-- ON DELETE CASCADE on rsvps.event_id: deleting an event auto-clears its
-- RSVPs. Different from hub data (zones/activities/tasks) which use RESTRICT
-- because that's coordination state, not entry data.

ALTER TABLE events ADD COLUMN rsvp_token TEXT;
UPDATE events SET rsvp_token = lower(hex(randomblob(16))) WHERE rsvp_token IS NULL;
CREATE UNIQUE INDEX idx_events_rsvp_token ON events(rsvp_token);

CREATE TABLE IF NOT EXISTS rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(event_id, email)
);
CREATE INDEX idx_rsvps_event ON rsvps(event_id);
CREATE INDEX idx_rsvps_created ON rsvps(created_at DESC);
