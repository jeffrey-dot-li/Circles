import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'; // eslint-disable-line
import Animated, {
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Vector, useVector } from 'react-native-redash';
import { connect } from 'react-redux';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bounceGenerator } from '~/utils/bouncing';
import Tabbar from '~/components/tabbar/Tabbar';
import Backdrop from '~/components/tabbar/Backdrop';
import GlobalStyles from '~/static/styles';
import { SavedCircleData } from '~/types/Circles';
import { Bubble } from '~/components/Bubbles/Bubble';
import { LavaLamp } from '~/components/Bubbles/LavaLamp';
import type { bubbles } from '~/store/types';
import type { BubbleNavProp, StackParamList } from '~/navigators/bubbleStack';
import useBubbles, { useCreateCircles, useLoadCircles } from '~/data/hooks/bubbles';
import { CircleDatas } from '~/static/mockCircles';
import GradientBackground from '~/components/Bubbles/GradientBackground';
import FloatingActionButton from '~/components/FloatingActionButton/FloatingActionButton';

const widthAndHeight = Dimensions.get('screen');
const width = widthAndHeight.width;
const height = widthAndHeight.height;

interface NoteItem {
  id: number
  text: string
  is_toggled: boolean
}

// const bounceX = bounceGenerator(0, width);
// const bounceY = bounceGenerator(0, height);

type ItemDetailsRouteProp = RouteProp<StackParamList, 'Bubble'>;
interface OwnProps {
  navigation: BubbleNavProp<'Bubble'>
  route: ItemDetailsRouteProp
}

type StateProps = Pick<bubbles.State, 'circleDatas'>;
type Props = StateProps & OwnProps;

const FAB_OFFSETS
= {
  x: 20,
  y: 40,
};

const BubblesScreen = ({ navigation }: Props) => {
  const { activeBubbles } = useBubbles();
  const loadCircles = useLoadCircles();
  const createCircle = useCreateCircles();
  useEffect(() => { loadCircles(); }, []);
  const tabbarOpen = useSharedValue(0);

  const createBubbleCallback = useCallback(async() => {
    const createResult = createCircle();
    setTimeout(async() => tabbarOpen.value === 1 ? navigation.push('BubbleDetails', { id: (await createResult).id }) : null, 300);
  }, [tabbarOpen.value]);

  const insets = useSafeAreaInsets();
  const onPlusPress = () => {
    tabbarOpen.value = tabbarOpen.value === 1 ? 0 : 1;
  };

  const globalIsPaused = useDerivedValue(() => tabbarOpen.value === 1);
  return (
    <View style={styles.container}>
      <GradientBackground>
        <LavaLamp />
      </GradientBackground>
      {activeBubbles.map(([id, item]) => (
        <Bubble circleData={item} key={id} globalIsPaused={globalIsPaused} onPress={() => navigation.push('BubbleDetails', { id })} />
      ))}
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end' }, styles.backdrop]} pointerEvents="box-none">
        <Backdrop open={tabbarOpen} />
        <View style={{ position: 'absolute', right: FAB_OFFSETS.x, bottom: insets.bottom + FAB_OFFSETS.y }}>
          <FloatingActionButton onPress={onPlusPress} open={tabbarOpen} ></FloatingActionButton>
        </View>

        {/* <Tabbar open={tabbarOpen} onPress={createBubbleCallback} /> */}
      </View>

    </View>
  );
};

export default (BubblesScreen);
const styles = StyleSheet.create({
  backdrop:
  {
    zIndex: 101,
  },
  container: {
    height,
    width,
    position: 'relative',
    paddingTop: 32,
  },
  nonBlurredContent: {
    zIndex: 100,
  },
});
