import manifest from '$lib/data/imageManifest.json';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return { images: manifest };
};
