/* eslint-disable no-tabs */
import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { themeColors } from '~/static/theme';
import type { FunctionalComponent, ReactProps } from '~/types/utils';
import type { Color } from '~/utils/color';
import { $toHex, HSLWhite } from '~/utils/color';

interface Props {
	onPress: () => void
	size?: number
	color?: Color
}

export const FAB_OFFSETS = {
	x: 20,
	y: 40,
};

export const FAB_SIZE = 64;

const FloatingActionButton: FunctionalComponent<Props>
	= ({ onPress, size = FAB_SIZE, color = HSLWhite, style, children }: ReactProps<Props>) => {
		const buttonStyles = StyleSheet.create({
			floatingActionButton: {
				...style,
				justifyContent: 'flex-end',
				alignItems: 'center',
				width: size,
				height: size,
				borderRadius: size / 2,
				backgroundColor: $toHex(color),
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
				style={ buttonStyles.floatingActionButton }
				onPress={onPress}
			>
				<View style={[buttonStyles.iconBox]}>
					{children}
				</View>
			</Pressable>
		);
	};

export default FloatingActionButton;
