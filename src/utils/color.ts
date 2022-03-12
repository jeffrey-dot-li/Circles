import 'react-native-reanimated';
import convert from 'color-convert';
export type HSLColor = `hsl(${number}, ${number}%, ${number}%)`;

const SC
= {
	h: 360,
	s: 100,
	l: 100,
	a: 1,
} as const;
export interface Color {
	h: number
	s: number
	l: number
	ratio: boolean
	a: number
}

const HSLToRGB = (h: number, s_: number, l_: number) => {
	'worklet';
	// Must be fractions of 1
	const s = s_ / 100;
	const l = l_ / 100;

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs((h / 60) % 2 - 1));
	const m = l - c / 2;
	let r = 0;
	let g = 0;
	let b = 0;
	if (h >= 0 && h < 60) {
		r = c; g = x; b = 0;
	}
	else if (h >= 60 && h < 120) {
		r = x; g = c; b = 0;
	}
	else if (h >= 120 && h < 180) {
		r = 0; g = c; b = x;
	}
	else if (h >= 180 && h < 240) {
		r = 0; g = x; b = c;
	}
	else if (h >= 240 && h < 300) {
		r = x; g = 0; b = c;
	}
	else if (h >= 300 && h < 360) {
		r = c; g = 0; b = x;
	}
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return { r, g, b };
};

export const workletColor = (h: number, s: number, l: number, a: number, ratio: boolean) => {
	'worklet';
	return ({ h, s, l, a, ratio });
};
const color = (h: number, s: number, l: number, a = 1, ratio = false): Color => workletColor(h, s, l, a, ratio);

export const RatioToAbs = ({ ratio, h, s, l, a }: Color) => {
	'worklet';
	return ratio ? workletColor(h * SC.h, s * SC.s, l * SC.l, a, false) : workletColor(h, s, l, a, false);
};

export const AbsToRatio = ({ ratio, h, s, l, a }: Color) => {
	'worklet';
	return ratio ? workletColor(h, s, l, a, true) : workletColor(h / SC.h, s / SC.s, l / SC.l, a, true);
};

export const rgba = (c_: Color) => {
	'worklet';
	const c = RatioToAbs(c_);
	/// Array destructuring doesn't work because it relies on Array.slice which doesnt exist on the fucking worklet thread.
	const { r, g, b } = HSLToRGB(c.h, c.s, c.l);

	/// Really fun type checking here.
	/// Following code errors :
	//   const a = typeof c.a === 'number' ? c.a : 1;

	return `rgba(${r}, ${g}, ${b}, ${c_.a})`;
//   return 'rgba(2,2,2,1)';
};

export const fromHex = (c: string) => {
	const [h, s, l] = convert.hex.hsl(c);
	return color(h, s, l);
};

export const toHex = (c: Color) => {
	return convert.hsl.hex([c.h, c.s, c.l]);
};

export const HSLFromString = (hslString: HSLColor) => {
	const ex = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;
	if (ex.test(hslString)) {
		const sep = hslString.includes(',') ? ',' : ' ';
		const hsl = hslString.substr(4).split(')')[0]!.split(sep);

		const hString = hsl[0]!;
		const s = Number(hsl[1]!.substr(0, hsl[1]!.length - 1));
		const l = Number(hsl[2]!.substr(0, hsl[2]!.length - 1));
		let h = Number(hString);
		// strip label and convert to degrees (if necessary)
		if (hString.includes('deg'))
			h = Number(hString.substr(0, hString.length - 3));
		else if (hString.includes('rad'))
			h = Math.round(Number(hString.substr(0, hString.length - 3)) / (2 * Math.PI) * 360);
		else if (hString.includes('turn'))
			h = Math.round(Number(hString.substr(0, hString.length - 4)) * 360);
		// keep hue fraction of 360 if ending up over
		if (h >= 360)
			h %= 360;
		return color(h, s, l);
	}
	console.error({ error: 'HSL COLOR CONVERT ERROR', hslString });
	return color(0, 0, 0);
};

export default color;
