<script lang="ts">
	import Simplify from './Simplify.svelte';
	import Connect from './Connect.svelte';
</script>

<div class="wrap">
	<div class="title">
		<h1>
			The <span class="coolText">modern</span> clublist that helps you
			<span class="coolText">connect</span>
		</h1>
		<a class="getStarted" href="/get-started"> Get Started </a>
	</div>
	<Simplify />
	<Connect />
</div>

<style lang="scss">
	h1 {
		text-align: center;
		padding: 0px 5rem;
	}

	.wrap {
		width: 100%;
	}

	.title {
		height: 100vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.getStarted {
		font-size: 1.5rem;
		padding: 10px 20px;
		margin: 20px;
		border-radius: 5px;
		border: 1px solid var(--accent);
		text-decoration: none;
		color: var(--textColor);
		transition: background cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;

		&:hover {
			background: var(--accent);
			color: var(--bg);
		}
	}

	.title h1 {
		margin: 0px;
		font-weight: 500;
		font-size: 3rem;
	}

	.coolText {
		color: var(--accent);
	}
</style>
