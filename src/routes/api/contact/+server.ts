import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	const data = await request.json();

	// Validate required fields
	const { name, email, subject, message } = data;
	if (!name || !email || !subject || !message) {
		return json({ error: 'Please fill in all required fields.' }, { status: 400 });
	}

	try {
		await platform!.env.DB.prepare(
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
