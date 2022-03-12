import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState, Dimensions, Keyboard, Pressable, StyleSheet, Text, TextStyle, View } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { LavaLamp } from '~/components/Bubbles/LavaLamp';
import FontStyles from '~/static/fonts';
import ColorSelect from '~/components/Bubbles/ColorSelect';
import { themeColors } from '~/static/theme';
import type { BubbleNavProp, StackParamList } from '~/navigators/bubbleStack';
import { useAppSelector } from '~/store/types';
import AppBar, { TitleTextInput } from '~/components/AppBar';
import type { Color } from '~/utils/color';
import { toHex } from '~/utils/color';
import { useDeleteCircle, useUpdateCircle } from '~/data/hooks/bubbles';
import GradientBackground from '~/components/Bubbles/GradientBackground';

type ItemDetailsRouteProp = RouteProp<StackParamList, 'BubbleDetails'>;
interface OwnProps {
	navigation: BubbleNavProp<'BubbleDetails'>
	route: ItemDetailsRouteProp
}

type Props = OwnProps;

const BubbleDetails = ({ navigation, route: { params: { id } } }: Props) => {
	const circleData = useAppSelector(state => state.bubbles.circleDatas[id]);

	const deleteBubble = useDeleteCircle();
	const updateCircle = useUpdateCircle();
	const [title, setTitle] = useState(circleData?.title);
	const [content, setContent] = useState(circleData?.content);

	const SaveBubble = useCallback(() => circleData ? updateCircle({ title, content }, id) : null, [updateCircle, title, content, id, circleData]);
	useEffect(() => {
		navigation.addListener('beforeRemove', SaveBubble);
		return () => navigation.removeListener('beforeRemove', SaveBubble);
	}, [navigation, SaveBubble]);

	const SaveBubbleAppState = useCallback((s: AppStateStatus) => {
		return s !== 'active' ? SaveBubble() : undefined;
	}, [SaveBubble]);

	useEffect(() => {
		AppState.addEventListener('change', SaveBubbleAppState);
		return () => AppState.removeEventListener('change', SaveBubbleAppState);
	}, [SaveBubbleAppState]);

	const updateCircleColor
= useCallback((color: Color) => circleData ? updateCircle({ color }, id) : null, [updateCircle, id, circleData]);

	const options = [{
		name: 'Pop',
		onPress: () => null,
	}, {
		name: 'Delete',
		onPress: async() => {
			await deleteBubble(id);
			navigation.pop();
		},
	}];

	return (

		<Pressable style={[StyleSheet.absoluteFill, styles.container]} onPress={Keyboard.dismiss}>
			<GradientBackground start={circleData?.color}>
				<LavaLamp/>
			</GradientBackground>
			<AppBar TitleBar={<TitleTextInput value={title} onChangeText={setTitle} onBlur={SaveBubble}/>} onBack={() => navigation.pop()} options={options}></AppBar>
			<View style={[styles.colorBar]}>
				{
					Object.entries(themeColors).map(([, color], i) => (
						<View style={{ padding: 2 }} key={i}>
							<Pressable onPress={() => updateCircleColor(color[100])}>
								<ColorSelect active={circleData && toHex(color[100]) === toHex(circleData.color)} color={color[100]} />
							</Pressable>
						</View>
					))
				}
			</View>
			<View style={[styles.content]}>
				<TextInput value={content} onChangeText={setContent} onBlur={SaveBubble}
					multiline={true}
					style={[styles.contentText, FontStyles.textContent, StyleSheet.absoluteFill]}/>
			</View>
		</Pressable>
	);
};
export default (BubbleDetails);

const { width, height } = Dimensions.get('window');

const gradientColors = ['rgba(255,255,255,1)', 'rgba(255,255,255,0.1)'];

const styles = StyleSheet.create({
	container: {
		height,
		width,
		flexGrow: 1,
		position: 'relative',
		flexDirection: 'column',
	},
	title:
	{
		fontSize: 48,
		color: '#2D2D2D',
	},
	content:
	{
		flex: 1,
		alignSelf: 'stretch',
		backgroundColor: 'rgba(255,255,255,0.7)',
	},
	contentText:
	{
		textAlignVertical: 'top',
		justifyContent: 'flex-start',
		fontSize: 16,
		padding: 24,
	},
	colorBar:
	{

		flexDirection: 'row',
		justifyContent: 'center',
		alignContent: 'center',
		margin: 24,
		backgroundColor: 'white',
		padding: 6,
		borderRadius: 30,
		alignSelf: 'center',
	},
});
