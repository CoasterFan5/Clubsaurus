<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { handleForm } from '$lib/utils/formToaster';

	import Role from './Role.svelte';
	export let data;

	export let form;
	$: handleForm(form, 'Role Updated');
</script>

<div class="wrap">
	<h2>Roles</h2>
	{#each data.roles as role}
		<Role {role} />
	{/each}
	<form action="?/createRole" method="post" use:enhance>
		<Button value="Create Role" />
	</form>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		box-sizing: border-box;
	}
</style>
