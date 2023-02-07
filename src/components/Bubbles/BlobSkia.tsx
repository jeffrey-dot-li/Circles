import React, { useEffect, useMemo } from 'react';
import Animated, { Easing, useAnimatedProps, useAnimatedStyle, useDerivedValue, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import type { Vector } from 'react-native-redash';
import { withPause } from 'react-native-redash';
import type { TransformObject } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import type { Transforms2d } from '@shopify/react-native-skia';
import { Group, Path as SkiaPath, useSharedValueEffect, useValue } from '@shopify/react-native-skia';
import type { ComposeProps, FunctionalComponent, ReactProps } from '~/types/utils';
import { generateBlobPath } from '~/utils/blob';
import type { Color } from '~/utils/color';
import { rgba } from '~/utils/color';
import { Vec, Viewbox, add, rotateTransform } from '~/utils/svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
	color: Color
	progress: Readonly<Animated.SharedValue<number>>
	size: number
	origin: Vector
}

const blobPeriod = 2;
const rotatePeriod = 5;
const ZeroVector = Vec(0, 0);

const SkiaBlob: FunctionalComponent<Props>
	= ({ color, progress, size, origin = ZeroVector }: ReactProps<Props>) => {
		const backgroundColor = { ...color, a: 0.5 };
		const blobGenerator = useMemo(() => generateBlobPath(origin, size / 2), []);
		const path = useValue('');
		const transform = useValue<Transforms2d>([]);

		useSharedValueEffect(() => {
			path.current = blobGenerator(Math.sin(progress.value / blobPeriod) * 0.5);
			transform.current = [
				{ rotate: progress.value / rotatePeriod },
			];
		}
		, progress);
		return (
			<Group transform={transform} origin={origin}>
				<SkiaPath path={path} color={rgba(color)} style="stroke" />
				<SkiaPath path={path} color={rgba(backgroundColor)} />
			</Group>
		);
	};

export default SkiaBlob;
