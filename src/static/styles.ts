import { StyleSheet } from 'react-native';

const GlobalStyles = StyleSheet.create({
	borderSolid: {
		borderWidth: 2,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	screenContainer:
	{
		flex: 1,
		position: 'relative',
		display: 'flex',
		flexGrow: 1,
		flexDirection: 'column',
	},
	contentContainer: {
		// Within the safe area
		flex: 1,
		position: 'relative',
	},
	itemList: {
		flex: 1,
		overflow: 'visible',
		paddingTop: 0,
	},
	listTitleText: {
		color: '#393939',
		fontSize: 13,
		fontWeight: 'bold',
		marginVertical: 15,
		marginHorizontal: 30,
		flex: 0,
	},
});

export default GlobalStyles;
