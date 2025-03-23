<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import type { PageData } from './$types';

	export const {
		data
	}: {
		data: PageData;
	} = $props();
</script>

<div class="wrap">
	{#await data.studentOrgs}
		Loading...
	{:then orgs}
		{#if orgs.length === 0}
			<span>You are in no student organiations.</span>
			<Link href="/app/organizations" text="Change that" />
		{/if}
	{/await}
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		padding: 1rem;
	}
</style>
