import React, { useEffect } from 'react';
import { Canvas, Circle, Group } from '@shopify/react-native-skia';
import { Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { withPause } from 'react-native-redash';
import SkiaBlob from '../Bubbles/BlobSkia';
import { themeColors } from '~/static/theme';

const blobPeriod = 2;
const rotatePeriod = 3;

export const SkiaCanvas = () => {
	const size = 256;
	const r = size * 0.33;
	const progress = useSharedValue(0);
	const isPaused = useSharedValue(false);

	useEffect(() => {
		progress.value = withPause(withRepeat(withTiming(
			blobPeriod * rotatePeriod * 2 * Math.PI,
			{
				duration: 1000 * blobPeriod * rotatePeriod,
				easing: Easing.linear,
			}), -1), isPaused);
	}, []);
	return (
		<Canvas style={{ flex: 1, borderStyle: 'solid', borderWidth: 3 }}>
			<SkiaBlob color={themeColors.skylight[100]} size={100} progress={progress} />

		</Canvas>
	);
};
