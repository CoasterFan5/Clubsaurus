<script lang="ts">
	import { page } from '$app/stores';

	let baseUrl = `/org/${$page.params.id}/club/${$page.params.clubId}/settings`;
</script>

<div class="wrap">
	<div class="leftBar">
		<a class="link" href={baseUrl}>General</a>
		<a class="link" href="{baseUrl}/roles">Roles</a>
	</div>
	<div class="content">
		<slot />
	</div>
</div>

<style lang="scss">
	.wrap {
		padding-top: 50px;
		padding-bottom: 50px;
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: row;
		box-sizing: border-box;
	}
	.content {
		width: 100%;
	}
	.leftBar {
		width: 200px;
		padding: 10px 20px;
		box-sizing: border-box;
		height: 100%;
		text-align: left;
		background: var(--bgPure);
		border-radius: 5px;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
	}
	.link {
		padding: 5px 0px;
		font-size: 1.15rem;
		color: var(--textColor);
		text-decoration: none;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
	}
	.link:hover {
		color: var(--accent);
	}
</style>
