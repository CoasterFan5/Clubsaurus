<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import { handleForm } from '$lib/utils/formToaster';

	export let form;
	export let data;

	let slug: string | undefined;
	$: slug = data.org.slug?.slug;

	$: handleForm(form, 'Club Updated!');
</script>

<main>
	<h2>Visibility</h2>

	<form
		action="?/updateVisibility"
		method="post"
		use:enhance={() => {
			return ({ update }) => {
				return update({ reset: false });
			};
		}}
	>
		<Input name="slug" label="Slug" value={slug} />
		<div class="spacer-small" />
		<p>
			Slugs are another way to access an organization. Organizations with slugs will be visible at <span
				>https://clubsaur.us/org/(slug)</span
			>
		</p>
		<Checkbox name="isPublic" checked={data.org.isPublic} label="Public Organization" />
		<p>Public organizations can be accessed by anyone, even if they don't have a join code.</p>
		<Checkbox
			name="discoverable"
			checked={data.org.discoverable}
			label="Discoverable Organization"
		/>
		<p>Discoverable organizations will show up on the organization discovery page</p>
		<Checkbox name="hideSensitive" checked={data.org.hideSensitive} label="Hide Sensitive Info" />
		<p>
			Hide names, events, and announcements to members outside the organization to protect users
			information. <b>Highly</b> recommended if this organization has information pertaining to minors.
		</p>
		<div class="spacer" />
		<Button value="Save" />
	</form>
</main>

<style lang="scss">
	div.spacer {
		margin-bottom: 1rem;
	}

	div.spacer-small {
		margin-bottom: 0.5rem;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 500px;
		width: 100%;
	}
	form {
		width: 100%;
		display: flex;
		flex-direction: column;
		text-align: left;
		align-items: start;
	}
	p {
		margin: 0px;
		opacity: 0.8;
		font-size: 0.8rem;
	}
</style>
