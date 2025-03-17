<script lang="ts">
	const { children } = $props();
	import { Toaster } from 'svelte-french-toast';
</script>

<Toaster />
{@render children?.()}
