import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { FAB_OFFSETS } from '~/components/FloatingActionButton/FloatingActionButton';
import PocketButton from '~/components/FloatingActionButton/PocketButton';

const { height, width, fontScale, scale } = Dimensions.get('screen');

interface Props {

}

const PocketScreen: React.FC<Props> = ({ }: Props) => {
	return (
		<View style={styles.container}>
			<PocketButton startOpen={true}
				style={{ position: 'absolute', left: FAB_OFFSETS.x, bottom: FAB_OFFSETS.y }}
			/>
		</View>

	);
};

export default PocketScreen;

const styles = StyleSheet.create({
	backdrop:
	{
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
