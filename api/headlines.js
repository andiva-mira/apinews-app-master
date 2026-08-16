// Vercel serverless function. Runs server-side, so this is a same-origin call
// from the browser's point of view (no CORS) and the bearer token never
// reaches the client bundle.
const BASE_URL = 'https://api.headlinefeed.dev';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		res.status(405).json({ error: 'Method not allowed' });
		return;
	}

	const token = process.env.HEADLINEFEED_TOKEN;
	if (!token) {
		res.status(500).json({ error: 'Server is missing HEADLINEFEED_TOKEN' });
		return;
	}

	let response;
	try {
		response = await fetch(`${BASE_URL}/api/search`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(req.body ?? {})
		});
	} catch {
		res.status(502).json({ error: 'Failed to reach headlinefeed' });
		return;
	}

	const data = await response.json().catch(() => null);
	res.status(response.status).json(data);
}
