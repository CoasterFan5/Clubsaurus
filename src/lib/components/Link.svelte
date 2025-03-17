<script lang="ts">
	let {
		text,
		href
	}: {
		text: string;
		href: string;
	} = $props();
</script>

<a {href}>{text}</a>

<style lang="scss">
	a {
		color: var(--accent);
		text-decoration: none;
		position: relative;
		font-size: 1rem;
		font-weight: 700;
	}
</style>
