<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import FormSpacer from '$lib/components/FormSpacer.svelte';
	import Input from '$lib/components/Input.svelte';
	import Link from '$lib/components/Link.svelte';
	import type { PageProps } from './$types';

	const { data, form }: PageProps = $props();
</script>

<div class="wrap">
	<form class="loginForm" method="post" action="?/register">
		<h2>Welcome</h2>
		<h3>Please Sign Up</h3>
		<Input name="firstName" placeholder="John" label="First Name" />
		<FormSpacer />
		<Input name="lastName" placeholder="Doe" label="Last Name" />
		<FormSpacer />
		<Input name="email" placeholder="Email" label="Email address" />
		<FormSpacer />
		<Input name="pass1" isSecret={true} placeholder="abc123" label="Password" />
		<FormSpacer />
		<Input name="pass2" isSecret={true} placeholder="abc123" label="Confirm Password" />
		<FormSpacer />
		{#if form?.message}
			<span>{form.message}</span>
		{/if}
		<FormSpacer />

		<Button type="submit">Create</Button>

		{#if data.authInfo.allowRegistration}
			<FormSpacer />
			<div class="noAccount">Have an account? <Link href="/login" text="Sign In" /></div>
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
