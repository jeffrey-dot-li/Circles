import React from 'react';

// for some reason needs to import react at the top of everything
import type { StackNavigationProp } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';

import type { MapStateToProps } from 'react-redux';
import { connect } from 'react-redux';
import type { types } from '../store';

import BubbleScreen from '~/screens/Splash';
// import BubbleDetails from '~/screens/BubbleDetails';

export interface StackParamList {
  Bubble: undefined
  BubbleDetails:
  {
    id: string
  }
}
export type BubbleNavProp<T extends keyof StackParamList> =
  StackNavigationProp<StackParamList, T>;
interface StateProps { }

type Props = StateProps;

const Snack = createStackNavigator<StackParamList>();

const BubbleStack = (_: Props) => (
  <Snack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Bubble">
    <Snack.Screen component={BubbleScreen} name="Bubble"></Snack.Screen>
    {/* <Snack.Screen component={BubbleDetails} name="BubbleDetails"></Snack.Screen> */}
  </Snack.Navigator>
);

const mapStateToProps: MapStateToProps<StateProps, {}, types.RootState> = () => ({});
export default connect(mapStateToProps)(BubbleStack);
