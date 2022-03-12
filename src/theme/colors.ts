
export const themeHSL = {
	evergreen: {
		hue: 144,
		sat: 85,
		palette:
		{
			50: 'hsl(144, 85%, 50%)',
			65: 'hsl(144, 85%, 65%)',
			75: 'hsl(144, 85%, 75%)',
			100: 'hsl(144, 100%, 50%)',
		},
	},
	skylight: {
		hue: 182,
		sat: 85,
		palette:
		{
			50: 'hsl(182, 85%, 50%)',
			65: 'hsl(182, 85%, 65%)',
			75: 'hsl(182, 85%, 75%)',
			100: 'hsl(182, 100%, 50%)',
		},
	},
	sunrise: {
		hue: 42,
		sat: 90,
		palette: {
			50: 'hsl(42, 90%, 50%)',
			65: 'hsl(42, 90%, 65%)',
			75: 'hsl(42, 90%, 75%)',
			100: 'hsl(42, 100%, 50%)',
		},
	},
	blossom: { // TODO: Rename Blossom
		hue: 329,
		sat: 85,
		palette:
		{
			65: 'hsl(329, 85%, 65%)',
			75: 'hsl(329, 85%, 75%)',
			85: 'hsl(329, 85%, 85%)',
			100: 'hsl(329, 100%, 70%)',
		},
	},
	twilight: { // TODO: Rename Twilight
		hue: 239,
		sat: 85,
		palette:
		{
			65: 'hsl(239, 85%, 65%)',
			75: 'hsl(239, 85%, 75%)',
			85: 'hsl(239, 85%, 85%)',
			100: 'hsl(239, 100%, 70%)',
		},
	},
} as const;

// eslint-disable-next-line no-use-before-define
const themeCondensed = Object.fromEntries(Object.entries(themeHSL).map(([k, v]) => [k, v.palette])) as { [k in keyof typeof themeHSL]: (typeof themeHSL)[k]['palette'] };
export default themeCondensed;
