<script lang="ts">
	import { qr } from '@svelte-put/qr/img';
	import Fuse from 'fuse.js';
	
	import BxExit from '~icons/bx/exit?raw&width=1.5em&height=1.5em';
	import BxUserPlus from '~icons/bx/user-plus?raw&width=1.5em&height=1.5em';
	import BxShare from '~icons/bx/share?raw&width=1.5em&height=1.5em';
	import BxBxsCog from '~icons/bx/bxs-cog?raw&width=1.5em&height=1.5em';

	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import ClubList from '$lib/components/ClubList.svelte';
	import Input from '$lib/components/Input.svelte';
	import Link from '$lib/components/Link.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { addToast } from '$lib/components/toaster';
	import { tooltip } from '$lib/components/tooltips/tooltip.js';
	import { handleForm } from '$lib/utils/formToaster.js';
	let searchTerm = '';

	export let data;
	export let form;

	let showModal = () => {
		pushState('', {
			showingModal: 'createClub'
		});
	};

	const fuse = new Fuse(data.clubs, {
		keys: ['name', 'description']
	});

	let sortedClubs: typeof data.clubs;
	$: if (searchTerm.length > 0) {
		sortedClubs = fuse.search(searchTerm).map((result) => result.item);
	} else {
		sortedClubs = data.clubs;
	}

	const startLeaveOrg = () => {
		pushState('', {
			showingModal: 'leaveOrg'
		});
	};

	const startInvite = () => {
		pushState('', {
			showingModal: 'inviteUser'
		});
	};

	const addShareModel = () => {
		addToast({
			type: 'success',
			message: 'Sharing is caring!',
			life: 5000
		});

		window.removeEventListener('mousedown', addShareModel);
		window.removeEventListener('focus', addShareModel);
	};

	const startShare = async () => {
		let shareUrlId = data.org.slug?.slug || data.org.id;
		let shareUrl = `${window.origin}/org/${shareUrlId}`;

		try {
			await navigator.share({
				url: shareUrl
			});
			window.addEventListener('mousedown', addShareModel);
			window.addEventListener('focus', addShareModel);
		} catch (e) {
			try {
				navigator.clipboard.writeText(shareUrl);
				addToast({
					type: 'success',
					message: 'URL copied to clipboard',
					life: 3000
				});
			} catch (e2) {
				addToast({
					type: 'error',
					message: 'Your web browser settings disallow sharing.',
					life: 3000
				});
			}
		}
	};

	$: handleForm(form);

	let confirmedOrgName = '';
	let inviteMethod = 'code';
</script>

