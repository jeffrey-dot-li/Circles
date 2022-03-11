import React, { useCallback } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';

import Animated, {
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { Vector } from 'react-native-redash';
import { clamp, mix } from 'react-native-redash';
import Svg, {
  Path,
} from 'react-native-svg';
import { Feather as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaskedView from '@react-native-community/masked-view';

import { PanGestureHandler } from 'react-native-gesture-handler';
import { SIZE } from './StaticTabbar';
import { curve } from '~/utils/svg';
import { OnPress_f } from '~/types/utils';
// import GlobalStyles from
const AnimatedPath = Animated.createAnimatedComponent(Path);

const COLOR = '#02CBD6';
const END_COLOR = '#00B4D4';
const R = SIZE / 4;
const SCREEN_SIZE = Dimensions.get('window');
const WIDTH = 3.14 * SIZE;
const HEIGHT = 3.5 * SIZE;
const MIN_LEDGE = 15;

const styles = StyleSheet.create({
  buttonRow:
  {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  mainButton:
  {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  icon: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: (Dimensions.get('window').width - WIDTH) / 2,
    width: WIDTH,
    height: HEIGHT,
    alignItems: 'center',
  },
  items: {
    height: HEIGHT - SIZE,
    justifyContent: 'space-evenly',
  },
});

interface TabbarProps {
  open: Animated.SharedValue<number>
  onPress?: Function
}

const vec2 = (x: number, y: number): Vector => {
  'worklet';
  return { x, y };
};

const SCREEN_BOTTOM = () => { 'worklet'; return 2 * MIN_LEDGE; };
const SCREEN_TOP = () => { 'worklet'; return SCREEN_SIZE.height - 2 * MIN_LEDGE - SIZE; };
const ANIMATION_BOX_HEIGHT = () => { 'worklet'; return SCREEN_TOP() - SCREEN_BOTTOM(); };
const animationPercentToPixels = (v: number) => { 'worklet'; return mix(v, SCREEN_BOTTOM(), SCREEN_TOP()); };
const animationPixelsToPercent = (val: number) => { 'worklet'; return clamp((val - SCREEN_BOTTOM()) / ANIMATION_BOX_HEIGHT(), 0, 1); };

const Tabbar = ({ open, onPress = () => null }: TabbarProps) => {
  const openWithSpring = useDerivedValue(() => withSpring(open.value, {
    mass: 1,
    damping: 15,
    restDisplacementThreshold: 0.00001,
    restSpeedThreshold: 0.00001,
  }));
  const animationStartValue = useSharedValue(0);

  const insets = useSafeAreaInsets();

  const pixelsBottomOffset = useDerivedValue(() => animationPercentToPixels(open.value));
  const animatedBottomOffset = useDerivedValue(() => animationPercentToPixels(openWithSpring.value));

  const centerX = useSharedValue(SIZE);

  const icon = useAnimatedStyle(() => ({
    transform: [{ rotate: `${mix(openWithSpring.value, Math.PI / 4, 0)}rad` }],
  }));

  const animatedMaskProps = useAnimatedProps(() => {
    const staticBox = vec2(0, SCREEN_SIZE.height);
    const R = clamp(animatedBottomOffset.value, SIZE, ANIMATION_BOX_HEIGHT());

    const stepY = SIZE / 2; // radius / 2
    const stepX = R;

    const box = vec2(SCREEN_SIZE.width, SIZE);
    const C = R * 0.5;
    // 0.5522847498 is taken from https://spencermortensen.com/articles/bezier-circle/

    const p1 = vec2(centerX.value - 2 * stepX, box.y);
    const p2 = vec2(p1.x + stepX, box.y - stepY);
    const p3 = vec2(p2.x + stepX, box.y - 2 * stepY);
    const p4 = vec2(p3.x + stepX, box.y - stepY);
    const p5 = vec2(p4.x + stepX, box.y);

    const c11 = vec2(p1.x + C, p1.y);
    const c12 = vec2(p2.x, p2.y);

    const c21 = vec2(p2.x, p2.y);
    const c22 = vec2(p3.x - C, p3.y);

    const c31 = vec2(p3.x + C, p3.y);
    const c32 = vec2(p4.x, p4.y);

    const c41 = vec2(p4.x, p4.y);
    const c42 = vec2(p5.x - C, p5.y);

    const d = [
      `M 0 ${SIZE + staticBox.y}`,
      `V ${p1.y}`,
      `H ${p1.x}`,
      curve(c11, c12, p2),
      curve(c21, c22, p3),
      curve(c31, c32, p4),
      curve(c41, c42, p5),
      `H ${box.x}`,
      `V ${SIZE + staticBox.y}`,
      'Z']
      .join(' ');
    return { d };
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onFinish: ({ absoluteY }) => {
      open.value = (absoluteY <= SCREEN_SIZE.height / 2) ? 1 : 0;
    },
    onActive: ({ translationY }) => {
      open.value = animationPixelsToPercent(animationStartValue.value - translationY);
    },
    onStart: () => {
      animationStartValue.value = pixelsBottomOffset.value;
    },
  });
  const style = useAnimatedStyle(() => {
    return {
      top: SCREEN_SIZE.height - animatedBottomOffset.value,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.buttonRow, style, { paddingBottom: insets.bottom + MIN_LEDGE }]}>
        <MaskedView style={[StyleSheet.absoluteFill, { backgroundColor: 'white' }]} maskElement={
          <Svg style={StyleSheet.absoluteFill}>
            <AnimatedPath animatedProps={animatedMaskProps} fill="black"></AnimatedPath>
          </Svg>
        }>
        </MaskedView>
        <Pressable
          style={{
            width: SIZE,
            marginLeft: centerX.value - SIZE / 2,
          }}
          onPress={() => {
            open.value = (open.value === 1 ? 0 : 1);
            // onPress();
          } }
        >
          <View style={[styles.mainButton, { paddingBottom: insets.bottom }]}>
            <Animated.View style={styles.icon}>
              <Animated.View style={icon}>
                <Icon name="x" color={COLOR} size={32} />
              </Animated.View>
            </Animated.View>
          </View>
        </Pressable>

      </Animated.View>
    </PanGestureHandler>
  );
};

export default Tabbar;
