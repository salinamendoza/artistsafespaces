import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
  const bucket = platform?.env?.IMAGES;
  if (!bucket) return { images: [], r2Available: false };

  const listed = await bucket.list({ limit: 1000 });
  const images = listed.objects
    .map((obj) => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded.toISOString()
    }))
    .sort((a, b) => a.key.localeCompare(b.key));

  return { images, r2Available: true };
};
