import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	const data = await request.json();

	// Validate required fields
	const { name, email, location, medium, bio } = data;
	if (!name || !email || !location || !medium || !bio) {
		return json({ error: 'Please fill in all required fields.' }, { status: 400 });
	}

	const db = platform?.env?.DB;
	if (!db) {
		console.error('D1 database binding "DB" is not available. Check your Cloudflare Pages D1 binding settings.');
		return json({ error: 'Database is not configured. Please contact the site admin.' }, { status: 500 });
	}

	try {
		await db.prepare(
			`INSERT INTO artist_applications (name, email, location, website, instagram, medium, bio, interests, referral)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
			.bind(
				name,
				email,
				location,
				data.website || null,
				data.instagram || null,
				medium,
				bio,
				JSON.stringify(data.interests || []),
				data.referral || null
			)
			.run();

		return json({ success: true });
	} catch (e) {
		console.error('Artist application insert failed:', e);
		return json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
	}
};
