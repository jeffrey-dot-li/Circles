import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import FloatingActionButton, { FAB_SIZE } from '../FloatingActionButton/FloatingActionButton';
import Row from '../tabbar/Row';
import { themeColors } from '~/static/theme';
import type { SavedCircleData } from '~/types/Circles';
import type { FunctionalComponent, ReactProps } from '~/types/utils';
import { rgba } from '~/utils/color';
import FontStyles from '~/static/fonts';
import { useUpdateCircle } from '~/data/hooks/bubbles';
import type { BubbleNavProp } from '~/navigators/bubbleStack';

interface Props {
	id: string
	circleData: SavedCircleData
}

const PocketListItem: FunctionalComponent<Props>
	= ({ id, circleData, children, style }: ReactProps<Props>) => {
		const backgroundColor = { ...circleData.color, a: 0.1 };
		const updateCircle = useUpdateCircle();
		const togglePopped = useCallback(() => {
			updateCircle({ popped: !circleData.popped }, id);
		}, [circleData.popped]);
		const navigation = useNavigation<BubbleNavProp<'Pocket'>>();

		const styles = StyleSheet.create({
			container: {
				width: '100%',
				borderRadius: 12,
				padding: 12,
				borderStyle: 'solid',
				borderWidth: 2,
				borderColor: rgba(circleData.color),
				backgroundColor: rgba(backgroundColor),

				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
			},

		});
		return (
			<>
				<Pressable style={styles.container} onPress={() => navigation.navigate('BubbleDetails', { id })}>
					<View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignSelf: 'stretch' }}>
						{circleData.title ? (<Text style={[staticStyles.title, FontStyles.textBanner]} numberOfLines={1}>{circleData.title}</Text>) : <></>}
						<Text style={[staticStyles.content, FontStyles.textContent, {}]} numberOfLines={3}>{circleData.content}</Text>
					</View>
					<View style={{ width: 20 }}/>
					<FloatingActionButton size={40} type={circleData.popped ? 'fill' : 'ghost'} color={(themeColors.sunrise[100])} onPress={togglePopped}>
						<Feather name="shopping-bag" color={circleData.popped ? 'white' : rgba(themeColors.sunrise[100])} size={24} />
					</FloatingActionButton>
				</Pressable>
				<View style={{ height: 16 }}/>
			</>
		);
	};

export default PocketListItem;

const staticStyles = StyleSheet.create({
	touchable: {
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 10,
		flexDirection: 'column',
		justifyContent: 'center',
		alignContent: 'center',
		shadowOffset: {
			width: 5,
			height: 5,
		},
		zIndex: 1,
		elevation: 3,

		// borderWidth: 4,
		// borderStyle: 'solid',
	},
	title: {
		alignSelf: 'stretch',
		color: 'white',
		textAlign: 'left',
		fontSize: 14,
		marginBottom: 2,
	},
	content: {
		alignSelf: 'stretch',
		color: 'white',
		textAlign: 'left',
		fontSize: 8,
	},
});
