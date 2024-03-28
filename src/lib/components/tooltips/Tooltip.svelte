<script lang="ts">
	export let text: string = 'tooltip!';
	export let pos = {
		x: 0,
		y: 0
	};
	let opacityLock = false;
	export let opacity = 0;
	let trueOpacity = 0;
	$: if (opacity && !opacityLock) {
		trueOpacity = opacity;
	}
	export let id: string;
	let toolTipHeight: number;
	let toolTipWidth: number;
	let tooltipDiv: HTMLDivElement;
</script>

{#if !(trueOpacity < 0.01)}
	<div
		bind:this={tooltipDiv}
		{id}
		style="left: {pos.x - toolTipWidth / 2}px; top: {pos.y -
			toolTipHeight / 4}px; opacity: {trueOpacity}"
		class="wrap"
		aria-hidden="true"
		role="tooltip"
		on:mouseenter={() => {
			opacityLock = true;
			trueOpacity = 1;
		}}
		on:mouseleave={() => {
			opacityLock = false;
			trueOpacity = 0;
		}}
	>
		<div class="tooltip" bind:clientHeight={toolTipHeight} bind:clientWidth={toolTipWidth}>
			{text}
		</div>
	</div>
{/if}

<style lang="scss">
	.wrap {
		position: fixed;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
		border-radius: 3px;
		z-index: 250;
	}
	.tooltip {
		border-radius: 3px;
		padding: 5px 10px;
		box-sizing: border-box;
		background: var(--bgPure);
	}
</style>
