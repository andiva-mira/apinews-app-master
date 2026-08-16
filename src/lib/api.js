// Headline Feed API
// https://headlinefeed.dev/documentation
//
// In production this goes through /api/headlines, a Vercel serverless function
// that holds the bearer token server-side (see api/headlines.js) - headlinefeed's
// CORS policy only allows localhost, and this also keeps the token out of the
// public bundle. In local dev we call headlinefeed directly, since localhost is
// already an allowed origin; import.meta.env.DEV is statically replaced with
// `false` in production builds, so this whole branch (token included) is
// dead-code-eliminated and never ships.
const DEV_BEARER_TOKEN = 'hlf_52ed296a508d412aa74a5fc0c0a3e8f5';
const DEV_URL = 'https://api.headlinefeed.dev/api/search';
const PROD_URL = '/api/headlines';

function fetchHeadlines(source) {
	if (import.meta.env.DEV) {
		return fetch(DEV_URL, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${DEV_BEARER_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ source })
		});
	}

	return fetch(PROD_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ source })
	});
}

// Client-side only: caps how many real requests *this browser* makes per day,
// then serves cached results instead. Since the token is public in the bundle,
// this can't enforce one shared budget across every visitor.
const DAILY_CALL_LIMIT = 100;
const CACHE_TTL_MS = 20 * 60 * 1000;
const CACHE_PREFIX = 'headlinefeed:cache:';
const COUNT_KEY = 'headlinefeed:call-count';

function readJSON(key) {
	try {
		return JSON.parse(localStorage.getItem(key));
	} catch {
		return null;
	}
}

function writeJSON(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// localStorage unavailable (private mode, quota, etc.) - caching just degrades to none
	}
}

function readCache(source) {
	return readJSON(CACHE_PREFIX + source);
}

function writeCache(source, headlines) {
	writeJSON(CACHE_PREFIX + source, { timestamp: Date.now(), headlines });
}

function getCallCount() {
	const today = new Date().toDateString();
	const record = readJSON(COUNT_KEY);
	return record?.day === today ? record.count : 0;
}

function recordCall() {
	const day = new Date().toDateString();
	writeJSON(COUNT_KEY, { day, count: getCallCount() + 1 });
}

export async function searchHeadlines(source) {
	const cached = readCache(source);
	if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
		return cached.headlines;
	}

	if (getCallCount() >= DAILY_CALL_LIMIT) {
		if (cached) return cached.headlines;
		const error = new Error('Daily request limit reached with no cached headlines available');
		error.status = 'limit';
		throw error;
	}

	let response;
	try {
		response = await fetchHeadlines(source);
	} catch (networkError) {
		if (cached) return cached.headlines;
		throw networkError;
	}

	recordCall();

	if (!response.ok) {
		if (cached) return cached.headlines;
		const error = new Error(`headlinefeed request failed (${response.status})`);
		error.status = response.status;
		throw error;
	}

	const { headlines } = await response.json();
	const trimmed = headlines.slice(0, 10);
	writeCache(source, trimmed);
	return trimmed;
}
