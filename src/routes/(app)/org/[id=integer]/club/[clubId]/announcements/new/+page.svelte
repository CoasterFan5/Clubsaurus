<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import MdEditor from '$lib/components/editor/MdEditor.svelte';
	import Input from '$lib/components/Input.svelte';
	import { handleForm } from '$lib/utils/formToaster.js';

	let content = 'No Description';
	export let form;

	$: handleForm(form);
</script>

<main>
	<form action="?/createAnnouncement" method="post" use:enhance>
		<div>
			<div class="input">
				<Input name="title" label="Title" />
			</div>
			<MdEditor editable saveable={false} bind:content />
			<hr />
			<input name="description" style="display: none" bind:value={content} />
			<Button type="submit" value="Create" />
		</div>
	</form>
</main>

<style lang="scss">
	main {
		display: flex;
		width: 100%;
		padding: 50px 0px;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}

	form {
		width: 90%;
		max-width: 500px;
	}

	hr {
		padding: 0px;
		margin: 7px 0px;
		border: 0px;
	}

	.input {
		margin-bottom: 1rem;
	}
</style>
