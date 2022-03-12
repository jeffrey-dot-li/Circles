import React, { ComponentProps } from 'react';
import { View } from 'react-native';
import { createPath } from 'react-native-redash/src/Paths';
import { Path, Svg } from 'react-native-svg';
import type { PropsWithStyle } from '~/types/utils';
import type { PathProps } from '~/utils/svg';
import { Vec, addArc, addLine } from '~/utils/svgclone';

export interface Props {
	radius: number
	height: number
	origins: number[]
}

const pathStroke = ({ origins, height, radius }: Props) => {
	const innerHeight = height - 2 * radius;
	const path = ['M 0 0'];
	origins.forEach((h, index) => {
		path.push(`V ${h * (innerHeight) + radius}`);
		path.push(`a ${radius} ${radius} 0 0 ${index % 2} ${radius * 2} 0`);
	});
	path.push('V 0');
	path.push('Z');
	return path.join(' ');
};
export const Drip = ({ style, radius = 25, origins, height }: PropsWithStyle<Props>) => {
	const width = 2 * radius * origins.length;
	const path = pathStroke({ radius, origins, height });

	return (
		<Svg style={[{ width, height }, style]} viewBox={[0, 0, width, height].join(' ')}>
			<Path d={path} fill="white" fillOpacity="0.2"></Path>
		</Svg>
	);
};
const evenOrOdd = (i: number) =>
	i % 2 === 0 ? 1 : -1;

export interface MeltProps {
	height: number
	radius: number
	// Return number between 0 and 1;
	offsetGen?: (index: number) => number
	width: number
	pathProps?: PathProps
}

export const Melt = ({ style, radius, offsetGen = Math.random, width, height, pathProps }: PropsWithStyle<MeltProps>) => {
	const numCircles = Math.ceil(width / (2 * radius));
	const origins = [...Array(numCircles).keys()].map((_, i) => 0.5 + 0.5 * offsetGen(i) * evenOrOdd(i));
	const path = pathStroke({ radius, origins, height });

	return (
		<Svg style={[{ width, height }, style]} viewBox={[0, 0, width, height].join(' ')}>
			<Path d={path} {...pathProps}></Path>
		</Svg>
	);
};
