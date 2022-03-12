import type { PropsWithChildren } from 'react';
import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Color } from '~/utils/color';
import { rgba } from '~/utils/color';
import { themeColors } from '~/static/theme';

interface Props {
	start?: Color
	end?: Color
}

const GradientBackground = ({ children, start = themeColors.blossom[100], end = themeColors.twilight[100] }: PropsWithChildren<Props>) => {
	return (
		<LinearGradient colors={[rgba(start), rgba(end)]} style={[StyleSheet.absoluteFill]}>{children}</LinearGradient>
	);
};

export default GradientBackground;
