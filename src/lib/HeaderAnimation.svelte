<script>
	const phrases = [
		'exciting', ' CNN', 'rumour and speculation', 'BBC ', 'investigative journalism ',
		'with a view to', ' powerful women', 'The Guardian', 'serious allegations', ' into doubt',
		' El Mundo ', 'distribution', 'previously handled ', 'National Geographic', 'to be available'
	];
</script>

<div class="animation-container">
	<div class="header-animation">
		{#each phrases as phrase, i}
			<span class="el el--{i + 1}">
				{#each [...phrase] as letter, j}
					<span class="char {letter === ' ' ? 'char-space' : `char-${j + 1}`}"> {letter} </span>
				{/each}
			</span>
		{/each}
	</div>
</div>
