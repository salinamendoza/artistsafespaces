-- Artist Applications
CREATE TABLE IF NOT EXISTS artist_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  website TEXT,
  instagram TEXT,
  medium TEXT NOT NULL,
  bio TEXT NOT NULL,
  interests TEXT, -- JSON array stored as string
  referral TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Partner Applications
CREATE TABLE IF NOT EXISTS partner_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  org_type TEXT NOT NULL,
  interests TEXT, -- JSON array stored as string
  message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Contact Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
