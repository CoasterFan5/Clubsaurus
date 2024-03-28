<script lang="ts">
	export let href: string | undefined = undefined;
	export let textColor = 'var(--accent)';
</script>

{#if href}
	<a style="color: {textColor}" class="link" {href}>
		<slot />
	</a>
{:else}
	<button style="color: {textColor}" class="link" on:click>
		<slot />
	</button>
{/if}

<style lang="scss">
	.link {
		all: unset;
		cursor: pointer;
		text-decoration: none;

		margin-left: var(--marginLeft, 0px);
		margin-right: var(--marginRight, 0px);
		margin-top: var(--marginTop, 2px);
		margin-bottom: var(--marginBottom, 2px);

		padding: var(--padding, 0);

		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;

		position: relative;
		font-size: var(--fontSize, inherit);
		text-wrap: nowrap;

		&::after {
			content: '';
			position: absolute;
			bottom: 0px;
			width: 100%;
			height: 2px;
			left: 0px;
			background: var(--accent);
			transform: scaleX(0);
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		}

		&:hover::after {
			transform: scaleX(1);
		}
	}
</style>
