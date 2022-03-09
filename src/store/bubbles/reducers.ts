import type { ActionTypes, State } from './types';
import { AddBubble, DatabaseFetchedAction, DeleteBubble, SetBubbles, SetThemeColor, UpdateBubble } from './types';
import { SaveCircleData } from './actions';
import { CircleDatas } from '~/static/mockCircles';
import { themeColors } from '~/static/theme';
import { TypedEntries, deepRequired } from '~/utils/core';
export const initialState: State = {
  databaseFetched: false,
  themeColor: themeColors.Iris,
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
      return { ...state, circleDatas: { ...state.circleDatas, [action.id]: { ...state.circleDatas[action.id], ...deepRequired(action.circleData) } } };
    case SetThemeColor:
      return { ...state, themeColor: action.color };
    default:
      return state;
  }
}
