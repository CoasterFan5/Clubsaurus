<script lang="ts">
	export let data;

	import 'highlight.js/styles/github.css';

	import { Image } from '@unpic/svelte';
	import dayjs from 'dayjs';
	import hljs from 'highlight.js';
	import { onMount } from 'svelte';

	import ArticleStyles from '$lib/components/editor/ArticleStyles.svelte';
	import Link from '$lib/components/Link.svelte';
	import { sanitizeTiptapContent } from '$lib/utils/sanitizeTiptapContent.js';
	onMount(() => {
		hljs.highlightAll();
	});
	const keywords = data.article.tagAssignments.map((item) => `${item.tag.tagName}, `).join();
</script>

<svelte:head>
	<meta name="keywords" content={keywords} />
</svelte:head>

<div class="wrap">
	<ArticleStyles>
		<div class="article">
			<h1>{data.article.articleName}</h1>
			<div class="infoBox">
				<span>{dayjs(data.article.createdAt).format('MM/DD/YY')}</span>
				<span>{Math.floor(data.article.articleText.split(' ').length / 200)} min read</span>
			</div>
			{#if data.article.articleImage}
				<div class="displayedImage">
					<Image alt="Header" layout="fullWidth" src={data.article.articleImage} />
				</div>
			{/if}
			{@html sanitizeTiptapContent(data.article.articleText)}
			<hr />
			<p>
				Clubsaurus is developing the next generation of club management platforms. Our goal is to
				establish a hub for an organization's clubs, with a focus on student leadership, accessible
				information, and security. Pretty cool, right? <Link href="/get-started">Get Started</Link>
			</p>
		</div>
	</ArticleStyles>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.article {
		max-width: 60ch;
		font-size: 1.2rem;
		padding: 2.5ch;
		box-sizing: border-box;

		h1 {
			margin-bottom: 0;
		}

		.infoBox {
			color: var(--textLow);
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: space-between;
		}
	}

	.displayedImage {
		display: flex;
		border-radius: 0.5rem;
		overflow: hidden;
		margin-top: 1rem;
		margin-bottom: 2rem;
	}
</style>
