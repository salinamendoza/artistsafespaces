export interface ArtistProfile {
  id: number;
  slug: string;
  display_name: string;
  bio: string | null;
  instagram_handle: string | null;
  headshot_url: string | null;
  is_public: number;
  created_at: string;
}
