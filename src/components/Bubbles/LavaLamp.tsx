import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import { close, createPath, serialize } from 'react-native-redash';
import { Drip, Melt } from './Drip';
import GradientBackground from './GradientBackground';
import { Vec, addArc, addLine } from '~/utils/svgclone';
import GlobalStyles from '~/static/styles';
import type { PropsWithStyle } from '~/types/utils';
import Normal from '~/utils/Ziggurat';

interface Props {}
const AnimatedPath = Animated.createAnimatedComponent(Path);

const style = StyleSheet.create({
	maskStyle: {
		position: 'absolute',
	},
});

const pathStroke = ({ width, height, radius }: { width: number; height: number; radius: number }) => {
	const path = createPath(Vec(0, radius));
	addArc(path, Vec(0, -radius, true), Vec(radius, -radius, true));
	addLine(path, Vec(width, 0, true));
	addArc(path, Vec(radius, 0, true), Vec(radius, radius, true));
	addLine(path, Vec(0, height, true));
	addArc(path, Vec(0, radius, true), Vec(-radius, radius, true));
	addLine(path, Vec(-width, 0, true));
	addArc(path, Vec(-radius, 0, true), Vec(-radius, -radius, true));

	close(path);
	return serialize(path);
};

interface BoxProps {
	translateX?: number
	translateY?: number
	scaleX?: number
	scaleY?: number
}

export const OverlayBox = ({ translateX = 0, translateY = 0, scaleX = 1, scaleY = 1 }: BoxProps) => {
	const SIZE = 100;
	const radius = 50;
	const width = scaleX * SIZE;
	const height = scaleY * SIZE;
	const totalWidth = width + 2 * radius;
	const totalHeight = height + 2 * radius;

	return (
		<Svg style={[style.maskStyle, { transform: [{ translateX }, { translateY }] }, { height: totalHeight, width: totalWidth }]} viewBox={[0, 0, totalWidth, totalHeight].join(' ')}>
			<Path d={pathStroke({ width, height, radius })} fill="rgba(255,255,255,0.2)"></Path>
		</Svg>
	);
};
const rndOffset = () => (Math.random() - 0.5);
const normal = new Normal();
const blocs = [...Array(2).keys()].map(() => {
	const baseSize = Math.exp(normal.RNOR()) * 1;
	return {
		translateX: rndOffset() * 400,
		translateY: rndOffset() * 600,
		scaleX: baseSize,
		scaleY: Math.exp(normal.RNOR()) * baseSize,
	};
});

export const LavaLamp = (props: PropsWithStyle<Props>) => {
	const widthAndHeight = Dimensions.get('screen');
	return (
		<Animated.View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
			{blocs.map((v, key) => (
				<OverlayBox {...v} key={key}></OverlayBox>
			))}
			<View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'white', opacity: 0.2, height: 200 }}></View>
			<Melt height={150} radius={10} style={{ ...StyleSheet.absoluteFillObject, top: 200 }} width={widthAndHeight.width} pathProps={{ fill: 'white', fillOpacity: 0.2 }}></Melt>
		</Animated.View>
	);
};
