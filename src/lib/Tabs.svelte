<script>
	let { tabs, selected, onSelect } = $props();
</script>

<nav class="news-tabs">
	{#each tabs as tab, index}
		<a
			href="#"
			class="tabs"
			class:is-active={index === selected}
			onclick={(event) => { event.preventDefault(); onSelect(index); }}
		>{tab.label}</a>
	{/each}
</nav>
