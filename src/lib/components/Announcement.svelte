<script lang="ts">
	import { sanitizeTiptapContent } from '$lib/utils/sanitizeTiptapContent';

	import ArticleStyles from './editor/ArticleStyles.svelte';
	interface Announcement {
		title: string;
		description: string | null;
		createdAt: Date | null;
		author: {
			firstName: string;
			lastName: string;
		} | null;
	}

	export let announcement: Announcement;
</script>

<div class="announcement">
	<h2>{announcement.title}</h2>
	{#if announcement.createdAt}
		<p class="info">
			{new Intl.DateTimeFormat('en-US', {
				dateStyle: 'long',
				timeStyle: 'short'
			}).format(announcement.createdAt)}
			{#if announcement.author}
				<span>by {announcement.author?.firstName} {announcement.author?.lastName}</span>
			{/if}
		</p>
	{/if}
	<ArticleStyles>
		<div class="article">
			{@html sanitizeTiptapContent(announcement.description || 'No description')}
		</div>
	</ArticleStyles>
</div>

<style lang="scss">
	.announcement {
		width: 100%;
		background: var(--bgPure);
		box-sizing: border-box;
		padding: 20px;
		border-radius: 5px;
		background: var(--bgMid);
		margin: 0.5rem 0;
	}
	.info {
		margin: 0px;
		color: var(--textLow);
	}
	h2 {
		margin: 0px;
		font-size: 1.5rem;
		font-weight: 500;
	}
</style>
