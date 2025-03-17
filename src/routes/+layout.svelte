<script lang="ts">
	let { children } = $props();
	// Supports weights 100-700
	import '@fontsource-variable/ibm-plex-sans';
	import '@fontsource-variable/nunito';
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

		// Variables
		// Colors attempt to follow APCA
		// https://www.myndex.com/APCA/
		--background: #ffffff;
		--accent: #ff4b00; //
		--transition: cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.2s;
		--font:
			'Nunito Variable', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		background: var(--background);
		font-family: var(--font);
	}
</style>
