import { Platform } from 'react-native';

export const FONT_SIZES = {
  sm: 16,
  md: 18,
  lg: 20,
  xl: 23,
  xxl: 27,
  huge: 32,
};

export const LINE_HEIGHT_FACTORS = {
  compact: 1.65,
  classic: 1.9,
  generous: 2.15,
};

export const FONT_FAMILIES = {
  // Amharic/Ethiopic Serif
  ethiopicSerif: Platform.select({
    web: "'Noto Serif Ethiopic', 'Abyssinica SIL', 'Nyala', 'Ethiopia Jireh', serif",
    ios: 'NotoSerifEthiopic_400Regular',
    android: 'NotoSerifEthiopic_400Regular',
    default: 'serif',
  }),
  ethiopicSerifBold: Platform.select({
    web: "'Noto Serif Ethiopic', 'Abyssinica SIL', 'Nyala', serif",
    ios: 'NotoSerifEthiopic_700Bold',
    android: 'NotoSerifEthiopic_700Bold',
    default: 'serif',
  }),
  // Latin / Numeral Classic Display Serif (for book titles & chapter roman numbers)
  classicSerif: Platform.select({
    web: "'Cinzel', 'EB Garamond', 'Georgia', serif",
    ios: 'Cinzel_700Bold',
    android: 'Cinzel_700Bold',
    default: 'serif',
  }),
  garamondSerif: Platform.select({
    web: "'EB Garamond', 'Georgia', serif",
    ios: 'EBGaramond_500Medium',
    android: 'EBGaramond_500Medium',
    default: 'serif',
  }),
};
