<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import FormSpacer from '$lib/components/FormSpacer.svelte';
	import Input from '$lib/components/Input.svelte';
	import Link from '$lib/components/Link.svelte';
	import { createPromiseToast, handleToastPromiseWithFormAction } from '$lib/utils/toastManager';
	import type { ActionData } from './$types';
	import type { PageData } from './$types';

	const {
		data,
		form
	}: {
		data: PageData;
		form: ActionData;
	} = $props();
</script>

<div class="wrap">
	<form
		class="loginForm"
		method="post"
		action="?/login"
		use:enhance={() => {
			const toastManager = createPromiseToast('Logging In...');
			return async ({ result, update }) => {
				handleToastPromiseWithFormAction(result, toastManager, {
					redirectsAreSuccess: true,
					redirectMessage: 'Logged In'
				});
				await update();
			};
		}}
	>
		<h2>Welcome Back</h2>
		<h3>Please Login</h3>
		<Input name="email" placeholder="Email" label="Email address" />
		<FormSpacer />
		<Input name="password" isSecret={true} placeholder="Password" label="Password" />
		<FormSpacer />
		{#if form?.message}
			{form.message}
		{/if}
		<FormSpacer />
		<Button type="submit">Login</Button>
		{#if data.authInfo.allowRegistration}
			<FormSpacer />
			<div class="noAccount">No account? <Link href="/register" text="Make one" /></div>
		{/if}
	</form>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	form {
		background: var(--background);
	}

	h2 {
		text-align: center;
		font-weight: 500;
		margin-bottom: 0.25rem;
	}

	h3 {
		text-align: center;
		font-weight: 400;
		margin: 0;
		margin-bottom: 2rem;
	}

	.loginForm {
		padding: 1rem 2rem 2rem 2rem;
		width: 20rem;
		max-width: 100%;
		border-radius: 0.25rem;
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.noAccount {
		text-align: center;
		width: 100%;
		display: flex;
		justify-content: center;
		gap: 0.25rem;
	}
</style>
