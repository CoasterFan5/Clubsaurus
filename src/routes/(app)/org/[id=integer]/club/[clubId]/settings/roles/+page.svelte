<script lang="ts">
	import { flip } from 'svelte/animate';
	import BxRightArrowAlt from '~icons/bx/right-arrow-alt';

	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { tooltip } from '$lib/components/tooltips/tooltip';
	import { onSubmit } from '$lib/onSubmitEnhance';
	import { handleForm } from '$lib/utils/formToaster.js';

	export let data;
	export let form;

	let forms: HTMLButtonElement[] = [];

	$: handleForm(form, 'Success!');

	let selectedRoleName = '';
	let inputtedRoleName = '';
	let selectedRoleId: number;
</script>

{#if $page.state.showingModal == 'deleteRole'}
	<Modal on:close={() => history.back()}>
		<form
			action="?/deleteRole"
			method="post"
			use:enhance={onSubmit(() => {
				inputtedRoleName = '';
				history.back();
			})}
		>
			<h1>Are you sure?</h1>
			<p>Type <b>{selectedRoleName}</b> to confirm</p>
			<input name="roleId" hidden value={selectedRoleId} />
			<div class="formItem">
				<Input name="roleName" bg="white" label="Type Role Name" bind:value={inputtedRoleName} />
			</div>
			<div class="formItem">
				<Button
					disabled={selectedRoleName !== inputtedRoleName}
					type="submit"
					value="Delete Role"
				/>
			</div>
		</form>
	</Modal>
{/if}

<main>
	{#if data.roles.length < 1}
		<h2>No roles yet</h2>
	{/if}

	{#each data.roles as role, i (role.id)}
		<form
			style="--color: {role.color};"
			class="role"
			action="?/updateRole"
			method="post"
			use:enhance={() => {
				// Keep all form data
				return async ({ update }) => {
					await update({ reset: false });
				};
			}}
			animate:flip
		>
			<input name="roleId" hidden bind:value={role.id} />
			<div class="nameWrap">
				<input
					name="name"
					class="name"
					bind:value={role.name}
					on:change={() => {
						forms[i]?.click();
					}}
				/>
			</div>
			<div class="actions">
				<button
					class="button"
					title="Delete"
					type="button"
					on:click={() => {
						pushState('', {
							showingModal: 'deleteRole'
						});
						selectedRoleId = role.id;
						selectedRoleName = role.name;
					}}
					use:tooltip={'Delete'}
				>
					<img alt="delete" src="/icons/trash.svg" />
				</button>
				<input
					name="color"
					class="color"
					hidden
					title="Color"
					type="color"
					bind:value={role.color}
					on:change={() => {
						forms[i]?.click();
					}}
					use:tooltip={'Color'}
				/>
				<a
					class="button"
					href="/org/{data.org.id}/club/{data.club.id}/settings/roles/{role.id}"
					title="More"
					type="button"
					use:tooltip={'More'}
				>
					<img alt="goto" src="/icons/right.svg" />
				</a>
			</div>
			<button bind:this={forms[i]} hidden type="submit" />
		</form>
	{/each}
	<form class="buttonHolder" action="?/makeRole" method="post" use:enhance>
		<Button value="Add Role" />
	</form>
</main>

<style lang="scss">
	main {
		width: 100%;
		height: 100%;
		padding-top: 20px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	h2 {
		font-weight: normal;
	}

	.buttonHolder {
		margin-bottom: 1rem;
	}

	.role {
		position: relative;
		width: 90%;
		border: 1px solid var(--color);
		color: var(--textColor);
		border-radius: 7px;
		padding: 20px 10px;
		height: 70px;
		box-sizing: border-box;
		margin-bottom: 7px;
		display: flex;
		flex-direction: row;

		&::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0px;
			left: 0px;
			background: var(--color);
			opacity: 0.25;
			z-index: -1;
		}
	}

	.nameWrap {
		display: flex;
		font-weight: normal;
		margin: 0px;
		width: fit-content;
		flex-shrink: 1;
	}
	.name {
		all: unset;
		width: fit-content;
		font-size: 1.3rem;
		background: transparent;
		border: 1px solid transparent;

		&:focus {
			border: 1px solid var(--color);
			outline: 0px;
		}
	}

	.actions {
		position: absolute;
		right: 0px;
		top: 0px;
		flex-direction: row;
		display: flex;
		align-items: center;
		justify-content: end;
		height: 100%;
		flex-grow: 1;

		.color {
			all: unset;
			border: 0px;
			outline: 0px;
			cursor: pointer;
			height: 50%;
			aspect-ratio: 1/1;
			background: var(--color);
			border-radius: 100%;
			padding: 3px;
			box-sizing: border-box;
		}

		.button {
			all: unset;
			height: 50%;
			padding: 0px 10px;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			img {
				all: unset;
				height: 100%;
				aspect-ratio: 1/1;
			}
		}
	}

	input[type='color']::-moz-color-swatch {
		border: none;
		border-radius: 100%;
	}

	input[type='color']::-webkit-color-swatch {
		border: none;
	}

	.formItem {
		width: 100%;
		margin: 7px 0px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
