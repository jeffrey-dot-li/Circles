import { themeColors } from './theme';
import type { CircleData } from '~/types/Circles';
import { fromHex } from '~/utils/color';

export const CircleDatas: readonly CircleData[] = [
	{
		radius: 100,
		position: { x: 0, y: 0 },
		velocity: { x: 0.5, y: 0.5 },
		color: (themeColors.sunrise[100]),
		content: 'content',
		title: 'Title',
		popped: false,
	},
	{
		radius: 180,
		position: { x: 0, y: 0 },
		velocity: { x: 0.5, y: 0.5 },
		color: themeColors.evergreen[100],
		content: 'content',
		title: 'Title',
		popped: false,
	},
	{
		radius: 90,
		position: { x: 0, y: 0 },
		velocity: { x: 0.5, y: 0.5 },
		color: themeColors.blossom[100],
		content: 'content',
		title: 'Title',
		popped: false,
	},
	{
		radius: 120,
		position: { x: 0, y: 0 },
		velocity: { x: 0.5, y: 0.5 },
		color: themeColors.twilight[100],
		content: 'content',
		title: 'Title',
		popped: false,
	},
	{
		radius: 140,
		position: { x: 0, y: 0 },
		velocity: { x: 0.5, y: 0.5 },
		color: themeColors.skylight[100],
		content: 'content',
		title: 'Title',
		popped: false,
	},
] as const;
