import { redirect, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createHmac } from 'node:crypto';

const SESSION_COOKIE = 'admin_session';

export function verifySession(cookie: string | undefined): boolean {
  if (!cookie || !env.ADMIN_SECRET) return false;
  const expected = createHmac('sha256', env.ADMIN_SECRET).update('admin').digest('hex');
  return cookie === expected;
}

export function createSessionToken(): string {
  return createHmac('sha256', env.ADMIN_SECRET!).update('admin').digest('hex');
}

export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = event.cookies.get(SESSION_COOKIE);
    if (!verifySession(session)) {
      throw redirect(303, '/admin/login');
    }
    event.locals.admin = true;
  }

  return resolve(event);
};
