<script lang="ts">
	import { enhance } from '$app/forms';
	import Announcement from '$lib/components/Announcement.svelte';
	import MdEditor from '$lib/components/editor/MdEditor.svelte';
	import { handleForm } from '$lib/utils/formToaster.js';

	export let data;
	export let form;

	let clubDescription = data.club.description || `<h1>${data.club.name}</h1>`;
	let saveMdButton: HTMLButtonElement;

	$: handleForm(form, 'Club Updated!');
</script>

<div class="wrap">
	<div class="content">
		<div class="editor">
			<MdEditor
				editable={data.clubPerms.admin || data.clubPerms.updateDescription}
				saveable={data.clubPerms.admin || data.clubPerms.updateDescription}
				bind:content={clubDescription}
				on:saveRequest={() => {
					saveMdButton.click();
				}}
			/>
			<form action="?/updateClub" hidden method="post" use:enhance>
				<input name="clubDescription" value={clubDescription} />
				<button bind:this={saveMdButton} type="submit" />
			</form>
		</div>
	</div>
	{#if data.club.announcements.length > 0}
		<h2 class="announcementsTitle">Recent Announcements</h2>

		<div class="announcements">
			{#each data.club.announcements.slice(0, 3) as announcement}
				<Announcement {announcement} />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.wrap {
		height: 100%;
		width: 90%;
		box-sizing: border-box;
		padding-top: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}

	.announcementsTitle {
		margin-top: 2rem;
	}

	.announcements {
		margin-top: 2rem;
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}

	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;
	}

	.editor {
		position: relative;
		width: 100%;
		height: 100%;
	}
</style>
