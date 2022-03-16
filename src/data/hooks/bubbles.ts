import { useCallback, useMemo } from 'react';
import { useDatabaseConnection } from '../connexion';
import { SchemaToData, SchemaToDataPartial } from '../entities/NoteModel';
import { useAppDispatch, useAppSelector } from '~/store/types';
import { AddBubble, DatabaseFetchedAction, DeleteBubble, SetBubbles, UpdateBubble } from '~/store/bubbles/types';
import type { CircleData, PartialCircle, SavedCircleData } from '~/types/Circles';
import { Vec } from '~/utils/svg';
import { GenerateVelocity } from '~/utils/bouncing';
import { TypedEntries } from '~/utils/core';
import { fromHex } from '~/utils/color';
import { getRandomColor } from '~/static/theme';
type CreateCircleData = Omit<CircleData, 'popped' | 'position' | 'velocity'>;
export const DefaultCreateCircleData = (): CreateCircleData => {
	const r = Math.random();
	return ({
		content: '',
		title: '',
		radius: 80 + 100 * r,
		color: getRandomColor(r),
	});
};

const generateCircleData = (c: CreateCircleData): CircleData =>
	({
		...c,
		popped: false,
	});

export function useCreateCircles() {
	const { notesRepository } = useDatabaseConnection();
	const dispatch = useAppDispatch();
	const createCircle = useCallback(async(c: CreateCircleData | null = null) => {
		const generateCircle = generateCircleData(c || DefaultCreateCircleData());
		const note = await notesRepository.create(generateCircle);
		dispatch({
			type: AddBubble,
			circleData: SchemaToData(note),
		});
		return note;
	}, [notesRepository]);
	return createCircle;
}

export function useDeleteCircle() {
	const { notesRepository } = useDatabaseConnection();
	const dispatch = useAppDispatch();
	const deleteCircle = useCallback(async(id: string) => {
		const result = notesRepository.delete(id);
		await result;
		return dispatch({
			type: DeleteBubble,
			id,
		});
	}, [notesRepository]);
	return deleteCircle;
}

export function useUpdateCircle() {
	const { notesRepository } = useDatabaseConnection();
	const dispatch = useAppDispatch();
	const updateCircle = useCallback(async(c: PartialCircle, id: string) => {
		const result = await notesRepository.update(c, id);
		// TODO: Handle Error
		if (result.error)
			return;
		return dispatch({
			type: UpdateBubble,
			circleData: SchemaToDataPartial(result.result),
			id: result.result.id,
		});
	}, [notesRepository]);
	return updateCircle;
}

export function useLoadCircles() {
	const { notesRepository } = useDatabaseConnection();
	const bubblesState = useAppSelector(s => s.bubbles);
	const dispatch = useAppDispatch();
	const loadNotesFromDatabase = useCallback(async(force?: boolean) => {
		if (!bubblesState.databaseFetched || force) {
			dispatch({
				type: DatabaseFetchedAction,
			});
			const circleDatas: SavedCircleData[] = (await notesRepository.getAll()).map(SchemaToData);
			dispatch({
				type: SetBubbles,
				circleDatas,
			});
		}
	}, [notesRepository]);
	return loadNotesFromDatabase;
}

export type BubbleRecord = [string, SavedCircleData];
export interface UseBubblesOptions {
	filter?: (c: BubbleRecord) => boolean
	sort?: (a: BubbleRecord, b: BubbleRecord) => number
	filterInv?: boolean
	sortInv?: boolean
}

export const BubbleFilters = {
	active: (c: BubbleRecord) => !c[1].popped,
} as const;

export const BubbleSorters = {
	createdAtRecent: (a: BubbleRecord, b: BubbleRecord) => b[1].metadata.createdAt - a[1].metadata.createdAt,
	updatedAtRecent: (a: BubbleRecord, b: BubbleRecord) => b[1].metadata.updatedAt - a[1].metadata.updatedAt,
	alphabetical: (a: BubbleRecord, b: BubbleRecord) => a[1].title.localeCompare(b[1].title),
	size: (a: BubbleRecord, b: BubbleRecord) => b[1].radius - a[1].radius,
} as const;

export function useBubbles({ filter, sort, filterInv, sortInv }: UseBubblesOptions = {}) {
	const bubblesState = useAppSelector(s => s.bubbles);
	const bubbles = useMemo(() => {
		let bubbles = TypedEntries(bubblesState.circleDatas);
		if (filter)
			bubbles = bubbles.filter(filterInv ? c => !filter(c) : filter);

		if (sort)
			bubbles = bubbles.sort(sortInv ? (a, b) => sort(b, a) : sort);

		return bubbles;
	}, [bubblesState.circleDatas, filter, sort, sortInv, filterInv]);

	return { ...bubblesState, bubbles };
}
