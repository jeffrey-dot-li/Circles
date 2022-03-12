/* eslint-disable no-tabs */
import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { themeColors } from '~/static/theme';
import type { FunctionalComponent, ReactProps } from '~/types/utils';
import { rgba } from '~/utils/color';

interface Props {
	onPress: () => void
	size?: number
}

export const FAB_OFFSETS = {
	x: 20,
	y: 40,
};

export const FAB_SIZE = 64;

const FloatingActionButton: FunctionalComponent<Props>
	= ({ children, onPress, size = FAB_SIZE }: ReactProps<Props>) => {
		const styles = StyleSheet.create({
			floatingActionButton: {
				justifyContent: 'flex-end',
				alignItems: 'center',
				width: size,
				height: size,
				borderRadius: size / 2,
				backgroundColor: 'white',
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
				style={styles.floatingActionButton}
				onPress={onPress}
			>
				<View style={[styles.iconBox]}>
					{children}
				</View>
			</Pressable>
		);
	};

export default FloatingActionButton;
