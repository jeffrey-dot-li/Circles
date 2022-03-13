import type { ActionTypes, State } from './types';
import { AddBubble, DatabaseFetchedAction, DeleteBubble, SetBubbles, SetThemeColor, UpdateBubble } from './types';
import { themeColors } from '~/static/theme';
import { TypedEntries, UpdateObject, deepRequired } from '~/utils/core';
import type { SavedCircleData } from '~/types/Circles';
export const initialState: State = {
	databaseFetched: false,
	themeColor: themeColors.twilight[100],
	circleDatas: {},
};

export default function bubbleReducer(
	state: State = initialState,
	action: ActionTypes,
): State {
	switch (action.type) {
		case DatabaseFetchedAction:
			return { ...state, databaseFetched: true };
		case DeleteBubble:
			return { ...state, circleDatas: Object.fromEntries(TypedEntries(state.circleDatas).filter(([k]) => k !== action.id)) };
		case SetBubbles:
			return { ...state, circleDatas: Object.fromEntries(action.circleDatas.map(k => [k.metadata.id, k])) };
		case AddBubble:
			return { ...state, circleDatas: { ...state.circleDatas, [action.circleData.metadata.id]: action.circleData } };
		case UpdateBubble:
			return { ...state, circleDatas: { ...state.circleDatas, [action.id]: UpdateObject(state.circleDatas[action.id]!, action.circleData) } };
		case SetThemeColor:
			return { ...state, themeColor: action.color };
		default:
			return state;
	}
}