{#if $page.state.showingModal == 'inviteUser'}
	<Modal
		on:close={() => {
			history.back();
		}}
	>
		<div class="invite">
			<h2>Invite</h2>
			<div class="inviteNav">
				<button
					class="inviteMethodButton"
					class:active={inviteMethod == 'code'}
					on:click={() => {
						inviteMethod = 'code';
					}}>Code</button
				>
				<button
					class="inviteMethodButton"
					class:active={inviteMethod == 'link'}
					on:click={() => {
						inviteMethod = 'link';
					}}>Link</button
				>
				<button
					class="inviteMethodButton"
					class:active={inviteMethod == 'qr'}
					on:click={() => {
						inviteMethod = 'qr';
					}}>QR</button
				>
			</div>
			<div class="joinContent">
				{#if inviteMethod == 'code'}
					<p>Join Code (Click to copy):</p>
					<button
						class="hiddenButton"
						on:click={() => {
							navigator.clipboard.writeText(data.org.joinCode);
							addToast({
								type: 'success',
								message: 'Copied to clipboard!',
								life: 3000
							});
						}}>{data.org.joinCode}</button
					>
				{/if}
				{#if inviteMethod == 'link'}
					<p>Join Link (Click to copy):</p>
					<button
						class="hiddenButton"
						on:click={() => {
							navigator.clipboard.writeText(
								`${window.location.origin}/invite/${data.org.joinCode}`
							);
							addToast({
								type: 'success',
								message: 'Copied to clipboard!',
								life: 3000
							});
						}}>{window.location.origin}/invite/{data.org.joinCode}</button
					>
				{/if}
				{#if inviteMethod == 'qr'}
					<p>Join QR Code:</p>
					<img
						alt="qr"
						use:qr={{
							data: `${window.location.origin}/invite/${data.org.joinCode}`,
							logo: `${window.location.origin}/logo.svg`,
							shape: 'circle'
						}}
					/>
				{/if}
			</div>
		</div>
		<Button
			value="Done"
			on:click={() => {
				history.back();
			}}
		/>
	</Modal>
{/if}

{#if $page.state.showingModal == 'leaveOrg'}
	<Modal
		on:close={() => {
			history.back();
		}}
	>
		<form action="?/leaveOrg" method="post" use:enhance>
			<h2>Hold Up!</h2>
			<p>Are you sure you want to leave this organization?</p>
			<p>All your data and permissions will be lost forever</p>
			<p>Type the name of the organization, <br /><b>{data.org.name}</b>, to confirm</p>
			<div class="formItem">
				<Input bg="white" label="Organization Name" bind:value={confirmedOrgName} />
			</div>
			<div class="formItem">
				<Button disabled={confirmedOrgName != data.org.name} value="Leave {data.org.name}" />
			</div>
		</form>
	</Modal>
{/if}

{#if $page.state.showingModal == 'createClub'}
	<Modal on:close={() => history.back()}>
		<form action="?/createClub" method="post" use:enhance>
			<h2>Create Club</h2>
			<div class="formItem">
				<Input name="clubName" bg="white" label="Club Name" />
			</div>
			<div class="formItem">
				<Button type="submit" value="Create" />
			</div>
		</form>
	</Modal>
{/if}

<header>
	<h1>{data.org.name}</h1>
	<div class="orgButtons">
		{#if data.orgUserPermissions.viewSettings || data.orgUserPermissions.admin}
			<a href="/org/{data.org.id}/settings" aria-label="settings" use:tooltip={'Settings'} class="icon">
				{@html BxBxsCog}
			</a>
		{/if}
		{#if data.orgUserPermissions.inviteMembers || data.orgUserPermissions.admin}
			<button on:click={startInvite} aria-label="invite" use:tooltip={'Invite'} class="icon">
				{@html BxUserPlus}
			</button>
		{/if}

		{#if data.orgUser}
			<button on:click={startLeaveOrg} aria-label="leave" use:tooltip={'Leave'} class="icon">
				{@html BxExit}
			</button>
		{/if}

		{#if data.org.isPublic}
			<button on:click={startShare} aria-label="share" use:tooltip={'Share'} class="icon">
				{@html BxShare}
			</button>
		{/if}
	</div>
</header>

<main>
	{#if data.clubs.length < 1 && data.orgUser}
		<h2>
			No clubs here yet. {#if data.orgUserPermissions.createClubs || data.orgUserPermissions.admin}<button
					class="textButton"
					on:click={showModal}>Create One?</button
				>{/if}
		</h2>
	{:else}
		<div class="clubs">
			<input
				class="search"
				placeholder="Search for clubs..."
				tabindex="-1"
				bind:value={searchTerm}
			/>
			{#if sortedClubs.length > 0}
				<ClubList clubs={sortedClubs} />
			{:else}
				<h2>No clubs found. Try searching for something else.</h2>
			{/if}
		</div>

		{#if data.orgUserPermissions.createClubs || data.orgUserPermissions.admin}
			<p class="createOrgLink">
				Looking for more? <Link on:click={showModal}>Create a club!</Link>
			</p>
		{/if}
	{/if}
</main>

<style lang="scss">
	.icon {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			// color: var(--redIconFilter);
			:global(*) {
				color: var(--accent);
			}
		}
	}

	main {
		width: calc(90%);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
	}

	.invite {
		width: 100%;
		min-height: 450px;
		text-align: center;
		font-size: 1.2rem;
		color: var(--textLow);
	}

	.invite h2 {
		margin: 0px;
		color: var(--textDark);
	}

	header {
		background: var(--bgMid);
		width: 100%;
		padding: 25px 0px;
		box-sizing: border-box;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		justify-content: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		max-width: 100%;
		flex-wrap: wrap;
		a {
			all: unset;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			padding: 0px 5px;
		}
		button {
			all: unset;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			padding: 0px 5px;
		}
		h1 {
			margin: 0px 25px;
		}

		.orgButtons {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			padding: 10px 0px;
			box-sizing: border-box;
		}
	}

	.inviteNav {
		width: 100%;
		background: var(--bg);
		border-radius: 50px;
		display: flex;
		overflow: hidden;
		flex-direction: row;
		margin: 10px 0px;

		button {
			all: unset;
			cursor: pointer;
			color: var(--textDark);
			padding: 10px 30px;
			box-sizing: border-box;
			width: calc(100% / 3);
			flex-grow: 1;
			text-align: center;
			margin: 0px;
			font-size: 1.2rem;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

			&.active {
				background: var(--accent50);
				opacity: 0.5;
			}

			&:hover {
				background: var(--accent50);
			}
		}
	}

	.joinContent {
		margin: 10px 0px;

		p {
			margin: 5px 0px;
		}
	}

	.hiddenButton {
		all: unset;
		display: inline-block;
		font-weight: 500;
		padding: 5px 10px;
		border-radius: 3px;
		font-size: 1.2rem;
		background: var(--textLow);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;

		&:hover {
			cursor: pointer;
			background: var(--text);
		}
	}

	.textButton {
		all: unset;
		display: inline-block;
		color: var(--accent);
		font-weight: 500;

		&:hover {
			cursor: pointer;
			background: var(--text);
		}
	}

	.formItem {
		margin: 7px;
	}

	input {
		width: 100%;
		flex-grow: 1;
		box-sizing: border-box;
		margin: 2rem 0px;
		background: var(--bgPure);
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s;
		border: 0px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		outline: 0px;
		padding: 10px 10px 10px 40px;
		border-radius: 5px;
		font-size: 1.2rem;
		background-image: url('/search.svg');
		background-position: 10px 10px;
		background-repeat: no-repeat;

		&:hover,
		&:focus,
		&:active {
			outline: 1px solid var(--accent);
			cursor: text;
		}
	}

	.createOrgLink {
		text-align: center;
	}
</style>
