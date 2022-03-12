import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';

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
	startOpen: boolean
}

const PocketButton: FunctionalComponent<Props> = ({ startOpen, style }: ReactProps<Props>) => {
	const navigation = useNavigation<BubbleNavProp<'Home'>>();
	const route = useRoute<RouteProp<StackParamList, 'Home' | 'PocketScreen'>>();
	const open = useSharedValue(Number(startOpen));

	const onPress = () => {
		open.value = route.name === 'Home' ? 1 : 0;
		navigation.navigate(route.name === 'Home' ? 'PocketScreen' : 'Home');
	};
	return (
		<SharedElement id={'pocket-button'} style={style}>
			<FloatingActionButton onPress={onPress} >
				<Icon name="shopping-bag" color={rgba(themeColors.sunrise[100])} size={FAB_SIZE / 2} />

			</FloatingActionButton>
		</SharedElement>
	);
};

export default PocketButton;
