<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	export let showing = false;

	let bgDiv: HTMLButtonElement;

	let modelClickHelper = (e: MouseEvent) => {
		if (e.target === bgDiv) {
			showing = false;
		}
	};
</script>

{#if showing}
	<button
		bind:this={bgDiv}
		class="wrap"
		on:mousedown={modelClickHelper}
		transition:fade={{ easing: cubicInOut, duration: 150 }}
	>
		<div class="modalForm" transition:fly={{ easing: cubicInOut, duration: 300, delay: 50, y: 50 }}>
			<slot />
		</div>
	</button>
{/if}

<style lang="scss">
	.wrap {
		all: unset;
		position: fixed;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		top: 0px;
		left: 0px;
		z-index: 1001;
	}

	.modalForm {
		border-radius: 5px;
		padding: 20px;
		background: var(--bgPure);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
</style>
