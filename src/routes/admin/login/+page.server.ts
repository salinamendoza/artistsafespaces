import { fail, redirect } from '@sveltejs/kit';
import { ADMIN_SECRET } from '$env/static/private';
import { createSessionToken } from '../../../hooks.server';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const password = form.get('password')?.toString() ?? '';

    if (password !== ADMIN_SECRET) {
      return fail(401, { error: 'Invalid password' });
    }

    cookies.set('admin_session', createSessionToken(), {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    throw redirect(303, '/admin');
  }
};
