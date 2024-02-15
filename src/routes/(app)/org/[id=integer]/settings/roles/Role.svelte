<script lang="ts">
	import { enhance } from '$app/forms';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { tooltip } from '$lib/components/tooltips/tooltip';
	import { createOrgPermissionsCheck, orgPermissionObjectDescriptions, orgKeys, defaultOrgPermissionObject } from '$lib/orgPerms';
	import { toTitleCase } from '$lib/titleCase';

	export let role: {
		id: number;
		name: string;
		color: string;
		permissionInt: number;
	};

	let colorInput: HTMLInputElement;
	let submitButton: HTMLButtonElement;

	const valueChanged = () => {
		submitButton.click();
	};

	const openColorInput = () => {
		colorInput.click();
	};

	const openPermEditor = () => {
		showingPermEditor = !showingPermEditor
	}

	const permissionObject = createOrgPermissionsCheck(role.permissionInt)

	let dotColor = role.color;

	let showingPermEditor = false;

</script>

<form
	class="role"
	action="?/updateRole"
	method="post"
	style="--dotColor: {dotColor}"
	use:enhance={() => {
		// Keep all form data
		return async ({ update }) => {
			await update({ reset: false });
		};
	}}
>
	<div class="top">
		<div class="left" >
			<input name="roleId" hidden value={role.id} />
			<button  class="dot" on:click={openColorInput}>
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
			<button type="button" class="iconButton" on:click={openColorInput}>
				<img src="/icons/palette.svg" alt="palette" title="Color" use:tooltip={"Color"}>
			</button>
			<button type="button" class="iconButton" on:click={openPermEditor}>
				<img src="/icons/key.svg" alt="key" title="Permissions" use:tooltip={"Permissions"}>
			</button>
		</div>
	</div>
	<div class="bottom" class:invisible={!showingPermEditor}>
		{#each orgKeys as key}
			<div class="perm">
				<div class="permInner">
					<Checkbox label={toTitleCase(key)} bind:checked={permissionObject[key]}/>
					<p>{orgPermissionObjectDescriptions[key]}</p>
				</div>
				
			</div>
			
		{/each}
	</div>
	
	

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
		padding: 5px;
		height: 100%;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
		cursor: pointer;

		&::after {
			content: "";
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
	}

	.invisible {
		height: 0px;
		overflow: hidden;
	}
	
</style>