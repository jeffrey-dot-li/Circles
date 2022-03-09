import React, { useEffect } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import type { Vector } from 'react-native-redash';
import { animationParameter, withPause } from 'react-native-redash';
import { useVector } from 'react-native-redash/src/Vectors';
import { PanGestureHandler } from 'react-native-gesture-handler';
import type { CircleData } from '../../types/Circles';
import type { PropsWithStyle } from '../../types/utils';
import { withBouncing } from '../../utils/bouncing';
import { rgba } from '~/utils/color';
import FontStyles from '~/static/fonts';
import GlobalStyles from '~/static/styles';

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
  title:
  {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  content:
  {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'left',
    fontSize: 8,
  },
});

interface Props {
  circleData: CircleData
  globalIsPaused: Readonly<Animated.SharedValue<boolean>>
  onPress?: (_: GestureResponderEvent) => void
}

const widthAndHeight = Dimensions.get('screen');
const width = widthAndHeight.width;
const height = widthAndHeight.height;

export const Bubble = ({ circleData: { radius, color, position, velocity, ...note }, globalIsPaused, style, onPress = () => null }: PropsWithStyle<Props>) => {
  const selfIsPaused = useSharedValue(false);
  const masterIsPaused = useDerivedValue(() => selfIsPaused.value || globalIsPaused.value, [selfIsPaused.value, globalIsPaused.value]);

  const startPosition = useVector();
  const animatedPos = useCopyVector(position);
  const animatedVel = useCopyVector(velocity);

  useEffect(() => {
    animatedPos.x.value = (withBouncing(animatedPos.x.value, animatedVel.x.value, radius, width - radius));
    animatedPos.y.value = (withBouncing(animatedPos.y.value, animatedVel.y.value, radius, height - radius));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: animatedPos.x.value },
        { translateY: animatedPos.y.value },
      ],
    };
  });

  const onSwipeEvent = useAnimatedGestureHandler({
    onStart() {
      'worklet';

      startPosition.x.value = animatedPos.x.value;
      startPosition.y.value = animatedPos.y.value;
      selfIsPaused.value = true;
    },
    onActive({ translationX, translationY }) {
      animatedPos.x.value = translationX + startPosition.x.value;
      animatedPos.y.value = translationY + startPosition.y.value;
    },
    onEnd({ velocityX, velocityY }) {
      animatedVel.x.value = velocityX / 200;
      animatedVel.y.value = velocityY / 200;
    },
    onFinish() {
      selfIsPaused.value = false;
      animatedPos.x.value = (withBouncing(animatedPos.x.value, animatedVel.x.value, radius, width - radius));
      animatedPos.y.value = (withBouncing(animatedPos.y.value, animatedVel.y.value, radius, height - radius));
    },
  });
  return (
    <PanGestureHandler
      onGestureEvent={onSwipeEvent}
    >
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
            { backgroundColor: rgba(color) },
          ]}
          onPress={onPress}
        >
          <Text style={[styles.title, FontStyles.textBanner, { maxWidth: radius * 0.75 }]} numberOfLines={1}>{note.title}</Text>
          <Text style={[styles.content, FontStyles.textContent, { maxWidth: radius * 0.8 }]} numberOfLines={3}>{note.content}</Text>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};
