import type { ComponentProps } from 'react';
import type { Vector } from 'react-native-redash';
import { addArc, addCurve, addLine, addQuadraticCurve, close, createPath, serialize, vec } from 'react-native-redash';
import type { PathProps as BasePathProps, Path as PathComponent } from 'react-native-svg';

export interface Curve {
	to: Vector
	c1: Vector
	c2: Vector
}

export type PathProps = Omit<BasePathProps, 'd'>;

export const Viewbox = (endCorner: [number, number], startCorner: [number, number] = [0, 0]) =>
	[...startCorner, ...endCorner].join(' ');
export const curve = (c1: Vector, c2: Vector, to: Vector, relative = false) => {
	'worklet';
	return `${relative ? 'c' : 'C'} ${(c1.x)} ${(c1.y)} ${(c2.x)} ${(c2.y)} ${(to.x)} ${(to.y)}`;
};

type MaybeRelativeVector<T = number> = Vector<T> &
{
	relative?: boolean
};

export const add = (a: Vector, b: Vector) => { 'worklet'; return vec.create(a.x + b.x, a.y + b.y); };
export const scale = (a: Vector, c: number) => { 'worklet'; return vec.create(a.x * c, a.y * c); };

export const vecToAbs = (v: MaybeRelativeVector, origin: Vector) => { 'worklet'; return v.relative ? add(v, origin) : v; };

export const Vec = (x = 0, y = 0, relative = false) => { 'worklet'; return ({ x, y, relative }); };
export const VecFromAngle = ([r, a]: [number, number], relative = false) => { 'worklet'; return ({ x: r * Math.cos(a), y: r * Math.sin(a), relative }); };
export const Path_C = (v: Vector) => {
	'worklet';
	return {
		...createPath(v),
		closePath() {
			'worklet';
			close(this);
			return this;
		},

		get position(): Vector {
			'worklet';
			return this.curves[this.curves.length - 1]?.to || this.move;
		},

		serialize() { 'worklet'; return serialize(this); },

		addArc(corner: MaybeRelativeVector, to: MaybeRelativeVector) {
			'worklet';
			const absCorner = vecToAbs(corner, this.position);
			const absTo = vecToAbs(to, this.position);
			addArc(this, absCorner, absTo);
			return this;
		},

		addLine(to: MaybeRelativeVector) {
			'worklet';
			const absTo = vecToAbs(to, this.position);
			addLine(this, absTo);
			return this;
		},

		addCurve(c: Curve) {
			'worklet';
			addCurve(this, c);
			return this;
		},

		addQuadraticCurve(corner: MaybeRelativeVector, to: MaybeRelativeVector) {
			'worklet';
			const absCorner = vecToAbs(corner, this.position);
			const absTo = vecToAbs(to, this.position);
			addQuadraticCurve(this, absCorner, absTo);
			return this;
		},

		addCubicCurve(relC1: MaybeRelativeVector, relC2: MaybeRelativeVector, relTo: MaybeRelativeVector) {
			'worklet';
			const c1 = vecToAbs(relC1, this.position);
			const c2 = vecToAbs(relC2, this.position);
			const to = vecToAbs(relTo, this.position);
			addCurve(this, { c1, c2, to });
			return this;
		},
	};
};
