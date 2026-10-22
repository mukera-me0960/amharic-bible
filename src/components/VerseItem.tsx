import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bookmark, FileText } from 'lucide-react-native';
import { useBible } from '../context/BibleContext';
import { RenderedVerse } from '../data/bibleLoader';
import { FONT_FAMILIES, LINE_HEIGHT_FACTORS } from '../theme/typography';
import { HighlightColorKey } from '../utils/storage';

interface VerseItemProps {
  verse: RenderedVerse;
  isFirstVerse?: boolean;
}

export const VerseItem: React.FC<VerseItemProps> = ({ verse, isFirstVerse = false }) => {
  const {
    theme,
    settings,
    setSelectedVerse,
    selectedVerse,
    getVerseHighlight,
    isVerseBookmarked,
    getVerseNote,
  } = useBible();

  const isSelected = selectedVerse?.id === verse.id;
  const highlight = getVerseHighlight(verse);
  const isBookmarked = isVerseBookmarked(verse);
  const note = getVerseNote(verse);

  const getHighlightBg = (colorKey: HighlightColorKey): string => {
    switch (colorKey) {
      case 'vermilion':
        return theme.highlightVermilion;
      case 'saffron':
        return theme.highlightSaffron;
      case 'sage':
        return theme.highlightSage;
      case 'lapis':
        return theme.highlightLapis;
      case 'ochre':
        return theme.highlightOchre;
      default:
        return 'transparent';
    }
  };

  const highlightBg = highlight ? getHighlightBg(highlight.colorKey) : 'transparent';
  const displayVerseNum = settings.geezNumerals ? verse.verseLabelGeez : verse.verseLabel;

  const lineHeightFactor = LINE_HEIGHT_FACTORS[settings.lineHeightKey] || LINE_HEIGHT_FACTORS.classic;
  const computedLineHeight = Math.round(settings.fontSize * lineHeightFactor);

  const verseNumberColor = settings.rubricatedNumbers
    ? theme.textVerseNumber
    : theme.textMuted;

  // Render for Verse Reference Mode (Distinct lines)
  if (settings.readingMode === 'verse') {
    return (
      <TouchableOpacity
        onPress={() => setSelectedVerse(isSelected ? null : verse)}
        activeOpacity={0.7}
        delayPressIn={60}
        style={[
          styles.verseModeContainer,
          {
            backgroundColor: isSelected
              ? theme.activeItemBg
              : highlightBg !== 'transparent'
              ? highlightBg
              : 'transparent',
            borderLeftColor: isSelected ? theme.accentCrimson : 'transparent',
          },
        ]}
      >
        {/* Verse Number Column */}
        <View style={styles.numberColumn}>
          <Text
            style={[
              styles.verseNumberText,
              {
                color: verseNumberColor,
                fontFamily: settings.geezNumerals
                  ? FONT_FAMILIES.ethiopicSerif
                  : FONT_FAMILIES.garamondSerif,
              },
            ]}
          >
            {displayVerseNum}
          </Text>
        </View>

        {/* Verse Scripture Text */}
        <View style={styles.textColumn}>
          <Text
            style={[
              styles.scriptureText,
              {
                color: theme.textPrimary,
                fontSize: settings.fontSize,
                lineHeight: computedLineHeight,
                fontFamily: FONT_FAMILIES.ethiopicSerif,
              },
            ]}
          >
            {verse.text}
          </Text>

          {/* Indicators for Notes & Bookmarks */}
          {(isBookmarked || note) && (
            <View style={styles.indicatorsRow}>
              {isBookmarked && (
                <Bookmark
                  size={12}
                  color={theme.accentCrimson}
                  fill={theme.accentCrimson}
                  style={styles.indicatorIcon}
                />
              )}
              {note && (
                <FileText
                  size={12}
                  color={theme.accentGold}
                  style={styles.indicatorIcon}
                />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // Render for Continuous Flow Mode
  return (
    <TouchableOpacity
      onPress={() => setSelectedVerse(isSelected ? null : verse)}
      activeOpacity={0.7}
      delayPressIn={60}
      style={[
        styles.flowVerseWrapper,
        {
          backgroundColor: isSelected
            ? theme.activeItemBg
            : highlightBg !== 'transparent'
            ? highlightBg
            : 'transparent',
        },
      ]}
    >
      <Text
        style={[
          styles.scriptureText,
          {
            color: theme.textPrimary,
            fontSize: settings.fontSize,
            lineHeight: computedLineHeight,
            fontFamily: FONT_FAMILIES.ethiopicSerif,
          },
        ]}
      >
        <Text
          style={[
            styles.superscriptNum,
            {
              color: verseNumberColor,
              fontSize: Math.max(11, Math.round(settings.fontSize * 0.62)),
              fontFamily: settings.geezNumerals
                ? FONT_FAMILIES.ethiopicSerifBold
                : FONT_FAMILIES.garamondSerif,
            },
          ]}
        >
          {`${displayVerseNum} `}
        </Text>
        {verse.text}
        {'  '}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Verse mode styles
  verseModeContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 2,
    borderRadius: 2,
    borderLeftWidth: 2,
  },
  numberColumn: {
    width: 38,
    paddingTop: 3,
    alignItems: 'flex-start',
  },
  verseNumberText: {
    fontSize: 13,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  textColumn: {
    flex: 1,
  },
  scriptureText: {
    letterSpacing: 0.2,
    textAlign: 'left',
  },
  indicatorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  indicatorIcon: {
    opacity: 0.85,
  },

  // Continuous flow mode styles
  flowVerseWrapper: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  superscriptNum: {
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingRight: 3,
  },
});
