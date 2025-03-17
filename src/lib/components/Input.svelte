<script lang="ts">
	const {
		label,
		placeholder,
		name,
		isSecret = false
	}: {
		label: string;
		placeholder: string;
		name?: string;
		isSecret?: boolean;
	} = $props();
</script>

<label>
	{label}
	{#if isSecret}
		<input {name} type="password" {placeholder} />
	{:else}
		<input {name} {placeholder} />
	{/if}
</label>

<style lang="scss">
	label {
		display: flex;
		flex-direction: column;
		font-size: 0.8rem;
	}

	input {
		padding: 0.25rem;
		border-radius: 0.25rem;
		outline: 0px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		font-size: 1rem;
		font-family: var(--font);
		transition: all var(--transition);

		&:focus {
			border: 1px solid rgba(0, 0, 0, 0.3);
		}
	}
</style>
