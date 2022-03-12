import 'react-native-get-random-values';
import type { ThunkAction } from 'redux-thunk';
import type { RootState } from '../types';
import type { ActionTypes } from './types';
import { AddBubble, DoNothing, SetThemeColor } from './types';
import { CircleData, SavedCircleData } from '~/types/Circles';
import type { Color } from '~/utils/color';
type ThunkAction_t<R = void> = ThunkAction<R, RootState, undefined, ActionTypes>;

export const setThemeColor: (color: Color) => ThunkAction_t = color => (dispatch) => {
	return dispatch({
		type: SetThemeColor,
		color,
	});
};
