<script lang="ts">
	import dayjs from 'dayjs';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import dayOfYear from 'dayjs/plugin/dayOfYear';
	import timezone from 'dayjs/plugin/timezone';
	import utc from 'dayjs/plugin/utc';

	import BxChevronLeft from '~icons/bx/chevron-left';
	import BxChevronRight from '~icons/bx/chevron-right';
	import ClipboardIcon from '~icons/bx/clipboard';
	import BxPencil from '~icons/bx/pencil';
	import BxTrash from '~icons/bx/trash';
	import { enhance } from '$app/forms';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import { RRule } from '$lib/utils/rrule';

	import Button from './Button.svelte';
	import IconButton from './IconButton.svelte';
	import Modal from './Modal.svelte';
	import { tooltip } from './tooltips/tooltip';

	export let orgId: string | undefined = undefined;
	export let clubId: string | undefined = undefined;

	export let events: Event[] = [];
	export let allowAddEvent = false;
	/** If global, show club names instead of event nanes, but show club names in event subview. */
	export let global = false;

	let selectedDay = dayjs();

	dayjs.extend(dayOfYear);
	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.extend(advancedFormat);

	let day = dayjs();
	const emptyArray = (length: number) => Array(length).fill(0);

	// TODO: grab typing from prisma
	type Event = {
		id: number;
		createdAt: Date | null;
		updatedAt: Date | null;
		title: string;
		description: string | null;
		clubId: number;
		club: {
			name: string;
			organizationId: number;
		};
		authorId: number | null;
		date: string;
		color: string | null;
		exclusions: string[];
		draft: boolean;
	};

	const datesOnSameDay = (date1: dayjs.Dayjs) => (date2: dayjs.Dayjs) =>
		date1.dayOfYear() === date2.dayOfYear() && date1.year() === date2.year();

	$: daysActive = events
		.filter((event) => !event.draft)
		.map(
			(event) =>
				[
					event,
					RRule.fromString(event.date)
						.between(
							day.date(1).utc().subtract(1, 'week').toDate(),
							day.date(day.daysInMonth()).utc().add(1, 'week').toDate()
						)
						.map(dayjs)
				] as const
		);

	$: flattenedDaysActive = daysActive.flatMap(([, days]) => days);

	$: daysInMonth = emptyArray(day.daysInMonth()).map((_, i) => day.date(i + 1));

	$: startPaddingDays = emptyArray(day.date(1).day())
		.map((_, i) => day.date(-i))
		.reverse();

	$: lastDay = day.date(day.daysInMonth());

	$: endPaddingDays =
		lastDay.day() < 6
			? emptyArray(6 - lastDay.day()).map((_, i) => day.date(lastDay.date() + i + 1))
			: [];

	$: calendarDays = [...startPaddingDays, ...daysInMonth, ...endPaddingDays];
</script>

<div class="top">
	<div class="info">
		<div class="button">
			<Button value="Today" on:click={() => (day = dayjs())} />
		</div>
		<div class="arrowWrap">
			<button
				class="arrowButton"
				title="Previous"
				on:click={() => (day = day.subtract(1, 'month'))}
			>
				<BxChevronLeft />
			</button>
			<button class="arrowButton" title="Next" on:click={() => (day = day.add(1, 'month'))}>
				<BxChevronRight />
			</button>
		</div>
		<h1>{day.format('MMMM YYYY')}</h1>
	</div>
