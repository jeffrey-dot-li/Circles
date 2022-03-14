import React, { useState } from 'react';
import { Dimensions, Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AddBubbleButton from '~/components/FloatingActionButton/AddBubbleButton';
import FloatingActionButton, { FAB_OFFSETS, FAB_SIZE } from '~/components/FloatingActionButton/FloatingActionButton';
import type { Color } from '~/utils/color';
import { rgba, toHex } from '~/utils/color';
import { themeColors } from '~/static/theme';
import AppBar, { TitleTextInput } from '~/components/AppBar';
import ColorSelect from '~/components/Bubbles/ColorSelect';
import GradientBackground from '~/components/Bubbles/GradientBackground';
import { LavaLamp } from '~/components/Bubbles/LavaLamp';
import FontStyles from '~/static/fonts';
import type { CircleData } from '~/types/Circles';
import { DefaultCreateCircleData, useCreateCircles } from '~/data/hooks/bubbles';

const { height, width, fontScale, scale } = Dimensions.get('screen');

interface Props {

}

const BubbleCreate: React.FC<Props> = ({ }: Props) => {
	const [circleData, setCircleData] = useState(DefaultCreateCircleData());
	const setTitle = (v: string) => setCircleData({ ...circleData, title: v });
	const setCircleColor = (c: Color) => setCircleData({ ...circleData, color: c });
	const setContent = (v: string) => setCircleData({ ...circleData, content: v });
	const resetCircleData = () => setCircleData(DefaultCreateCircleData());

	const createNewCircle = useCreateCircles();
	const navigation = useNavigation();
	const saveBubble = () => {
		createNewCircle(circleData);
		navigation.goBack();
	};
	return (

		<Pressable style={[StyleSheet.absoluteFill, styles.container]} onPress={Keyboard.dismiss}>
			<GradientBackground start={circleData?.color}>
				<LavaLamp/>
			</GradientBackground>
			<AppBar TitleBar={
				<TitleTextInput value={circleData.title} onChangeText={setTitle}/>
			}/>

			<View style={[styles.colorBar]}>
				{
					Object.entries(themeColors).map(([, color], i) => (
						<View style={{ padding: 2 }} key={i}>
							<Pressable onPress={() => setCircleColor(color[100])}>
								<ColorSelect active={circleData && toHex(color[100]) === toHex(circleData.color)} color={color[100]} />
							</Pressable>
						</View>
					))
				}
			</View>
			<View style={[styles.content]}>
				<TextInput value={circleData.content} onChangeText={setContent}
					multiline={true}
					style={[styles.contentText, FontStyles.textContent, StyleSheet.absoluteFill]}/>
			</View>
			<AddBubbleButton startOpen={true}
				style={{ position: 'absolute', right: FAB_OFFSETS.x, bottom: FAB_OFFSETS.y }}
			/>
			<FloatingActionButton onPress={saveBubble}
				style={{ position: 'absolute', right: FAB_OFFSETS.x, bottom: FAB_OFFSETS.y }}
				color={themeColors.evergreen[65]}
				type="fill"
			>
				<Feather name="check" color={'white'} size={FAB_SIZE / 2} />
			</FloatingActionButton>
		</Pressable>
	);
};

export default BubbleCreate;

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
		margin: 16,
		borderRadius: 16,
		padding: 6,

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
	backdrop: {
		zIndex: 101,
	},
	nonBlurredContent: {
		zIndex: 100,
	},
});
