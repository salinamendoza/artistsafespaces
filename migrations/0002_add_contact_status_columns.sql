-- Add status tracking columns to contact_submissions
ALTER TABLE contact_submissions ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;
ALTER TABLE contact_submissions ADD COLUMN archive_note TEXT;
ALTER TABLE contact_submissions ADD COLUMN contacted INTEGER NOT NULL DEFAULT 0;
ALTER TABLE contact_submissions ADD COLUMN contact_note TEXT;
