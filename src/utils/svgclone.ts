import { vec } from 'react-native-redash';
import * as redash from 'react-native-redash/src/Paths';
import type { Path, Vector } from 'react-native-redash';

export interface Curve {
	to: Vector
	c1: Vector
	c2: Vector
}
export const curve = (c1: Vector, c2: Vector, to: Vector) => {
	'worklet';
	return `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${to.y}`;
};

type MaybeRelativeVector<T = number> = Vector<T> &
{
	relative?: boolean
};

export const add = (a: Vector, b: Vector) => { 'worklet'; return vec.create(a.x + b.x, a.y + b.y); };
export const scale = (a: Vector, c: number) => { 'worklet'; return vec.create(a.x * c, a.y * c); };

export const vecToAbs = (v: MaybeRelativeVector, origin: Vector) => { 'worklet'; return v.relative ? add(v, origin) : v; };
export const Vec = (x = 0, y = 0, relative = false) => { 'worklet'; return ({ x, y, relative }); };

export const position = (p: Path) => { 'worklet'; return p.curves[p.curves.length - 1]?.to || p.move; };
export const addArc = (p: Path, corner: MaybeRelativeVector, to: MaybeRelativeVector) => {
	'worklet';
	const absCorner = vecToAbs(corner, position(p));
	const absTo = vecToAbs(to, position(p));
	redash.addArc(p, absCorner, absTo);
	return p;
};

export const addLine = (p: Path, to: MaybeRelativeVector) => {
	'worklet';
	const absTo = vecToAbs(to, position(p));
	redash.addLine(p, absTo);
	return p;
};

export const addCurve = (p: Path, c: Curve) => {
	'worklet';
	redash.addCurve(p, c);
	return p;
};
export const addQuadraticCurve = (path: Path, corner: MaybeRelativeVector, to: MaybeRelativeVector) => {
	'worklet';
	const absCorner = vecToAbs(corner, position(path));
	const absTo = vecToAbs(to, position(path));
	redash.addQuadraticCurve(path, absCorner, absTo);
	return path;
};

export const addCubicCurve = (p: Path, relC1: MaybeRelativeVector, relC2: MaybeRelativeVector, relTo: MaybeRelativeVector) => {
	'worklet';
	const c1 = vecToAbs(relC1, position(p));
	const c2 = vecToAbs(relC2, position(p));
	const to = vecToAbs(relTo, position(p));
	redash.addCurve(p, { c1, c2, to });
	return p;
};
