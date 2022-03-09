import { useFonts } from 'expo-font';
import { StyleSheet } from 'react-native';
import {
  Rubik_500Medium as Rubik,
} from '@expo-google-fonts/rubik';

export const useProjectFonts = () => {
  const loadFonts = useFonts({
    'Pesta Stencil': require('../../assets/fonts/PestaStencil-Regular.ttf'),
    'Pesta Stencil Bold': require('../../assets/fonts/PestaStencil-Bold.ttf'),

    'Quicksand': require('../../assets/fonts/quicksand/Quicksand-Medium.ttf'),
    Rubik,
    'Proxima Soft': require('../../assets/fonts/Proxima-Soft.otf'),
  });
  return loadFonts;
};

const fontStylesObject = {
  textTitle:
    {
      fontFamily: '',
    },
  textBanner:
    {
      fontFamily: 'Pesta Stencil',
    },
  textBannerBold:
    {
      fontFamily: 'Pesta Stencil Bold',
    },
  textSubRound:
    {
      fontFamily: 'Proxima Soft',
    },
  textSubStraight:
    {
      fontFamily: 'Rubik',
    },
  textContent:
    {
      fontFamily: 'Quicksand',
    },

} as const;
const FontStyles = StyleSheet.create(fontStylesObject);
export default FontStyles;
