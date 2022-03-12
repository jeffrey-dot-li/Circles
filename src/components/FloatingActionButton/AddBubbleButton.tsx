import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { mix } from 'react-native-redash';

import { Feather as Icon } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import FloatingActionButton, { FAB_SIZE } from './FloatingActionButton';
import { themeColors } from '~/static/theme';
import { rgba, toHex } from '~/utils/color';
import type { BubbleNavProp, StackParamList } from '~/navigators/bubbleStack';
import type { FunctionalComponent, ReactProps } from '~/types/utils';

interface Props {
	start: number
}

const AddBubbleButton: FunctionalComponent<Props> = ({ start, style }: ReactProps<Props>) => {
	const navigation = useNavigation<BubbleNavProp<'Home'>>();
	const route = useRoute<RouteProp<StackParamList, 'Home' | 'BubbleCreate'>>();
	const open = useSharedValue(start);
	const callback = () => {
		'worklet';
		if (open.value !== start)
			open.value = start;
	};

	const onPress = () => {
		open.value = route.name === 'Home' ? 1 : 0;
		navigation.navigate(route.name === 'Home' ? 'BubbleCreate' : 'Home');
	};
	const openWithSpring = useDerivedValue(() => withSpring(open.value, {
		overshootClamping: true,
		mass: 1,
		damping: 15,
		restDisplacementThreshold: 0.00001,
		restSpeedThreshold: 0.00001,
	}, callback));

	const icon = useAnimatedStyle(() => ({
		transform: [{ rotate: `${mix(openWithSpring.value, Math.PI / 4, 0)}rad` }],
	}));
	return (
		<SharedElement id={'plus-button'} style={style}>
			<FloatingActionButton onPress={onPress} >
				<Animated.View style={icon}>
					<Icon name="x" color={rgba(themeColors.blossom[100])} size={FAB_SIZE / 2} />
				</Animated.View>
			</FloatingActionButton>
		</SharedElement>
	);
};

export default AddBubbleButton;
