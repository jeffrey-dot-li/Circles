import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import PocketButton from '~/components/FloatingActionButton/PocketButton';

const { height, width, fontScale, scale } = Dimensions.get('screen');

interface Props {

}

const PocketScreen: React.FC<Props> = ({ }: Props) => {
  return (
    <View style={styles.container}>
      <PocketButton start={1}/>
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
