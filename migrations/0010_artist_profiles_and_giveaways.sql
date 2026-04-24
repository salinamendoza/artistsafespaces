-- Public artist profiles + campaign giveaway entries.
--
-- Distinct from the booking-system `artists` + `briefs` tables in 0003. Those
-- hold internal contract/rate/token data; these hold public-facing profile
-- content and campaign metadata that renders on /a/[slug].
--
-- A `campaign` (e.g. "Live Muralists — 2026 Art Therapy Festival") has one or
-- more `artist_profiles` attached via `campaign_artists`. Each pairing can
-- optionally carry a `giveaway` ("Win a custom mural"). Entries are captured
-- in `giveaway_entries`, one per (giveaway, email).

CREATE TABLE IF NOT EXISTS campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TEXT,
  location TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS artist_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  instagram_handle TEXT,
  headshot_url TEXT,
  is_public INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS campaign_artists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  artist_profile_id INTEGER NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
  role TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(campaign_id, artist_profile_id)
);

CREATE TABLE IF NOT EXISTS giveaways (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  campaign_artist_id INTEGER NOT NULL REFERENCES campaign_artists(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_campaign_artists_campaign ON campaign_artists(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_artists_artist ON campaign_artists(artist_profile_id);
CREATE INDEX IF NOT EXISTS idx_giveaways_campaign_artist ON giveaways(campaign_artist_id);
CREATE INDEX IF NOT EXISTS idx_entries_giveaway ON giveaway_entries(giveaway_id);
CREATE INDEX IF NOT EXISTS idx_entries_created ON giveaway_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_entries_ip ON giveaway_entries(ip_address);
