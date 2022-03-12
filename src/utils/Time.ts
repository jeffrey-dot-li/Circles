import { DateTime, Interval } from 'luxon';

export const getTimeDiffString = (millis1: number, millis2: number) => {
	const date1 = DateTime.fromMillis(millis1);
	const date2 = DateTime.fromMillis(millis2);
	const duration = Interval.fromDateTimes(date1, date2).toDuration();

	const durationUnits = [
		'years', 'months', 'days', 'hours', 'minutes',
	] as const;

	return durationUnits.reduce<string | false>((prev, current) => prev || (!!Math.floor(duration.as(current)) && `${Math.floor(duration.as(current))} ${current} ago`), false);
};

export const getTimeSinceMillisString = (instant: number) => getTimeDiffString(instant, DateTime.local().toMillis());
// Idk how this interacts with react state management and rerendering hmm.
