import { redirect, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const SESSION_COOKIE = 'admin_session';

async function hmacHex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifySession(cookie: string | undefined): Promise<boolean> {
  if (!cookie || !env.ADMIN_SECRET) return false;
  const expected = await hmacHex(env.ADMIN_SECRET, 'admin');
  return cookie === expected;
}

export async function createSessionToken(): Promise<string> {
  return hmacHex(env.ADMIN_SECRET!, 'admin');
}

export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = event.cookies.get(SESSION_COOKIE);
    if (!(await verifySession(session))) {
      throw redirect(303, '/admin/login');
    }
    event.locals.admin = true;
  }

  return resolve(event);
};
