import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBar from '~/components/AppBar';
import { FAB_OFFSETS } from '~/components/FloatingActionButton/FloatingActionButton';
import PocketButton from '~/components/FloatingActionButton/PocketButton';
import PocketListItem from '~/components/PocketList/PocketListItem';
import type { BubbleRecord } from '~/data/hooks/bubbles';
import { BubbleSorters, useBubbles, useLoadCircles } from '~/data/hooks/bubbles';
import GlobalStyles from '~/static/styles';

interface Props {

}

const PocketScreen: React.FC<Props> = ({ }: Props) => {
	const loadCircles = useLoadCircles();
	useEffect(() => { loadCircles(); }, []);
	const { bubbles } = useBubbles({ sort: BubbleSorters.createdAtRecent });
	const navigation = useNavigation();
	const keyExtractor = (item: BubbleRecord) => item[0];
	const renderItem = ({ item }: { item: BubbleRecord }) => (<PocketListItem circleData={item[1]} id={item[0]}></PocketListItem>);
	return (
		<SafeAreaView style={GlobalStyles.screenContainer}>
			<Pressable style={GlobalStyles.contentContainer} onPress={navigation.goBack.bind(null)}>
				<AppBar title={'Pocket'} onBack={navigation.goBack.bind(null)} />
				<FlatList style={styles.scrollList}
					data={bubbles}
					keyExtractor={keyExtractor}
					renderItem={renderItem}
				>

				</FlatList>
				<PocketButton startOpen={true}
					style={{ position: 'absolute', left: FAB_OFFSETS.x, bottom: FAB_OFFSETS.y }}
				/>
			</Pressable>
		</SafeAreaView>
	);
};

export default PocketScreen;

const styles = StyleSheet.create({
	backdrop:
	{
		zIndex: 101,
	},
	container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
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
