import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	const data = await request.json();

	// Validate required fields
	const { name, email, subject, message } = data;
	if (!name || !email || !subject || !message) {
		return json({ error: 'Please fill in all required fields.' }, { status: 400 });
	}

	const db = platform?.env?.DB;
	if (!db) {
		console.error('D1 database binding "DB" is not available. Check your Cloudflare Pages D1 binding settings.');
		return json({ error: 'Database is not configured. Please contact the site admin.' }, { status: 500 });
	}

	try {
		await db.prepare(
			`INSERT INTO contact_submissions (name, email, subject, message)
			 VALUES (?, ?, ?, ?)`
		)
			.bind(name, email, subject, message)
			.run();

		return json({ success: true });
	} catch (e) {
		console.error('Contact submission insert failed:', e);
		return json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
	}
};
