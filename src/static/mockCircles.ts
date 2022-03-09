import { themeColors } from './theme';
import type { CircleData } from '~/types/Circles';
import { fromHex } from '~/utils/color';

export const CircleDatas: readonly CircleData[] = [
  {
    radius: 100,
    position: { x: 0, y: 0 },
    velocity: { x: 0.5, y: 0.5 },
    color: (themeColors.Autumn),
    content: 'content',
    title: 'Title',
    popped: false,
  },
  {
    radius: 180,
    position: { x: 0, y: 0 },
    velocity: { x: 0.5, y: 0.5 },
    color: themeColors.Evergreen,
    content: 'content',
    title: 'Title',
    popped: false,
  },
  {
    radius: 90,
    position: { x: 0, y: 0 },
    velocity: { x: 0.5, y: 0.5 },
    color: themeColors.Fuschia,
    content: 'content',
    title: 'Title',
    popped: false,
  },
  {
    radius: 120,
    position: { x: 0, y: 0 },
    velocity: { x: 0.5, y: 0.5 },
    color: themeColors.Iris,
    content: 'content',
    title: 'Title',
    popped: false,
  },
  {
    radius: 140,
    position: { x: 0, y: 0 },
    velocity: { x: 0.5, y: 0.5 },
    color: themeColors.Lava,
    content: 'content',
    title: 'Title',
    popped: false,
  },
] as const;
