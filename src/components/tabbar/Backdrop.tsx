import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
	useAnimatedProps,
	useAnimatedStyle,
	withTiming,
} from 'react-native-reanimated';

interface BackdropProps {
	open: Animated.SharedValue<number>
	style?: StyleProp<ViewStyle>
}
const Overlay = ({ open, style }: BackdropProps) => {
	const animatedProps = useAnimatedProps(() => ({
		pointerEvents: open.value < 1 ? ('none' as const) : ('box-none' as const),
	}));
	const animatedStyle = useAnimatedStyle(() => ({
		backgroundColor: 'grey',
		opacity: 0.6 * open.value,
	}));
	return (
		<Animated.View
			style={[StyleSheet.absoluteFill, animatedStyle, style]}
			animatedProps={animatedProps}
		>
			<Pressable
				style={StyleSheet.absoluteFill}
				onPress={() => (open.value = withTiming(0))}
			/>
		</Animated.View>
	);
};

export default Overlay;
