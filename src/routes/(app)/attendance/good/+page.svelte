<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';

	$: buttonUrl = `/org/${$page.url.searchParams.get('org')}/club/${$page.url.searchParams.get('club')}`;
</script>

<div class="wrap">
	<div class="message">
		<h2>Good to go!</h2>
		<p>You have been marked present!</p>
		<hr />
		<Button href={buttonUrl} value="Go to club" />
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.message {
		background: var(--bgPure);
		width: 20rem;
		border-radius: 0.25rem;
		padding: 1rem;
		box-sizing: border-box;
		box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}

	hr {
		color: transparent;
		background: transparent;
	}
</style>
