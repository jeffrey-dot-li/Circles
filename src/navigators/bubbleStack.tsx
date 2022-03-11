import React from 'react';

// for some reason needs to import react at the top of everything
import type { StackNavigationProp } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';

import type { MapStateToProps } from 'react-redux';
import { connect } from 'react-redux';
import type { ParamListBase } from '@react-navigation/native';
import type { types } from '../store';

import BubbleScreen from '~/screens/Splash';
import BubbleDetails from '~/screens/BubbleDetails';
import BubbleCreate from '~/screens/BubbleCreate';
import SettingsScreen from '~/screens/Settings';
import PocketScreen from '~/screens/Pocket';
// import BubbleDetails from '~/screens/BubbleDetails';

export interface StackParamList extends ParamListBase {
  Home: undefined
  BubbleDetails:
  {
    id: string
  }
  BubbleCreate: undefined
  PocketScreen: undefined
  SettingsScreen: undefined

}

export type BubbleNavProp<T extends keyof StackParamList> =
  StackNavigationProp<StackParamList, T>;
interface StateProps { }

type Props = StateProps;

const Snack = createStackNavigator<StackParamList>();

const BubbleStack = (_: Props) => (
  <Snack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
    <Snack.Screen component={BubbleScreen} name="Home"></Snack.Screen>

    <Snack.Screen component={PocketScreen} name="PocketScreen"></Snack.Screen>
    <Snack.Screen component={BubbleDetails} name="BubbleDetails"></Snack.Screen>
    <Snack.Screen component={BubbleCreate} name="BubbleCreate"></Snack.Screen>

    <Snack.Screen component={SettingsScreen} name="SettingsScreen"></Snack.Screen>

  </Snack.Navigator>
);

const mapStateToProps: MapStateToProps<StateProps, {}, types.RootState> = () => ({});
export default connect(mapStateToProps)(BubbleStack);
