import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AddBubbleButton from '~/components/FloatingActionButton/AddBubbleButton';
import FloatingActionButton, { FAB_OFFSETS, FAB_SIZE } from '~/components/FloatingActionButton/FloatingActionButton';
import { rgba } from '~/utils/color';
import { themeColors } from '~/static/theme';

const { height, width, fontScale, scale } = Dimensions.get('screen');

interface Props {

}

const BubbleCreate: React.FC<Props> = ({ }: Props) => {
	const saveBubble = () => { };

	return (
		<View style={styles.container}>
			<AddBubbleButton startOpen={true}
				style={{ position: 'absolute', right: FAB_OFFSETS.x, bottom: FAB_OFFSETS.y }}
			/>
			<FloatingActionButton onPress={saveBubble}
				style={{ position: 'absolute', right: FAB_OFFSETS.x, bottom: FAB_OFFSETS.y }}
				color={themeColors.evergreen[65]}
			>
				<Feather name="check" color={'white'} size={FAB_SIZE / 2} />
			</FloatingActionButton>
		</View>

	);
};

export default BubbleCreate;

const styles = StyleSheet.create({
	backdrop: {
		zIndex: 101,
	},
	container: {
		height,
		width,
		position: 'relative',
		paddingTop: 32,
	},
	nonBlurredContent: {
		zIndex: 100,
	},
});
