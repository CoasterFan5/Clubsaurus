<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import type { PageData } from './$types';

	const {
		data
	}: {
		data: PageData;
	} = $props();
</script>

{#await data.orgs}
	<span>Loading orgs...</span>
{:then orgList}
	{#if orgList.length < 1}
		<p>No student orgs</p>
		{#if data.user.institutionAdmin}
			<Link text="Manage Organizations" href="/app/admin/organizations" />
		{:else}
			<Link text="Create One" href="/app/organizations/create" />
		{/if}
	{:else}
		{#each orgList as org (org.id)}
			<p>{org.name}</p>
		{/each}
	{/if}
{/await}
