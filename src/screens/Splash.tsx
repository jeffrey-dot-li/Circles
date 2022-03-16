import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
	Dimensions,
	StyleSheet,
	View,
} from 'react-native';
import {
	useDerivedValue,
} from 'react-native-reanimated';
import type { RouteProp } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bubble } from '~/components/Bubbles/Bubble';
import { LavaLamp } from '~/components/Bubbles/LavaLamp';
import type { bubbles } from '~/store/types';
import type { BubbleNavProp, StackParamList } from '~/navigators/bubbleStack';
import { BubbleFilters, useBubbles, useLoadCircles } from '~/data/hooks/bubbles';
import GradientBackground from '~/components/Bubbles/GradientBackground';
import AddBubbleButton from '~/components/FloatingActionButton/AddBubbleButton';
import PocketButton from '~/components/FloatingActionButton/PocketButton';
import { FAB_OFFSETS } from '~/components/FloatingActionButton/FloatingActionButton';
import GlobalStyles from '~/static/styles';

type ItemDetailsRouteProp = RouteProp<StackParamList, 'Home'>;
interface NavigationProps {
	navigation: BubbleNavProp<'Home'>
	route: ItemDetailsRouteProp
}

type StateProps = Pick<bubbles.State, 'circleDatas'>;
type Props = StateProps & NavigationProps;

const BubblesScreen = ({ navigation, route }: Props) => {
	const { bubbles } = useBubbles({ filter: BubbleFilters.active });
	const loadCircles = useLoadCircles();
	useEffect(() => { loadCircles(); }, []);
	const isFocused = useIsFocused();
	const globalIsPaused = useDerivedValue(() => !isFocused, [isFocused]);
	const onPress = (id: string) => () => navigation.push('BubbleDetails', { id });
	const insets = useSafeAreaInsets();
	return (
		<SafeAreaView style={GlobalStyles.screenContainer}>
			<GradientBackground>
				<LavaLamp />
			</GradientBackground>
			{bubbles.map(([id, item]) => (
				<Bubble circleData={item} key={id} id={id} globalIsPaused={globalIsPaused} onPress={onPress(id)} />
			))}
			<View style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end' }, styles.backdrop]} pointerEvents="box-none">

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

export default (BubblesScreen);
const styles = StyleSheet.create({
	backdrop: {
		zIndex: 101,
	},
	nonBlurredContent: {
		zIndex: 100,
	},
});
