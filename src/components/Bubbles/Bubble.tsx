import React, { useEffect, useMemo } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import type { Vector } from 'react-native-redash';
import { mix } from 'react-native-redash';
import { useVector } from 'react-native-redash/src/Vectors';
import { Gesture, GestureDetector, PanGestureHandler } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Rubik_300Light } from '@expo-google-fonts/rubik';
import type { CircleData } from '../../types/Circles';
import type { PropsWithStyle } from '../../types/utils';
import { generateBounceEngine, withBouncing } from '../../utils/bouncing';
import { rgba } from '~/utils/color';
import FontStyles from '~/static/fonts';

import GlobalStyles from '~/static/styles';
import type { BubbleNavProp } from '~/navigators/bubbleStack';

import Normal from '~/utils/Ziggurat';

const useCopyVector = (v: Vector) => useVector(v.x, v.y);

const styles = StyleSheet.create({
	touchable: {
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 10,
		flexDirection: 'column',
		justifyContent: 'center',
		alignContent: 'center',
		shadowOffset: {
			width: 5,
			height: 5,
		},
		zIndex: 1,
		elevation: 3,
	},
	title: {
		alignSelf: 'center',
		color: 'white',
		textAlign: 'center',
		fontSize: 14,
	},
	content: {
		alignSelf: 'center',
		color: 'white',
		textAlign: 'left',
		fontSize: 8,
	},
});

interface Props {
	circleData: CircleData
	id: string
	globalIsPaused: Readonly<Animated.SharedValue<boolean>>
	onPress?: () => void
}

const normal = new Normal();
const useRandomVelVector: () => Vector<Animated.SharedValue<number>> = () => useVector(normal.RNOR() * normal.RNOR(), normal.RNOR() * normal.RNOR());

export const Bubble = ({ circleData: { radius, color, ...note }, globalIsPaused, style, id }: PropsWithStyle<Props>) => {
	const navigation = useNavigation<BubbleNavProp<'Home'>>();
	const selfIsPaused = useSharedValue(false);
	const masterIsPaused = useDerivedValue(() => selfIsPaused.value || globalIsPaused.value, [selfIsPaused.value, globalIsPaused.value]);

	const startPosition = useVector();

	const { height, width } = useSafeAreaFrame();
	const bounceGeneratorX = useMemo(() => generateBounceEngine(0, width), [width]);
	const bounceGeneratorY = useMemo(() => generateBounceEngine(0, height), [height]);

	const animatedPos = useVector(mix(Math.random(), 0, width - radius), mix(Math.random(), 0, height - radius));
	const animatedVel = useRandomVelVector();
	const totalVel = useDerivedValue(() => Math.sqrt(Math.pow(animatedVel.x.value, 2) + Math.pow(animatedVel.y.value, 2)), [animatedVel.x.value, animatedVel.y.value]);

	useEffect(() => {
		animatedPos.x.value = (bounceGeneratorX(animatedPos.x.value, animatedVel.x.value, radius, totalVel.value, masterIsPaused));
		animatedPos.y.value = (bounceGeneratorY(animatedPos.y.value, animatedVel.y.value, radius, totalVel.value, masterIsPaused));
	}, [masterIsPaused.value, radius]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: animatedPos.x.value },
				{ translateY: animatedPos.y.value },
			],
		};
	});

	const wrapper = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		navigation.navigate('BubbleDetails', { id });
	};
	const longPress = Gesture.LongPress().minDuration(300).onStart(() => {
		runOnJS(wrapper)();
	});

	const pan = Gesture.Pan().minDistance(20)
		.onStart(() => {
			'worklet';
			startPosition.x.value = animatedPos.x.value;
			startPosition.y.value = animatedPos.y.value;
			selfIsPaused.value = true;
		}).onChange(({ translationX, translationY }) => {
			'worklet';

			animatedPos.x.value = translationX + startPosition.x.value;
			animatedPos.y.value = translationY + startPosition.y.value;
		}).onEnd(({ velocityX, velocityY }) => {
			'worklet';

			animatedVel.x.value = velocityX / 200;
			animatedVel.y.value = velocityY / 200;
		}).onFinalize(() => {
			'worklet';
			selfIsPaused.value = false;
			animatedPos.x.value = (bounceGeneratorX(animatedPos.x.value, animatedVel.x.value, radius, totalVel.value, masterIsPaused));
			animatedPos.y.value = (bounceGeneratorY(animatedPos.y.value, animatedVel.y.value, radius, totalVel.value, masterIsPaused));
		});

	const backgroundColor = { ...color, a: 0.5 };

	const gesture = Gesture.Race(pan, longPress);
	return (
		<GestureDetector gesture={gesture}>
			<Animated.View
				style={[
					{ position: 'absolute' },
					animatedStyle,
					style,
				]}
			>
				<TouchableOpacity
					style={[
						styles.touchable,
						{ width: radius, height: radius, borderRadius: radius },
						{ backgroundColor: rgba(backgroundColor), borderColor: rgba(color) },
					]}
				>
					{note.title ? (<Text style={[styles.title, FontStyles.textBanner, { maxWidth: radius * 0.75 }]} numberOfLines={1}>{note.title}</Text>) : <></>}
					<Text style={[styles.content, FontStyles.textContent, { maxWidth: radius * 0.8 }]} numberOfLines={3}>{note.content}</Text>
				</TouchableOpacity>
			</Animated.View>
		</GestureDetector>
	);
};
