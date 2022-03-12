import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { mix } from 'react-native-redash';

import { Feather as Icon } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { themeColors } from '~/static/theme';
import { rgba, toHex } from '~/utils/color';
import type { BubbleNavProp, StackParamList } from '~/navigators/bubbleStack';

interface Props {
  start: number
}
const FAB_OFFSETS
  = {
    x: 20,
    y: 40,
  };
const SIZE = 64;
const styles = StyleSheet.create({
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
});

const PocketButton: React.FC<Props> = ({ start }: Props) => {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<BubbleNavProp<'Home'>>();
  const route = useRoute<RouteProp<StackParamList, 'Home' | 'PocketScreen'>>();
  const open = useSharedValue(start);
  const callback = () => {
    'worklet';
    if (open.value !== start)
      open.value = start;
  };

  const onPress = () => {
    open.value = route.name === 'Home' ? 1 : 0;
    navigation.navigate(route.name === 'Home' ? 'PocketScreen' : 'Home');
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
    <SharedElement id={'pocket-button'} style={{ position: 'absolute', left: FAB_OFFSETS.x, bottom: FAB_OFFSETS.y }}>

      <Pressable
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          backgroundColor: 'white',
        }}
        onPress={onPress}
      >
        <View style={[styles.mainButton]}>
          <Animated.View style={styles.icon}>
            <Animated.View>
              <Icon name="shopping-bag" color={rgba(themeColors.Autumn)} size={SIZE / 2} />
            </Animated.View>
          </Animated.View>
        </View>
      </Pressable>
    </SharedElement>
  );
};

export default PocketButton;
