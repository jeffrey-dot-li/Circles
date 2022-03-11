import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';
import { mix } from 'react-native-redash';

import { Feather as Icon } from '@expo/vector-icons';
import { themeColors } from '~/static/theme';
import { rgba, toHex } from '~/utils/color';

const COLOR = themeColors.Iris;

interface Props {
  onPress: () => void
  open: Animated.SharedValue<number>
}

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

const FloatingActionButton: React.FC<Props> = ({ onPress, open }: Props) => {
  const openWithSpring = useDerivedValue(() => withSpring(open.value, {
    mass: 1,
    damping: 15,
    restDisplacementThreshold: 0.00001,
    restSpeedThreshold: 0.00001,
  }));
  const icon = useAnimatedStyle(() => ({
    transform: [{ rotate: `${mix(openWithSpring.value, Math.PI / 4, 0)}rad` }],
  }));
  return (
    <Pressable
      style={{
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        backgroundColor: 'white',
        // marginLeft: centerX.value - SIZE / 2,
      }}
      onPress={onPress}
    >
      <View style={[styles.mainButton]}>
        <Animated.View style={styles.icon}>
          <Animated.View style={icon}>
            <Icon name="x" color={rgba(COLOR)} size={SIZE / 2} />
          </Animated.View>
        </Animated.View>
      </View>
    </Pressable>
  );
};

export default FloatingActionButton;
