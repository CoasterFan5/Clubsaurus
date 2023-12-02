<script lang="ts">
	import { fly, fade } from "svelte/transition";


	import { removeToast, type Toast } from "./toaster";
	import { quintInOut, linear } from "svelte/easing";
	import { onMount } from "svelte";

	export let data: Toast;
	let showTimer = false;
	let hidden = false;
	console.log(data)

	let close = () => {
		hidden = true;
		setTimeout(() => {
			removeToast(data.id)
		}, 1000)
		
	}

	console.log(data.life)

	if(data.life && data.life > 0) {
		setTimeout(() => {
			console.log("toast expired")
			close()
		}, data.life)
	}
	
	onMount(() => {
		showTimer = true;
	})

	let typeTitles = {
		warn: "Warning",
		error: "Error",
		success: "Success"
	}
</script>

{#if !hidden}
	<div class="wrap" transition:fly={{delay: 0, duration: 500, x: 500, y: 0, opacity: 0.5, easing: quintInOut}}>
		<div class="toast" class:error={data.type == "error"} class:success={data.type == "success"} class:warn={data.type == "warn"}>
			
			<h3>{typeTitles[data.type]}</h3>
			<p>{data.message}</p>
			<button class="close" on:click={close}>
				<img src="/icons/x.svg" alt="close">
			</button>
			{#if showTimer}
				<div class="timer" style="animation-duration: {data.life}ms;" >

				</div>
			{/if}
		</div>
		
		
	</div>
{/if}


<style>
	.wrap {
		position: relative;
		margin-top: 10px;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;
	}
	.error {
		border-left: 5px solid var(--accent);
	}
	.success {
		border-left: 5px solid rgb(47, 255, 57);
	}
	.warn {
		border-left: 5px solid rgb(235, 235, 0);
	}
	.toast {
		padding: 10px 30px;
		background: var(--bgPure);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;
		border-radius: 5px;
		width: 400px;
	}
	h3 {
		margin: 5px 0px;
	}
	p {
		margin: 0px;
	}
	.close {
		all: unset;
		cursor: pointer;
		font-size: 1.2rem;
		position: absolute;
		top: 0px;
		right: 0px;
		padding: 2px;
	}
	.close img {
		width: 30px;
	}
	@keyframes closebar {
		from { width: 100%;}
		to { width: 0%;}
	}
	.timer {
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 0%;
		height: 3px;
		background: var(--mid);
		animation-timing-function: linear;
		animation-name: closebar;
	}
	
</style>