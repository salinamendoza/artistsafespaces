-- RSVP interests: which event activities each RSVPer is interested in.
-- Many-to-many: one RSVP can be interested in multiple activities; one
-- activity can have many interested RSVPers.
--
-- ON DELETE CASCADE on both FKs: deleting an RSVP clears its interests;
-- deleting an activity clears interest rows referencing it.

CREATE TABLE IF NOT EXISTS rsvp_activity_interests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rsvp_id INTEGER NOT NULL REFERENCES rsvps(id) ON DELETE CASCADE,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(rsvp_id, activity_id)
);
CREATE INDEX idx_rsvp_interests_rsvp ON rsvp_activity_interests(rsvp_id);
CREATE INDEX idx_rsvp_interests_activity ON rsvp_activity_interests(activity_id);
