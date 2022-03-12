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
		// Todo: Generate initial position and velocity
		position: Vec(0, 0),
		velocity: GenerateVelocity(),
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

export function useActiveBubbles() {
	const bubblesState = useAppSelector(s => s.bubbles);
	const activeBubbles = useMemo(() =>
		TypedEntries(bubblesState.circleDatas).filter(([, v]) => !v.popped), [bubblesState.circleDatas]);

	return { ...bubblesState, activeBubbles };
}

export function useAllBubbles() {
	const bubblesState = useAppSelector(s => s.bubbles);
	const allBubbles = useMemo(() =>
		TypedEntries(bubblesState.circleDatas), [bubblesState.circleDatas]);

	return { ...bubblesState, allBubbles };
}
