import React, { useEffect, useMemo } from 'react';
import Animated, { Easing, useAnimatedProps, useAnimatedStyle, useDerivedValue, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import { withPause } from 'react-native-redash';
import Svg, { Path } from 'react-native-svg';
import { Path as SkiaPath, useSharedValueEffect, useValue } from '@shopify/react-native-skia';
import type { ComposeProps, FunctionalComponent, ReactProps } from '~/types/utils';
import { generateBlobPath } from '~/utils/blob';
import type { Color } from '~/utils/color';
import { rgba } from '~/utils/color';
import { Vec, Viewbox } from '~/utils/svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
	color: Color
	progress: Readonly<Animated.SharedValue<number>>
	size: number
}

const blobPeriod = 2;
const rotatePeriod = 5;

const SkiaBlob: FunctionalComponent<Props>
	= ({ color, progress, size, style }: ReactProps<Props>) => {
		const backgroundColor = { ...color, a: 0.5 };
		const blobGenerator = useMemo(() => generateBlobPath(Vec(size, size), size / 2), []);
		const d = useValue('');
		useSharedValueEffect(() => {
			d.current = blobGenerator(Math.sin(progress.value / blobPeriod) * 0.5);
			// console.log({ k, progress: progress.value });
		}
		, progress);

		const animatedProps = useAnimatedProps(() => {
			'worklet';
			return {
				d,
			};
		}, [blobPeriod]);

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
			<>
				<SkiaPath path={d} color={rgba(color)} />
			</>
		);
	};

const BlobStyles = {
	overflow: 'visible',
	padding: 0,
	justifyContent: 'center',
	alignItems: 'center',
} as const;

export default SkiaBlob;
