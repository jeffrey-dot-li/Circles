import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import FloatingActionButton from '~/components/FloatingActionButton/AddBubbleButton';

const { height, width, fontScale, scale } = Dimensions.get('screen');

interface Props {

}

const BubbleCreate: React.FC<Props> = ({ }: Props) => {
  return (
    <View style={styles.container}>
      <FloatingActionButton start={1}/>
    </View>

  );
};

export default BubbleCreate;

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
