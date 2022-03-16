import type { ReactNode } from 'react';
import React, { ComponentType, FunctionComponent, useEffect, useRef, useState } from 'react';

import type { TextInputProps } from 'react-native';
import { Pressable, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTiming } from 'react-native-redash';

import FontStyles from '~/static/fonts';
import type { OnPress_f } from '~/types/utils';
import { PropsWithStyle } from '~/types/utils';

export const TitleTextInput = (props: TextInputProps) =>
	(<TextInput {...props} style={[styles.title, FontStyles.textBanner]} placeholder="Title" numberOfLines={1}></TextInput>);
interface ActionButtons {
	options?: null | {
		name: string
		onPress: OnPress_f
	}[]
	onBack?: null | OnPress_f
}

type TitleProp = {
	title: string
	TitleBar?: null
} | {
	title?: null
	TitleBar: ReactNode
};

type Props = TitleProp & ActionButtons;

const AppBar = ({
	title,
	TitleBar,
	onBack = null,
	options = null,
}: Props) => {
	const iconSize = 32;
	const [open, setOpen] = useState(false);
	const animatedOptionsMenu = useTiming(open, { duration: 100 });
	const optionsAnimatedStyle = useAnimatedStyle(() => {
		return {
			opacity: animatedOptionsMenu.value,
		};
	});

	return (
		<>
			<Animated.View
				style={{
					padding: 12,
					paddingTop: 12,
					zIndex: 1,
				}}>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

					{/* Block flex-start */}
					<View style={[styles.row, { flexShrink: 1 }]}>
						{onBack
							? (
								<TouchableOpacity style={[]} onPress={onBack} >
									<Feather name="chevron-left" size={iconSize} color="white" style={[]} />
								</TouchableOpacity>
							)
							: <></>
						}
						{
							TitleBar || (
								<Text style={[styles.title, FontStyles.textBanner]} numberOfLines={1}>
									{title}
								</Text>
							)
						}

					</View>

					{/* Block flex-end */}
					<View style={[styles.row, { flexShrink: 0 }]}>
						{options
							? (
								<TouchableOpacity onPress={() => setOpen(true)}>
									<Feather name="more-vertical" size={iconSize} color="white" style={{}} />
								</TouchableOpacity>
							)
							: <></>}
					</View>
				</View>

			</Animated.View>
			{/* Click off */}
			<Pressable style={[StyleSheet.absoluteFill, styles.clickOff]} onPress={() => setOpen(false)} pointerEvents={open ? 'auto' : 'none'} />
			{/* Options Menu */}
			<Animated.View style={[styles.optionsMenu, { top: 18, right: 18 }, optionsAnimatedStyle]} pointerEvents={open ? 'auto' : 'none'}>
				{
					options?.map(({ name, onPress }, i) => (
						<TouchableOpacity key={i} onPress={onPress} style={[styles.menuItem]}>
							<Text style={[FontStyles.textContent, { fontSize: 18, textAlignVertical: 'center' }]}> {name}</Text>
						</TouchableOpacity>
					))
				}
			</Animated.View>

		</>
	);
};

export default AppBar;

const styles = StyleSheet.create({
	row:
	{
		flexDirection: 'row', alignItems: 'center',
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	title: {
		color: 'white',
		flexShrink: 1,
		fontSize: 36,
		paddingHorizontal: 8,
	},
	optionsMenu:
	{
		flexDirection: 'column',
		position: 'absolute',
		width: 144,
		borderRadius: 24,
		backgroundColor: 'white',
		zIndex: 100001,
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 10,
	},
	clickOff:
	{
		zIndex: 100000,
		// backgroundColor: 'rgba(0,0,0,0.2)',
	},
	menuItem:
	{
		alignSelf: 'stretch',
		padding: 10,
	},
});
