export interface Campaign {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  is_active: number;
  created_at: string;
}

export interface CampaignArtist {
  id: number;
  campaign_id: number;
  artist_profile_id: number;
  role: string | null;
  created_at: string;
}
