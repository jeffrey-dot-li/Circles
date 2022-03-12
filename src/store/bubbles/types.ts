import type { PartialCircle, SavedCircleData } from '~/types/Circles';
import { CircleData } from '~/types/Circles';
import type { ActionType } from '~/types/redux';
import { Actionify } from '~/types/redux';

import type { Color } from '~/utils/color';
import { NotesRepository } from '~/data/repositories/NoteRepository';

// UpperCamelCase for hte action type so copy paste replace is easy.
// lowerCamelCase for the action function.

export const AddBubble = Actionify('AddBubble');
export const UpdateBubble = Actionify('UpdateBubble');
export const DeleteBubble = Actionify('DeleteBubble');
export const PopBubble = Actionify('PopBubble');
export const SetThemeColor = Actionify('SetThemeColor');
export const SetBubbles = Actionify('SetBubbles');
export const DatabaseFetchedAction = Actionify('DatabaseFetchedAction');
// TODO: Rename.
export const DoNothing = Actionify('DoNothing');

export interface ActionList {
	AddBubbleAction: ActionType<typeof AddBubble> & {
		circleData: SavedCircleData
	}
	UpdateBubbleAction: ActionType<typeof UpdateBubble> & {
		circleData: PartialCircle
		id: string
	}

	DeleteBubbleAction: ActionType<typeof DeleteBubble> & {
		id: string
	}
	PopBubbleAction: ActionType<typeof PopBubble> & {
		id: string
	}

	DoNothingAction: ActionType<typeof DoNothing> & {}
	DatabaseFetchedAction: ActionType<typeof DatabaseFetchedAction> & {}

	SetBubblesAction: ActionType<typeof SetBubbles> & {
		circleDatas: SavedCircleData[]
	}

	SetThemeColorAction: ActionType<typeof SetThemeColor> & {
		color: Color
	}

}

export interface State {
	databaseFetched: boolean
	themeColor: Color
	circleDatas: Record<string, SavedCircleData>
}

export type ActionTypes = ActionList[keyof ActionList];
