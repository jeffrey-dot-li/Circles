import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import FloatingActionButton, { FAB_SIZE } from '../FloatingActionButton/FloatingActionButton';
import Row from '../tabbar/Row';
import { themeColors } from '~/static/theme';
import type { SavedCircleData } from '~/types/Circles';
import type { FunctionalComponent, ReactProps } from '~/types/utils';
import { rgba } from '~/utils/color';

interface Props {
	id: string
	circleData: SavedCircleData
}

const PocketListItem: FunctionalComponent<Props>
	= ({ id, circleData, children, style }: ReactProps<Props>) => {
		const backgroundColor = { ...circleData.color, a: 0.1 };

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
			<Pressable style={styles.container}>
				<View style={{ flex: 1 }}>

				</View>
				<FloatingActionButton size={40}>
					<Feather name="shopping-bag" color={rgba(themeColors.sunrise[100])} size={24} />
				</FloatingActionButton>

				{/* <View style={{ width: 12 }}/>
				<FloatingActionButton size={40}>
					<Feather name="shopping-bag" color={rgba(themeColors.sunrise[100])} size={24} />
				</FloatingActionButton> */
				}
			</Pressable>
		);
	};

export default PocketListItem;
