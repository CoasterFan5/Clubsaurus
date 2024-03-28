<script lang="ts">
	import { enhance } from '$app/forms';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { tooltip } from '$lib/components/tooltips/tooltip';

	export let attendanceEvent: {
		id: number;
		createdAt: Date;
		updatedAt: Date;
		clubId: number;
	};
	export let attendanceMember: {
		user: {
			firstName: string;
			lastName: string;
			pfp: string | null;
			id: number;
			attendanceMarks: {
				attendanceEvent: {
					id: number;
					createdAt: Date;
					updatedAt: Date;
					clubId: number;
				};
			}[];
		};
	};

	let formSubmitButton: HTMLButtonElement;

	const changeData = () => {
		formSubmitButton.click();
	};

	let exists = false;

	$: if (attendanceMember) {
		exists = attendanceMember.user.attendanceMarks.find(
			(item) => item.attendanceEvent.id == attendanceEvent.id
		)
			? true
			: false;
	}
</script>

<div
	class="wrap"
	use:tooltip={`${attendanceMember.user.firstName} ${attendanceMember.user.lastName}`}
>
	<Checkbox
		checked={exists}
		label="{attendanceMember.user.firstName} {attendanceMember.user.lastName}"
		on:click={changeData}
	/>
</div>

<form action="?/changeAttendance" hidden method="post" use:enhance>
	<input name="userId" bind:value={attendanceMember.user.id} />
	<input name="eventId" bind:value={attendanceEvent.id} />
	<button bind:this={formSubmitButton} />
</form>

<style lang="scss">
	.wrap {
		margin-left: -7px;
		width: 100%;
		text-wrap: nowrap;
		display: flex;
		overflow-x: hidden;
	}
</style>
