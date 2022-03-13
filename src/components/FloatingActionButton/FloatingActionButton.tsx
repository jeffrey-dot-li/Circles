/* eslint-disable no-tabs */
import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { themeColors } from '~/static/theme';
import type { FunctionalComponent, ReactProps } from '~/types/utils';
import type { Color } from '~/utils/color';
import { $toHex, HSLWhite } from '~/utils/color';

type ButtonType = 'standard' | 'outline' | 'ghost' | 'fill';

export const FAB_SIZE = 64;
interface Props {
	onPress?: () => void
	size?: number
	color?: Color
	type?: ButtonType
}

const defaultProps: Required<Props>
= {
	onPress: () => {},
	size: FAB_SIZE,
	color: HSLWhite,
	type: 'standard',
};

export const FAB_OFFSETS = {
	x: 20,
	y: 40,
};

const buttonStyle = (type: ButtonType, color: Color) => {
	switch (type) {
		case 'standard':
			return {
				backgroundColor: $toHex(HSLWhite),
			};
		case 'outline':
			return {
				borderStyle: 'solid' as const,
				borderWidth: 1,
				backgroundColor: $toHex(HSLWhite),
				borderColor: $toHex(color),
			};
		case 'ghost':
			return {
				borderStyle: 'solid' as const,
				borderWidth: 1,
				borderColor: $toHex(color),
				backgroundColor: 'transparent',
			};
		case 'fill':
			return {
				backgroundColor: $toHex(color),
			};
		default:
			return {
				backgroundColor: $toHex(HSLWhite),
			};
	}
};

const FloatingActionButton: FunctionalComponent<Props>
	= ({ style, children, ...props }: ReactProps<Props>) => {
		const { size, color, onPress, type } = { ...defaultProps, ...props };

		const buttonStyles = StyleSheet.create({
			floatingActionButton: {
				...style,
				justifyContent: 'flex-end',
				alignItems: 'center',
				width: size,
				height: size,
				borderRadius: size / 2,
				...buttonStyle(type, color),
			},
			iconBox:
			{
				width: size,
				height: size,
				borderRadius: size / 2,
				justifyContent: 'center',
				alignItems: 'center',
			},
		});

		return (
			<Pressable
				style={ [buttonStyles.floatingActionButton] }
				onPress={onPress}
			>
				<View style={[buttonStyles.iconBox]}>
					{children}
				</View>
			</Pressable>
		);
	};

export default FloatingActionButton;
