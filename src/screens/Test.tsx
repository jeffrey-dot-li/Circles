import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
	Dimensions,
	StyleSheet,
	View,
} from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';
import { LavaLamp } from '~/components/Bubbles/LavaLamp';
import type { bubbles } from '~/store/types';
import type { BubbleNavProp, StackParamList } from '~/navigators/bubbleStack';
import { BubbleFilters, useBubbles, useLoadCircles } from '~/data/hooks/bubbles';
import GradientBackground from '~/components/Bubbles/GradientBackground';
import AddBubbleButton from '~/components/FloatingActionButton/AddBubbleButton';
import PocketButton from '~/components/FloatingActionButton/PocketButton';
import { FAB_OFFSETS } from '~/components/FloatingActionButton/FloatingActionButton';
import GlobalStyles from '~/static/styles';
import Blob from '~/components/Bubbles/Blob';
import { themeColors } from '~/static/theme';

type ItemDetailsRouteProp = RouteProp<StackParamList, 'Home'>;
interface NavigationProps {
	navigation: BubbleNavProp<'Home'>
	route: ItemDetailsRouteProp
}

type StateProps = Pick<bubbles.State, 'circleDatas'>;
type Props = StateProps & NavigationProps;

const TestScreen = ({ navigation, route }: Props) => {
	const loadCircles = useLoadCircles();
	useEffect(() => { loadCircles(); }, []);
	const insets = useSafeAreaInsets();
	const isPaused = useSharedValue(false);
	return (
		<SafeAreaView style={GlobalStyles.screenContainer}>
			<GradientBackground>
				<LavaLamp />
			</GradientBackground>

			<View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }, styles.backdrop]} pointerEvents="box-none">
				<Blob color={themeColors.blossom[100]} paused={isPaused} size={64}></Blob>
				<AddBubbleButton startOpen={false}
					style={{ position: 'absolute', right: FAB_OFFSETS.x, bottom: FAB_OFFSETS.y + insets.bottom }}
				/>
				<PocketButton startOpen={false}
					style={{ position: 'absolute', left: FAB_OFFSETS.x, bottom: FAB_OFFSETS.y + insets.bottom }}
				/>
			</View>
		</SafeAreaView>
	);
};

export default TestScreen;
const styles = StyleSheet.create({
	backdrop: {
		zIndex: 101,
	},
	nonBlurredContent: {
		zIndex: 100,
	},
});
