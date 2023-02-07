import type { Vector } from 'react-native-redash';
import { Vec, curve } from './svg';

// r = r0 + a cos(theta) + b cos(theta)^2

const cc = 0.5522847498;
// 0.5522847498 is taken from https://spencermortensen.com/articles/bezier-circle/

export const generateBlobPath = (o: Vector<number>, r: number) => {
	const s = `M ${o.x - r} ${o.y}`;
	const ccR = cc * r;
	return (a = 0, b = 0) => {
		'worklet';
		const aPos = 1 + a;
		const aMin = 1 - a;
		const d = [
			s,
			curve(Vec(0, (aMin) * ccR), Vec(((aMin) - cc) * r, r - a * ccR), Vec(r * (aMin), r), true),
			curve(Vec(ccR, ccR * a), Vec(r * (aPos), r * ((aPos) * cc - 1)), Vec(r * (aPos), -r), true),
			curve(Vec(0, -(aPos) * ccR), Vec(-((aPos) - cc) * r, -(r + a * ccR)), Vec(-r * (aPos), -r), true),
			curve(Vec(-ccR, ccR * a), Vec(-r * (aMin), -r * ((aMin) * cc - 1)), Vec(-r * (aMin), r), true),
			'Z',
		].join(' ');
		return d;
	};
};
