import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedProps, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import { withPause } from 'react-native-redash';
import Svg, { Path } from 'react-native-svg';
import GlobalStyles from '~/static/styles';
import { themeColors } from '~/static/theme';
import type { ComposeProps, FunctionalComponent, ReactProps } from '~/types/utils';
import { generateBlobPath } from '~/utils/blob';
import type { Color } from '~/utils/color';
import { rgba } from '~/utils/color';
import type { PathProps } from '~/utils/svg';
import { Vec, Viewbox } from '~/utils/svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
	color: Color
	paused: Readonly<Animated.SharedValue<boolean>>
	size: number
}

const blobPeriod = 2;
const rotatePeriod = 5;

const Blob: FunctionalComponent<Props>
	= ({ color, paused, size, style }: ReactProps<Props>) => {
		const backgroundColor = { ...color, a: 0.5 };
		const blobGenerator = useMemo(() => generateBlobPath(Vec(size, size), size / 2), []);

		const progress = useSharedValue(0);

		const animatedProps = useAnimatedProps(() => {
			'worklet';
			return {
				// d: blobGenerator(Math.sin(progress.value / blobPeriod) * 0.5),
			};
		}, [blobPeriod]);

		useEffect(() => {
			progress.value = withPause(withRepeat(withTiming(
				blobPeriod * rotatePeriod * 2 * Math.PI,
				{
					duration: 2000 * blobPeriod * rotatePeriod,
					easing: Easing.linear,
				}), -1), paused);
		}, []);

		const animatedStyles = useAnimatedStyle(() => ({
			transform: [
				{
					rotate: `${progress.value / rotatePeriod}rad`,
				},
			],
			height: size,
			width: size,
		}), [rotatePeriod]);
		return (
			<Animated.View style={[style, BlobStyles, animatedStyles]} pointerEvents={'none'}>
				<Svg height={2 * size} width={2 * size} viewBox={Viewbox([2 * size, 2 * size])}>
					<AnimatedPath fill={rgba(backgroundColor)} stroke={rgba(color)} animatedProps={animatedProps}></AnimatedPath>
				</Svg>
			</Animated.View>
		);
	};

const BlobStyles = {
	overflow: 'visible',
	padding: 0,
	justifyContent: 'center',
	alignItems: 'center',
} as const;

export default Blob;
