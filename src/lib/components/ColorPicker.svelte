<script lang="ts">
	export let name: string;
	export let color: string;

	let input: HTMLInputElement;
</script>

<button style="background-color: {color}" type="button" on:click={() => input.click()} />
<input bind:this={input} {name} hidden type="color" bind:value={color} />

<style lang="scss">
	button {
		all: unset;
		cursor: pointer;
		height: 2rem;
		border: 1px solid black;
		aspect-ratio: 1/1;
		box-sizing: border-box;
		border-radius: 50%;
	}
</style>
