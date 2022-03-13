import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AppBar from '~/components/AppBar';
import { FAB_OFFSETS } from '~/components/FloatingActionButton/FloatingActionButton';
import PocketButton from '~/components/FloatingActionButton/PocketButton';
import PocketListItem from '~/components/PocketList/PocketListItem';
import { useAllBubbles, useLoadCircles } from '~/data/hooks/bubbles';

const { height, width, fontScale, scale } = Dimensions.get('screen');

interface Props {

}

const PocketScreen: React.FC<Props> = ({ }: Props) => {
	const loadCircles = useLoadCircles();
	useEffect(() => { loadCircles(); }, []);
	const { allBubbles } = useAllBubbles();
	const navigation = useNavigation();

	return (
		<Pressable style={styles.container} onPress={() => navigation.goBack()}>
			<AppBar title={'Pocket'} onBack={() => navigation.goBack()}/>
			<FlatList style={styles.scrollList}
				data={allBubbles}
				keyExtractor={item => item[0]}
				renderItem={({ item }) => (<PocketListItem circleData={item[1]} id={item[0]}></PocketListItem>)}
			>

			</FlatList>
			<PocketButton startOpen={true}
				style={{ position: 'absolute', left: FAB_OFFSETS.x, bottom: FAB_OFFSETS.y }}
			/>
		</Pressable>

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
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
		paddingTop: 32,
		backgroundColor: 'rgba(0,0,0,0.1)',
	},
	scrollList:
	{
		flex: 1,
		alignSelf: 'stretch',
		display: 'flex',
		flexDirection: 'column',
		// gap: 16,
		padding: 16,
	},
	nonBlurredContent: {
		zIndex: 100,
	},
});
