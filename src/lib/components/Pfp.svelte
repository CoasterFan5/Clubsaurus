<script lang="ts">
	export let pfp: string | null;
	export let height = '24px';
	export let borderRadius = '50%';
	export let marginRight = '10px';
</script>

<img
	style="height: {height}; border-radius: {borderRadius}; margin-right: {marginRight}"
	class="pfp"
	alt="profile"
	src={pfp || '/defaultPFP.png'}
/>

<style lang="scss">
	.pfp {
		border: 1px solid var(--accent);
		aspect-ratio: 1 / 1;
		object-fit: cover;
	}
</style>
