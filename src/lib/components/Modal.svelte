<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	export let disableOverflowProtection = false;

	const dispatch = createEventDispatcher<{
		close: undefined;
	}>();

	let modalClickHelper = () => dispatch('close');
</script>

<button
	on:mousedown|self={modalClickHelper}
	transition:fade={{ easing: cubicInOut, duration: 150 }}
>
	<div
		class:overflowProtection={!disableOverflowProtection}
		transition:fly={{ easing: cubicInOut, duration: 300, delay: 50, y: 50 }}
	>
		<slot />
	</div>
</button>

<style lang="scss">
	button {
		all: unset;
		position: fixed;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		top: 0px;
		left: 0px;
		z-index: 1001;
		height: 100vh;
		box-sizing: border-box;
		padding: 2rem 0px;
	}

	div {
		box-sizing: border-box;
		border-radius: 5px;
		padding: 20px;
		background: var(--bgPure);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: calc(100% - 2rem);
		max-height: 90%;
	}

	.overflowProtection {
		overflow-y: auto;
	}
</style>
