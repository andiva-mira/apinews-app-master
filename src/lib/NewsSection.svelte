<script>
	import { searchHeadlines } from "./api.js";

	let { source } = $props();

	let articles = $state([]);
	let loading = $state(true);
	let error = $state(null);

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const weekdays = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	function errorMessage(err) {
		if (err?.status === 429) {
			return "We're getting a lot of requests right now. Please wait a moment and try again.";
		}
		if (err?.status === 401) {
			return "The news service rejected our credentials. Please check back later.";
		}
		if (err?.status === 'limit') {
			return "We've hit today's request limit for this tab and don't have a cached copy yet. Please check back later.";
		}
		return "Something went wrong fetching the headlines. Please try again shortly.";
	}

	function formatDate(dateUtcInput) {
		if (dateUtcInput == null) return null;
		const utcDate = new Date(dateUtcInput);
		return `${weekdays[utcDate.getDay()]}, ${utcDate.getDate()} ${months[utcDate.getMonth()]} ${utcDate.getFullYear()}`;
	}

	const MAX_DESCRIPTION_LENGTH = 300;
	const parser = new DOMParser();

	// headlinefeed descriptions contain HTML; DOMParser is inert (no script/image execution)
	// so it safely strips tags and decodes entities without risking XSS.
	function summarize(description) {
		if (!description) return null;
		const plainText =
			parser.parseFromString(description, "text/html").body.textContent ||
			"";
		const text = plainText.replace(/\s+/g, " ").trim();
		if (!text) return null;
		return text.length > MAX_DESCRIPTION_LENGTH
			? `${text.slice(0, MAX_DESCRIPTION_LENGTH).trim()}…`
			: text;
	}

	$effect(() => {
		let cancelled = false;

		articles = [];
		error = null;
		loading = true;

		searchHeadlines(source)
			.then((result) => {
				if (!cancelled) articles = result;
			})
			.catch((err) => {
				if (!cancelled) error = err;
			})
			.finally(() => {
				if (!cancelled) loading = false;
			});

		return () => {
			cancelled = true;
		};
	});
</script>

<section id="newsSection" class="section">
	{#if loading}
		<div class="loader" role="status" aria-label="Loading headlines">
			<span class="loader-spinner"></span>
		</div>
	{:else if error}
		<div class="empty-state" role="alert">
			<svg
				class="empty-state-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path
					d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
					fill="var(--title-bg)"
					stroke="var(--primary-b)"
					stroke-width="1.6"
				/>
				<g stroke="var(--primary-a)" stroke-width=".8">
					<line x1="8" y1="12.5" x2="10.5" y2="15" />
					<line x1="10.5" y1="12.5" x2="8" y2="15" />
					<line x1="14" y1="12.5" x2="16.5" y2="15" />
					<line x1="16.5" y1="12.5" x2="14" y2="15" />
				</g>
				<path
					d="M8.5 18c1.5-2 5.5-2 7 0"
					stroke="var(--primary-a)"
					stroke-width=".8"
				/>
			</svg>
			<p class="empty-state-message">{errorMessage(error)}</p>
		</div>
	{/if}

	{#each articles as article, index}
		<article class="article">
			<div class="news-content">
				<div class="title-container">
					<h2 class="title">
						<span class="quotes"></span>{article.title}
					</h2>
				</div>
				<div class="description">
					{#if formatDate(article.publishedAt)}
						<small class="article-date"
							>{formatDate(article.publishedAt)}</small
						>
					{/if}
					{#if summarize(article.description)}
						<p>{summarize(article.description)}</p>
					{/if}
					<a
						href={article.url}
						target="_blank"
						rel="noreferrer"
						class="btn {index % 2 === 0 ? 'btn--odd' : ''}"
					>
						<span class="btn-text">View Article</span>
					</a>
				</div>
			</div>
		</article>
	{/each}
</section>

<style>
	.loader {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 80px 0;
	}

	.loader-spinner {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		border: 4px solid var(--title-bg);
		border-top-color: var(--primary-a);
		border-right-color: var(--primary-b);
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 60px 20px;
		gap: 16px;
	}

	.empty-state-icon {
		width: 150px;
		height: 150px;
	}

	.empty-state-message {
		max-width: 340px;
		color: var(--primary-b);
		text-align: center;
	}
</style>
