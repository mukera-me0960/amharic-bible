import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useBible } from '../context/BibleContext';
import { FONT_FAMILIES } from '../theme/typography';

interface OrnamentalDividerProps {
  type?: 'cross' | 'filigree' | 'hairline' | 'chapterEnd';
  style?: object;
}

export const OrnamentalDivider: React.FC<OrnamentalDividerProps> = ({
  type = 'cross',
  style,
}) => {
  const { theme } = useBible();

  if (type === 'hairline') {
    return (
      <View
        style={[
          styles.hairlineContainer,
          { borderBottomColor: theme.borderHairline },
          style,
        ]}
      />
    );
  }

  if (type === 'chapterEnd') {
    return (
      <View style={[styles.ornamentalContainer, style]}>
        <View style={[styles.line, { backgroundColor: theme.borderHairline }]} />
        <Text style={[styles.symbol, { color: theme.accentCrimson }]}>❖ ✥ ❖</Text>
        <View style={[styles.line, { backgroundColor: theme.borderHairline }]} />
      </View>
    );
  }

  if (type === 'filigree') {
    return (
      <View style={[styles.ornamentalContainer, style]}>
        <View style={[styles.line, { backgroundColor: theme.borderHairline }]} />
        <Text style={[styles.symbol, { color: theme.accentGold }]}>✢ ✥ ✢</Text>
        <View style={[styles.line, { backgroundColor: theme.borderHairline }]} />
      </View>
    );
  }

  // Traditional cross motif
  return (
    <View style={[styles.ornamentalContainer, style]}>
      <View style={[styles.line, { backgroundColor: theme.borderHairline }]} />
      <Text style={[styles.crossSymbol, { color: theme.accentCrimson }]}>✟</Text>
      <View style={[styles.line, { backgroundColor: theme.borderHairline }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  hairlineContainer: {
    width: '100%',
    borderBottomWidth: 1,
    marginVertical: 12,
  },
  ornamentalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 18,
    paddingHorizontal: 24,
  },
  line: {
    flex: 1,
    height: 1,
  },
  symbol: {
    marginHorizontal: 12,
    fontSize: 12,
    letterSpacing: 4,
    opacity: 0.8,
  },
  crossSymbol: {
    marginHorizontal: 14,
    fontSize: 14,
    fontFamily: FONT_FAMILIES.garamondSerif,
    opacity: 0.85,
  },
});
