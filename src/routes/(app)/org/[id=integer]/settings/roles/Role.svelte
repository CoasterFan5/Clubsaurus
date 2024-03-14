<script lang="ts">
	import { tick } from 'svelte';

	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { tooltip } from '$lib/components/tooltips/tooltip';
	import {
		createOrgPermissionsCheck,
		orgKeys,
		orgPermissionObjectDescriptions
	} from '$lib/permissions/orgPermissions';
	import BxKey from '~icons/bx/key';
	import BxPalette from '~icons/bx/palette';
	import BxTrashAlt from '~icons/bx/trash-alt';
	import { createPermissionsNumber } from '$lib/permissions/permissions';
	import { toTitleCase } from '$lib/titleCase';

	export let role: {
		id: number;
		name: string;
		color: string;
		permissionInt: number;
	};

	let colorInput: HTMLInputElement;
	let submitButton: HTMLButtonElement;
	let permissionIntInput: string;

	const valueChanged = () => {
		tick().then(() => {
			submitButton.click();
		});
	};

	const openColorInput = () => {
		colorInput.click();
	};

	const openPermEditor = () => {
		showingPermEditor = !showingPermEditor;
	};

	let permissionIntCalculated = role.permissionInt;

	const permissionObject = createOrgPermissionsCheck(role.permissionInt);

	$: if (permissionObject) {
		permissionIntInput = createPermissionsNumber(permissionObject).toString();
		if (createPermissionsNumber(permissionObject) != permissionIntCalculated) {
			tick().then(() => submitButton.click());
		}
	}

	let deleting = false;

	const deleteRole = () => {
		pushState('', {
			showingModal: 'delete'
		});
		deleting = true;
	};

	let dotColor = role.color;

	let showingPermEditor = false;
</script>

{#if $page.state.showingModal === 'delete' && deleting}
	<Modal
		on:close={() => {
			history.back();
			deleting = false;
		}}
	>
		<form class="wrapForm" action="?/deleteRole" method="POST" use:enhance>
			<h2>Are you sure?</h2>
			<p>Deleting <strong>{role.name}</strong> will leave any users with this role with no role.</p>
			<input name="roleId" hidden value={role.id} />
			<Button value="Delete" />
		</form>
	</Modal>
{/if}

<form
	style="--dotColor: {dotColor}"
	class="role"
	action="?/updateRole"
	method="post"
	use:enhance={() => {
		// Keep all form data
		return async ({ update }) => {
			await update({ reset: false });
		};
	}}
>
	<div class="top">
		<div class="left">
			<input name="roleId" hidden value={role.id} />
			<button class="dot" on:click={openColorInput}>
				<input
					bind:this={colorInput}
					name="color"
					class="colorInput"
					type="color"
					on:change={valueChanged}
					bind:value={dotColor}
				/>
			</button>
			<input
				name="name"
				class="nameBox"
				autocomplete="off"
				placeholder="New Role"
				value={role.name}
				on:change={valueChanged}
			/>
		</div>
		<div class="right">
			<button class="iconButton" type="button" on:click={deleteRole}>
				<BxTrashAlt />
			</button>
			<button class="iconButton" type="button" on:click={openColorInput} use:tooltip={'Color'} aria-label="Color">
				<BxPalette />
			</button>
			<button class="iconButton" type="button" on:click={openPermEditor} use:tooltip={'Permissions'} aria-label="Permissions">
				<BxKey />
			</button>
		</div>
	</div>
	<div class="bottom" class:invisible={!showingPermEditor}>
		{#each orgKeys as key}
			<div class="perm">
				<div class="permInner">
					<Checkbox name={null} label={toTitleCase(key)} bind:checked={permissionObject[key]} />
					<p>{orgPermissionObjectDescriptions[key]}</p>
				</div>
			</div>
		{/each}
	</div>

	<input name="permissionInt" hidden bind:value={permissionIntInput} />

	<button bind:this={submitButton} hidden type="submit" />
</form>

<style lang="scss">
	.role {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: start;
		justify-content: start;
		padding: 10px 10px;
		box-sizing: border-box;
		border-radius: 3px;
		margin-bottom: 10px;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		background: var(--bgPure);
		overflow: hidden;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}

	.top {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
	.bottom {
		height: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: start;
		justify-content: start;

		.perm {
			border-radius: 5px;
			width: 33%;
			box-sizing: border-box;
			min-width: 200px;
			flex-grow: 1;
			padding: 5px;

			.permInner {
				background: var(--bgMid);
				display: flex;
				flex-direction: column;
				align-items: start;
				justify-content: start;
				padding: 5px;
				border-radius: 3px;
				box-sizing: border-box;
				box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
				outline: 1px solid rgba(0, 0, 0, 0.1);

				p {
					margin: 0px;
					padding: 5px;
				}
			}
		}
	}
	.left {
		width: 100%;
		flex-wrap: nowrap;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
	}
	.right {
		flex-wrap: nowrap;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: end;
	}

	.dot {
		all: unset;
		cursor: pointer;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		aspect-ratio: 1/1;
		background: var(--dotColor);
		margin-right: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.colorInput {
		all: unset;
		height: 1px;
		width: 1px;
		background: transparent;
		position: absolute;
		z-index: -1;
	}

	.nameBox {
		all: unset;
		padding: 0px;
		display: flex;
		text-align: start;
		align-items: start;
		justify-content: start;
		border: 1px solid transparent;
		padding: 3px;
		border-radius: 3px;
		font-size: 1.1rem;

		&:hover {
			border: 1px solid var(--accent50);
		}

		&:focus,
		&:active {
			border: 1px solid var(--accent);
		}
	}

	.iconButton {
		all: unset;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		aspect-ratio: 1/1;
		padding: 3px;
		height: 100%;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
		cursor: pointer;

		&::after {
			content: '';
			position: absolute;
			height: 100%;
			left: 100%;
			top: 0px;
			left: 0px;
			aspect-ratio: 1/1;
			opacity: 0.5;
			border-radius: 5px;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		}

		&:hover::after {
			background: var(--dotColor);
			z-index: -1;
		}

		:global(svg) {
			width: 100%;
			height: 100%;
		}
	}

	.invisible {
		height: 0px;
		overflow: hidden;
	}
</style>
