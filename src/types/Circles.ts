import type { Color } from '~/utils/color';

export type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
};

export interface CircleMetadata {
	id: string
	createdAt: number
	updatedAt: number
}
export interface CircleData {
	radius: number
	color: Color
	title: string
	content: string
	popped: boolean
}
export type SavedCircleData = CircleData & { metadata: CircleMetadata };
export type PartialCircle = DeepPartial<CircleData> & { color?: Color };
