<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let timer = $state(5);

	onMount(() => {
		setInterval(() => {
			timer -= 0.1;
			if (timer <= 0) {
				goto('/app');
			}
		}, 100);
	});
</script>

<div class="wrap">
	<div class="info">
		<h2>Email Verified</h2>
		{#if timer > 0}
			<p>Redirecting You in {timer.toFixed(1)} seconds.</p>
		{:else}
			<p>Redirecting You now.</p>
		{/if}
	</div>
</div>
