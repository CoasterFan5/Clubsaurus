<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import ModelHelper from '$lib/modules/ModelHelper.svelte';
	import type { PageData } from './$types';
	import MdEditor from '$lib/components/MdEditor.svelte';
	
	export let data: PageData;
	let clubDescription = data.club.description

	let visibileModel = false;
	let editor: MdEditor;

	let startEdit = () => {
		editing = true;
		console.log("clicked")
	}

	let showModel = () => {
		visibileModel = true;
	}

	let editing = false;
	console.log(data.clubPerms)
</script>

<ModelHelper bind:showing={visibileModel}>
	<form class="settingsForm" method="post" action="?/updateClub">
		<h2>Settings</h2>
		<div class="formItem">
			<Input name="clubName" label="Club Name" value={data.club.name}/>
		</div>
		<div class="formItem">
			<Input name="imageURL" label="Image URL" value={data.club.imageURL || undefined}/>
		</div>
		<div class="formItem">
			<Button value="Update"/>
		</div>
		
	</form>
</ModelHelper>

<div class="wrap">
	<div class="header">
		<img class="headerImage" src="{data.club.imageURL}" alt="{data.club.name + " image"}">
		<h1 class="title">{data.club.name}</h1>
		{#if data.clubPerms.admin || data.clubPerms.updateAppearance}
			<div class="toolbar">
				<button on:click={showModel}>
					<img src="/settings.svg" alt="settings">
				</button>
				
			</div>
		{/if}
	</div>
	<div class="content">
		<div class="editor">
			{#if data.clubPerms.admin || data.clubPerms.updateDescription}
				<div class="editTools">
					{#if !editing}
					<button class="editButton" on:click={startEdit}>
						<img src="/edit.svg" alt="edit">
					</button>
					{:else}
					<form method="post" action="?/updateClub">
						<input name="clubDescription" bind:value={clubDescription} style="display: none;">
						<button class="editButton" on:click={startEdit}>
							<img src="/check.svg" alt="edit">
						</button>
					</form>
					
					{/if}
				</div>
			{/if}
			{#if data.clubPerms.admin || data.clubPerms.updateDescription}
				<MdEditor bind:content={clubDescription} bind:editable={editing} bind:this={editor}/>
			{:else}
				<div class="description">
					{@html clubDescription}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.wrap {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding: 1rem 5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}
	.header {
		position: relative;
		width: 100%;
		aspect-ratio: 3/1;
		border-radius: 15px;
		overflow: hidden;
	
	}
	.headerImage {
		position: absolute;
		max-width: 100%;
		width: 100%;
		height: 100%;
		z-index: -1;
		
		object-fit: cover;
	}
	
	.title {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
		margin: 0px;
		background: rgba(255, 255, 255, 0.75);
		font-weight: 400;
	}
	.toolbar {
		position: absolute;
		bottom: 0px;
		right: 0px;
		padding: 7px;
	}
	.toolbar button {
		all: unset;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		border-radius: 100%;
		cursor: pointer;
	}
	.toolbar img {
		max-width: 36px;
	}
	.toolbar button:hover {
		rotate: 30deg;
	}
	.settingsForm {
		background: var(--bgPure);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 20px;
		border-radius: 5px;
	}
	.formItem {
		margin: 7px 0px;
		width: 100%;
	}
	.content {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: center;
		min-height: 300px;
	}
	.editor {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 300px;
	}
	.editTools {
		position: absolute;
		top: 32px;
		right: 0px;
		z-index: 100;
	}
	.editTools img {
		
		aspect-ratio: 1/1;
	}
	.editButton {
		all: unset;
		display: flex;
		width: 32px;
		height: 32px;
		cursor: pointer;
		
	}

	/*Define tiptap styles*/
</style>