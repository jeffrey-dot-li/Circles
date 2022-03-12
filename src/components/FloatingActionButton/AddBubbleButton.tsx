import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { mix } from 'react-native-redash';

import { Feather as Icon } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import FloatingActionButton, { FAB_OFFSETS, FAB_SIZE } from './FloatingActionButton';
import { themeColors } from '~/static/theme';
import { rgba, toHex } from '~/utils/color';
import type { BubbleNavProp, StackParamList } from '~/navigators/bubbleStack';
import type { FunctionalComponent, ReactProps } from '~/types/utils';

interface Props {
	startOpen: boolean
}

const AddBubbleButton: FunctionalComponent<Props> = ({ startOpen, style }: ReactProps<Props>) => {
	const navigation = useNavigation<BubbleNavProp<'Home'>>();
	const route = useRoute<RouteProp<StackParamList, 'Home' | 'BubbleCreate'>>();
	const open = useSharedValue(Number(startOpen));
	const callback = () => {
		'worklet';
		if (open.value !== Number(startOpen))
			open.value = Number(startOpen);
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

	const iconAnimation = useAnimatedStyle(() => ({
		transform: [
			{ rotate: `${mix(openWithSpring.value, Math.PI / 4, 0)}rad` },

		],
	}), [openWithSpring.value]);

	const buttonAnimation = useAnimatedStyle(() => ({
		transform: [
			{ translateY: -mix(openWithSpring.value, 0, FAB_SIZE + 20) },
		],
	}), [openWithSpring.value]);
	return (
		<View style={style}>
			<Animated.View style={buttonAnimation} >
				<SharedElement id={'plus-button'} >
					{/* Can't have Animated.View as the first node inside SharedElement or get 'Object not extendible' error. */}
					<FloatingActionButton onPress={onPress} >
						<Animated.View style={iconAnimation} >
							<Icon name="x" color={rgba(themeColors.blossom[100])} size={FAB_SIZE / 2} />
						</Animated.View>
					</FloatingActionButton>
				</SharedElement>
			</Animated.View>
		</View>
	);
};

export default AddBubbleButton;
