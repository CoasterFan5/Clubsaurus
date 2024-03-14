<script lang="ts">
	import type { LayoutData } from './$types';

	import BxsHome from '~icons/bxs/home';
	import BxCalendarAlt from '~icons/bx/calendar-alt';
	import BxBuilding from '~icons/bx/building';

	export let data: LayoutData;
</script>

<nav class="sidebar">
	<a class="pfp" href="/profile">
		<img class="pfpImage" alt="profile" src={data.user?.pfp || '/defaultPFP.png'} />
	</a>
	<a class="button" href="/dashboard">
		<BxsHome />
	</a>
	<a class="button" href="/calendar" aria-label="Calendar">
		<BxCalendarAlt />
	</a>
	<a class="button" href="/org">
		<BxBuilding />
	</a>
</nav>

<style lang="scss">
	.sidebar {
		width: 75px;
		padding: 12px;
		box-sizing: border-box;
		background: var(--bgPure);
		height: 100vh;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		z-index: 1000;
	}
	.pfp {
		display: flex;
		width: 100%;
		aspect-ratio: 1/1;
		border-radius: 5px;
		position: relative;
		overflow: hidden;

		&::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0px;
			left: 0px;
			background: var(--bgPure);
		}
	}
	.pfpImage {
		width: 100%;
		aspect-ratio: 1/1;
		resize: vertical;
		z-index: 3;
		border: 2px solid var(--accent);
		border-radius: 5px;
		opacity: 1;
		overflow: hidden;
		object-fit: cover;
	}

	.button {
		display: flex;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
		margin: 5px 0px;
		aspect-ratio: 1/1;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
		border-radius: 5px;

		&:hover {
			background: var(--accent50);
			border-radius: 5px;
		}

		:global(svg) {
			filter: var(--redIconFilter);
			aspect-ratio: 1/1;
			width: 100%;
			height: 100%;
		}
	}
</style>
