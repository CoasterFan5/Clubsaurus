<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		type = 'button'
	}: {
		children?: Snippet;
		type?: HTMLButtonElement['type'];
	} = $props();
</script>

<button {type}>
	{@render children?.()}
</button>

<style lang="scss">
	button {
		width: 100%;
		padding: 0.25rem;
		border-radius: 0.25rem;
		outline: 0px;
		border: 0px;
		background: transparent;
		border: 1px solid rgba(0, 0, 0, 0.1);
		background: rgba(0, 0, 0, 0.05);
		cursor: pointer;
		font-size: 1rem;
		font: var(--font);
		transition: all var(--transition);

		&:focus {
			border: 1px solid rgba(0, 0, 0, 0.3);
		}

		&:hover {
			background: rgba(255, 255, 255, 1);
		}
	}
</style>
