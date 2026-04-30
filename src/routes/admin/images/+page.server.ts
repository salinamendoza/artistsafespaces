import type { PageServerLoad } from './$types';
import { getR2Creds, r2List } from '$lib/server/r2';

export const load: PageServerLoad = async ({ platform }) => {
  const env = platform?.env as Record<string, unknown> | undefined;
  if (!getR2Creds(env)) return { images: [], r2Available: false };

  const list = await r2List(env!);
  const images = list.sort((a, b) => a.key.localeCompare(b.key));
  return { images, r2Available: true };
};
