-- Public giveaways attached to live-muralist bookings.
--
-- A giveaway is an opt-in public landing page tied to a single booking
-- (one artist painting one mural at one event). Briefs stay confidential;
-- only the artist's public name/bio/IG and event date/location are
-- exposed on the public page, plus the giveaway title/description/form.
--
-- The URL is /g/[public_token] — unguessable — so only people at the
-- event (who scan the printed QR) can enter.

CREATE TABLE IF NOT EXISTS giveaways (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  public_token TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  opens_at TEXT,
  closes_at TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS giveaway_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  giveaway_id INTEGER NOT NULL REFERENCES giveaways(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  instagram_handle TEXT,
  ip_address TEXT,
  user_agent TEXT,
  is_winner INTEGER NOT NULL DEFAULT 0,
  contacted_at TEXT,
  contacted_note TEXT,
  archived INTEGER NOT NULL DEFAULT 0,
  archived_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(giveaway_id, email)
);

CREATE INDEX IF NOT EXISTS idx_giveaways_booking ON giveaways(booking_id);
CREATE INDEX IF NOT EXISTS idx_giveaways_token ON giveaways(public_token);
CREATE INDEX IF NOT EXISTS idx_entries_giveaway ON giveaway_entries(giveaway_id);
CREATE INDEX IF NOT EXISTS idx_entries_created ON giveaway_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_entries_ip ON giveaway_entries(ip_address);
