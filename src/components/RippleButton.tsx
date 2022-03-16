import type { ReactElement } from 'react';
import React, { Children, ReactNode, useState } from 'react';
import { Gesture, GestureDetector, State, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
	and,
	call,
	cond,
	diff,
	eq,
	greaterOrEq,
	greaterThan,
	neq,
	onChange,
	or,
	useAnimatedStyle,
	useCode,
	useDerivedValue,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import type { ViewProps } from 'react-native';
import { StyleSheet, View } from 'react-native';
import {
	mix,
	useTranslation,
	vec,
} from 'react-native-redash';
import { useVector } from 'react-native-redash/src/Vectors';
import type { Color } from '~/utils/color';
import { rgba } from '~/utils/color';

interface RippleButtonProps {
	children: ReactElement<ViewProps>
	color: Color
	onPress?: () => void
}

const RippleButton = ({ children, color, onPress = () => null }: RippleButtonProps) => {
	const radius = useSharedValue(-1);
	const progress = useSharedValue(0);

	const tap = Gesture.Tap().onBegin(() => progress.value = withSpring(1)).onEnd(onPress);
	const isGoingUp = or(greaterThan(diff(progress.value), 0), eq(progress.value, 1));
	const scale = useDerivedValue(() => mix(progress.value, 0.001, 1));
	const opacity = isGoingUp;
	const backgroundColor = rgba(color);
	const gesture = Gesture.Race(tap);

	const position = useVector(-radius.value);
	const translate = useTranslation(position);
	return (<View></View>);
	// Fix this later xdddd
	const animatedStyle = useAnimatedStyle(() => ({
		backgroundColor,
		borderRadius: radius.value,
		width: radius.value * 2,
		height: radius.value * 2,
		transform: [
			{ translateX: position.x.value },
			{ translateY: position.y.value },
			{ scale: scale.value },
		],
	}), [backgroundColor, opacity]);
	return (
		<GestureDetector gesture={gesture}>
			<Animated.View>
				<View
					style={{
						...StyleSheet.absoluteFillObject,
						borderRadius: 14,
						backgroundColor,
						overflow: 'hidden',
					}}
					onLayout={({
						nativeEvent: {
							layout: { height, width },
						},
					}) => radius.value = (Math.sqrt(width ** 2 + height ** 2))}
				>
					{radius.value !== -1 && (
						<Animated.View
							style={animatedStyle}
						/>
					)}
				</View>
				{children}
			</Animated.View>
		</GestureDetector>
	);
};

export default RippleButton;
