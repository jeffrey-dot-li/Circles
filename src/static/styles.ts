import { StyleSheet } from 'react-native';

const GlobalStyles = StyleSheet.create({
  borderSolid: {
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
  },
  container: {
    flex: 1,
    backgroundColor: '#f3f3f9',
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
