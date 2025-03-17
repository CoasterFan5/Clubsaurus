<script lang="ts">
	import { Toaster } from 'svelte-french-toast';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';
	const {
		data,
		children
	}: {
		data: LayoutData;
		children: Snippet;
	} = $props();
</script>

<title>{data.organizationInfo.name} - Clubsaurus</title>
<Toaster />
{@render children?.()}
