import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

const ALLOWED_TYPES = ['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/avif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export const load: PageServerLoad = async ({ platform }) => {
  const bucket = platform?.env?.IMAGES;
  if (!bucket) return { images: [] };

  const listed = await bucket.list({ limit: 500 });
  const images = listed.objects.map((obj) => ({
    key: obj.key,
    size: obj.size,
    uploaded: obj.uploaded.toISOString()
  }));

  return { images };
};

export const actions: Actions = {
  upload: async ({ request, platform }) => {
    const bucket = platform?.env?.IMAGES;
    if (!bucket) return fail(500, { error: 'Image storage not configured' });

    const form = await request.formData();
    const folder = form.get('folder')?.toString().replace(/^\/|\/$/g, '') ?? '';
    const files = form.getAll('files') as File[];

    if (!files.length) return fail(400, { error: 'No files selected' });

    const uploaded: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return fail(400, { error: `Invalid file type: ${file.type}. Allowed: webp, jpg, png, gif, avif` });
      }
      if (file.size > MAX_SIZE) {
        return fail(400, { error: `File ${file.name} exceeds 10 MB limit` });
      }

      const key = folder ? `${folder}/${file.name}` : file.name;
      await bucket.put(key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type }
      });
      uploaded.push(key);
    }

    return { success: true, uploaded };
  },

  delete: async ({ request, platform }) => {
    const bucket = platform?.env?.IMAGES;
    if (!bucket) return fail(500, { error: 'Image storage not configured' });

    const form = await request.formData();
    const key = form.get('key')?.toString();

    if (!key) return fail(400, { error: 'Missing image key' });

    await bucket.delete(key);
    return { success: true };
  }
};
