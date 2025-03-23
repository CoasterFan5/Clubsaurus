<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { createPromiseToast, handleToastPromiseWithFormAction } from '$lib/utils/toastManager';
</script>

<div class="wrap">
	<form
		class="info"
		method="post"
		action="?/resendEmail"
		use:enhance={() => {
			const toastManager = createPromiseToast('Sending...');
			return async ({ result, update }) => {
				handleToastPromiseWithFormAction(result, toastManager, {
					redirectsAreSuccess: true,
					redirectMessage: 'Email sent!'
				});
				await update();
			};
		}}
	>
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