</div>
<div class="calendar">
	{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
		<div class="dayHeader">
			<p>{day}</p>
		</div>
	{/each}
	{#each calendarDays as loopDay (loopDay.toDate())}
		{@const inMonth = day.month() === loopDay.month()}

		{@const eventsOnThisDay = daysActive.filter(([, days]) => days.some(datesOnSameDay(loopDay)))}

		<div class="dayWrap">
			<button
				class="day"
				class:hasEvent={flattenedDaysActive.some(datesOnSameDay(loopDay))}
				class:inMonth
				on:click={() => {
					selectedDay = loopDay;
					pushState('', { showingModal: 'dayModal' });
				}}
			>
				<p>{loopDay.format('D')}</p>

				{#if eventsOnThisDay.length > 0}
					{@const event = eventsOnThisDay[0]}
					<div style="--customColor: {event[0].color ?? 'var(--accent)'}" class="inDisplayEvent">
						{#if global}
							{event[0].club.name}
						{:else}
							{event[0].title}
						{/if}
					</div>
					{#if eventsOnThisDay.length > 1}
						<div class="extraEvents">
							+{eventsOnThisDay.length - 1} more
						</div>
					{/if}
				{/if}
			</button>
		</div>
	{/each}
</div>
{#if $page.state.showingModal === 'dayModal'}
	<Modal on:close={() => history.back()}>
		{#if selectedDay !== null}
			<!-- Assure typescript that our selectedDay will remain the same in filter -->
			{@const selectedDayLocal = selectedDay}

			<h1>{selectedDay.format('MMMM D, YYYY')}</h1>
			{@const eventsOnThisDay = daysActive.filter(([, days]) =>
				days.some(datesOnSameDay(selectedDayLocal))
			)}
			{#if eventsOnThisDay.length === 0}
				<p>No events today.</p>
			{:else}
				{#each eventsOnThisDay as [event, days]}
					<div class="event">
						<div class="title">
							<h2>{event.title}</h2>
							<div class="edit">
								{#if allowAddEvent}
									<div use:tooltip={'Edit'}>
										<IconButton href="/org/{orgId}/club/{clubId}/events/manage/{event.id}">
											<BxPencil />
										</IconButton>
									</div>
									<div use:tooltip={'Delete'}>
										<IconButton
											on:click={() =>
												pushState('', { showingModal: 'deleteEvent', eventId: event.id })}
										>
											<BxTrash />
										</IconButton>
									</div>
									<div use:tooltip={'Attendance'}>
										<IconButton
											on:click={() => {
												pushState('', { showingModal: 'addAttendance', eventId: event.id });
											}}
										>
											<ClipboardIcon />
										</IconButton>
									</div>
								{/if}
							</div>
						</div>
						{#if global}
							<p class="subDescription">
								<a href="/org/{event.club.organizationId}/club/{event.clubId}">
									{event.club.name}
								</a>
							</p>
						{/if}
						<p class="subDescription">At {days[0].format('h:mm A')}</p>
						{#if event.description}
							<p>{event.description}</p>
						{/if}
					</div>
				{/each}
			{/if}

			{#if allowAddEvent}
				<Button
					href="/org/{orgId}/club/{clubId}/events/add?date={encodeURIComponent(
						selectedDay.utc().format()
					)}"
					value="Add Event"
				/>
			{/if}
		{/if}
	</Modal>
{/if}

{#if $page.state.showingModal === 'addAttendance'}
	<Modal on:close={() => history.back()}>
		{@const eventId = $page.state.eventId}
		{@const event = events.find((e) => e.id === eventId)}
		{#if event}
			<h1>Create attendance</h1>
			<p>This will allow you to take attendance for this event</p>
			<form
				action="/org/{$page.params.id}/club/{$page.params.clubId}/attendance?/create"
				method="post"
				use:enhance
			>
				{selectedDay.toDate().toISOString()}
				<input name="date" hidden value={selectedDay.toDate().toISOString()} />
				<input name="eventId" hidden value={eventId} />
				<Button type="submit" value="Create" />
			</form>
		{:else}
			<p>Event not found.</p>
		{/if}
	</Modal>
{/if}

{#if $page.state.showingModal === 'deleteEvent'}
	<Modal on:close={() => history.back()}>
		{@const eventId = $page.state.eventId}
		{@const event = events.find((e) => e.id === eventId)}
		{#if event}
			<h1>Delete Event <span class="accent">{event.title}</span></h1>
			<p>Are you sure you want to delete this event?</p>
			<p>This will delete the event for <b>everyone</b> who is in the club.</p>
			<div class="deleteOptions">
				<form action="/org/{orgId}/club/{clubId}/events?/delete" method="post" use:enhance>
					<input name="eventId" type="hidden" value={eventId} />
					<Button type="submit" value="Yes" />
				</form>
				<Button value="No" on:click={() => history.back()} />
			</div>
		{:else}
			<p>Event not found.</p>
		{/if}
	</Modal>
{/if}

<style lang="scss">
	.button {
		width: 25%;
	}

	.top {
		width: 100%;
		max-width: 100%;
		padding: 0px 20px;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		justify-content: space-between;
	}

	.info {
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
		margin: 10px 0px;
		height: 50px;

		.arrowWrap {
			height: 50px;
			flex-grow: 1;
			width: 100px;
			display: flex;
			align-items: center;
		}

		h1 {
			position: relative;
			display: block;
			margin: 0px;
			width: 100%;
		}

		button {
			all: unset;
			cursor: pointer;
			height: 75%;
			aspect-ratio: 1/1;
			box-sizing: border-box;
			border-radius: 50%;
			transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;

			&:hover {
				background: var(--accent50);
			}
		}
	}

	.inDisplayEvent {
		width: 100%;
		background: color-mix(in srgb, var(--customColor) 50%, white 50%);
		padding: 5px;
		box-sizing: border-box;
		border-radius: 3px;
		margin-bottom: 5px;
		overflow: hidden;
	}

	.calendar {
		width: 100vw;
		max-width: 100%;
		padding: 10px;
		gap: 0px;
		margin-top: 25px;

		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: auto repeat(4, 1fr);
		box-sizing: border-box;
	}

	.arrowButton :global(svg) {
		width: 100%;
		height: 100%;
	}

	.event {
		box-sizing: border-box;
		text-align: left;
		padding: 1rem;
		margin: 0.5rem 0;
		margin-top: 0;
		min-width: 20rem;
		max-width: 90vw;
		width: 100%;
		height: 100%;
		background-color: var(--bg);
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
		border: 0;
		border-radius: 0.5rem;

		.subDescription {
			color: var(--textLow);
			margin-top: 0;
		}

		h2 {
			margin: 0;
		}

		.title {
			margin-top: 1rem;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.edit {
				display: flex;
			}
		}
	}

	.dayWrap {
		box-sizing: border-box;
		background: var(--background);
		aspect-ratio: 3/2;
	}

	.day {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		box-sizing: border-box;
		flex-grow: 1;
		height: 98%;
		width: 98%;
		color: var(--textDark);

		background-color: #fff;
		border: 0;

		cursor: pointer;

		p {
			margin: 5px 0px;
			padding: 5px;
			box-sizing: border-box;
			font-size: 1rem;
			border-radius: 50%;
			aspect-ratio: 1/1;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&.hasEvent {
			margin: 0px;
			p {
				background: rgba(0, 0, 0, 0.22);
			}
		}

		&:not(.inMonth) {
			background-color: #ddd;
			opacity: 0.25;
		}

		&:hover {
			background-color: var(--bg);
			color: var(--textDark);
		}
	}

	.deleteOptions {
		display: flex;
		justify-content: space-between;
		width: 100%;
		gap: 10px;
	}

	.accent {
		color: var(--accent);
	}

	.dayHeader {
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--background);
		background-color: #dddddd22;
		height: 98%;
		width: 98%;
	}

	@media screen and (max-width: 500px) {
		.inDisplayEvent {
			display: none !important;
		}
		.day {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.button {
			display: none;
		}

		.extraEvents {
			display: none;
		}
	}
</style>
