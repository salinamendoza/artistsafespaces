import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	const data = await request.json();

	// Validate required fields
	const { organizationName, contactName, email, orgType } = data;
	if (!organizationName || !contactName || !email || !orgType) {
		return json({ error: 'Please fill in all required fields.' }, { status: 400 });
	}

	const db = platform?.env?.DB;
	if (!db) {
		console.error('D1 database binding "DB" is not available. Check your Cloudflare Pages D1 binding settings.');
		return json({ error: 'Database is not configured. Please contact the site admin.' }, { status: 500 });
	}

	try {
		await db.prepare(
			`INSERT INTO partner_applications (organization_name, contact_name, email, phone, org_type, interests, message)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`
		)
			.bind(
				organizationName,
				contactName,
				email,
				data.phone || null,
				orgType,
				JSON.stringify(data.interests || []),
				data.message || null
			)
			.run();

		return json({ success: true });
	} catch (e) {
		console.error('Partner application insert failed:', e);
		return json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
	}
};
