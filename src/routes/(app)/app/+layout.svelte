<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import type { SVGAttributes } from 'svelte/elements';
	import { page } from '$app/state';
	// Icons
	import UserIcon from '~icons/ph/user-circle';
	import DashboardIcon from '~icons/ph/squares-four';
	import CalendarIcon from '~icons/ph/calendar-blank';
	import CubeIcon from '~icons/ph/cube';

	export const {
		data,
		children
	}: {
		data: LayoutData;
		children: Snippet;
	} = $props();
</script>

{#snippet navbarButton(
	href: string,
	Icon: Component<SVGAttributes<SVGSVGElement>>,
	text: string,
	path: string
)}
	<a {href} class="navButton" class:active={page.route.id === path}>
		<div class="icon">
			<Icon />
		</div>
		<div class="text">
			{text}
		</div></a
	>
{/snippet}

<div class="wrap">
	<nav class="navbar">
		{@render navbarButton(
			'/app',
			UserIcon,
			`${data.user.firstName} ${data.user.lastName}`,
			'/app/account'
		)}
		{@render navbarButton('/app', DashboardIcon, `Dashboard`, '/(app)/app')}
		{@render navbarButton('/app', CalendarIcon, `Calendar`, '/app/calendar')}
		{@render navbarButton('/app', CubeIcon, `Your Organizations`, '')}
	</nav>
	<div class="content">
		{page.route.id}
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: row;
		height: 100%;
		width: 100%;
	}

	.navbar {
		padding: 1rem;
		border-right: 1px solid rgba(0, 0, 0, 0.1);
		width: 15rem;
	}

	.navButton {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		gap: 0.5rem;
		color: var(--text);
		text-decoration: none;
		padding: 0.25rem;
		cursor: pointer;
		width: 100%;
		border-radius: 0.25rem;

		&:hover {
			background: rgba(0, 0, 0, 0.05);
		}

		&.active {
			color: var(--accent);
			font-weight: 500;

			&:hover {
				background: var(--accent10);
			}
		}

		.icon {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
