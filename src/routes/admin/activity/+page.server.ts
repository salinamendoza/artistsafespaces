import type { PageServerLoad } from './$types';
import type { ActivityRow } from '$lib/types/activity';
import { loadActivity } from '$lib/server/activity';

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
  setHeaders({ 'cache-control': 'no-store' });

  const db = platform?.env?.DB;
  if (!db) return { activity: [] as ActivityRow[] };

  const activity = await loadActivity(db, 50);
  return { activity };
};
