import color, { HSLFromString } from '~/utils/color';
import condensedThemeHSL from '~/theme/colors';
import { MapEntries } from '~/utils/core';

export const themeColors = MapEntries(condensedThemeHSL)((_, hsl) => MapEntries(hsl)((_, v) => HSLFromString(v)));

// export const themeColors = {
// 	Lava: color(355, 86, 60),
// 	Autumn: color(37, 86, 60),
// 	Fuschia: color(329, 81, 71),
// 	Evergreen: color(150, 85, 65),
// 	Iris: color(239, 82, 81),
// } as const;

export const getRandomColor = (seed = 0) =>
	Object.values(themeColors)[Math.floor((seed ? (seed % 1) : Math.random()) * Object.values(themeColors).length)]![100];
