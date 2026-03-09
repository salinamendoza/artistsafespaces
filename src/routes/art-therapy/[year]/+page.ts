import { error } from '@sveltejs/kit';
import { artTherapyThemes } from '$lib/data/site';
import { themeGalleryImages } from '$lib/data/images';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const year = parseInt(params.year);
  const theme = artTherapyThemes.find(t => t.year === year);

  if (!theme) {
    throw error(404, 'Theme year not found');
  }

  const galleryImages = themeGalleryImages[year] ?? [];
  const categories = [...new Set(galleryImages.map(img => img.category))];

  return {
    theme,
    galleryImages,
    categories
  };
};
