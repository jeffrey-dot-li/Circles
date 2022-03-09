import type { Vector } from 'react-native-redash';
import type { Color } from '~/utils/color';

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
};

export interface CircleMetadata {
  id: string
  createdAt: number
  updatedAt: number
}
export interface CircleData<T = number> {
  radius: number
  position: Vector<T>
  velocity: Vector<T>
  color: Color
  title: string
  content: string
  popped: boolean
}
export type SavedCircleData<T = number> = CircleData<T> & { metadata: CircleMetadata };
export type PartialCircle = DeepPartial<CircleData> & { color?: Color };
