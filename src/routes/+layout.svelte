<script lang="ts">
	let { children } = $props();
</script>

<div class="wrap">
	{@render children()}
</div>

<style lang="scss">
	:global(*) {
		box-sizing: border-box;
	}

	.wrap {
		height: 100vh;
		width: 100%;
	}

	:global(body) {
		margin: 0px;
		height: 100vh;
		width: 100%;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
	}
</style>
