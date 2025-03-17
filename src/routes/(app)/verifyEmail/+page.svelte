<script>
	import Button from '$lib/components/Button.svelte';
</script>

<div class="wrap">
	<form class="info" method="post" action="?/resendEmail">
		<h2>Verify Email</h2>
		<p>Check your email for a link.</p>
		<Button type="submit">Resend Email</Button>
	</form>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
	}

	.info {
		border: 1px solid rgba(0, 0, 0, 0.1);
		padding: 1rem;
		border-radius: 0.25rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
