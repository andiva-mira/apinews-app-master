<script>
	import HeaderAnimation from "./lib/HeaderAnimation.svelte";
	import Tabs from "./lib/Tabs.svelte";
	import NewsSection from "./lib/NewsSection.svelte";

	const tabs = [
		{ label: "NASA", source: "nasa" },
		{ label: "The Guardian UK", source: "the-guardian" },
		{ label: "BBC", source: "bbc" },
		{ label: "Reuters", source: "reuters" },
	];

	let selected = $state(0);
</script>

<header>
	<HeaderAnimation />
	<div class="news-logo"></div>
	<div class="page-title">
		<h1>What's New?</h1>
	</div>
</header>

<Tabs {tabs} {selected} onSelect={(index) => (selected = index)} />

<NewsSection source={tabs[selected].source} />
