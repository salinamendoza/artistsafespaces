export interface Giveaway {
  id: number;
  campaign_artist_id: number;
  title: string;
  description: string | null;
  opens_at: string | null;
  closes_at: string | null;
  is_active: number;
  created_at: string;
}

export interface GiveawayEntry {
  id: number;
  giveaway_id: number;
  name: string;
  email: string;
  phone: string;
  instagram_handle: string | null;
  ip_address: string | null;
  user_agent: string | null;
  is_winner: number;
  contacted_at: string | null;
  contacted_note: string | null;
  archived: number;
  archived_note: string | null;
  created_at: string;
}
