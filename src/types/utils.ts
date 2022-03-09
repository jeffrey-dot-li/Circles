import type React from 'react';
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

export type PropsWithStyle<P = {}, S = ViewStyle> = P & { style?: StyleProp<S> };
export type FunctionalComponent<P = {}, S = ViewStyle> = React.FunctionComponent<PropsWithStyle<P, S>>;
export type MandateProps<T extends {}, K extends keyof T> = Omit<T, K> & {
  [MK in K]-?: NonNullable<T[MK]>
};

export type ComposeProps<Optional = {}, Mandatory = {}> = Partial<Optional> & Required<Mandatory>;
export type OnPress_f = ((_: GestureResponderEvent) => any);
