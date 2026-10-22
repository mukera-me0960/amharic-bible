import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import {
  BookOpen,
  Search,
  Bookmark,
  Sliders,
  ScrollText,
  ChevronDown,
} from 'lucide-react-native';
import { useBible } from '../context/BibleContext';
import { FONT_FAMILIES } from '../theme/typography';
import { toGeezNumeral } from '../utils/amharicUtils';

export const Header: React.FC = () => {
  const {
    theme,
    currentBookMeta,
    currentChapterNumber,
    settings,
    setIsBookSelectorOpen,
    setIsSettingsOpen,
    setIsSearchOpen,
    setIsBookmarksOpen,
    setIsDailyVerseOpen,
  } = useBible();

  const chapterDisplay = settings.geezNumerals
    ? `ምዕራፍ ${toGeezNumeral(currentChapterNumber)}`
    : `ምዕራፍ ${currentChapterNumber}`;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.headerBackground,
          borderBottomColor: theme.borderHairline,
        },
      ]}
    >
      {/* Left Action Buttons */}
      <View style={styles.sideGroup}>
        <TouchableOpacity
          accessibilityLabel="መጽሐፍ ይምረጡ"
          onPress={() => setIsBookSelectorOpen(true)}
          style={[styles.iconButton, { borderColor: theme.borderHairline }]}
          activeOpacity={0.65}
        >
          <BookOpen size={18} color={theme.textSecondary} strokeWidth={1.8} />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="የዕለቱ ቃል"
          onPress={() => setIsDailyVerseOpen(true)}
          style={[styles.iconButton, { borderColor: theme.borderHairline }]}
          activeOpacity={0.65}
        >
          <ScrollText size={17} color={theme.accentGold} strokeWidth={1.8} />
        </TouchableOpacity>
      </View>

      {/* Centered Dignified Book & Chapter Title */}
      <TouchableOpacity
        onPress={() => setIsBookSelectorOpen(true)}
        style={styles.centerTitleContainer}
        activeOpacity={0.7}
      >
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.bookTitle,
              { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
            ]}
            numberOfLines={1}
          >
            {currentBookMeta.titleAm}
          </Text>
          <ChevronDown size={14} color={theme.accentCrimson} style={styles.chevron} />
        </View>

        <Text
          style={[
            styles.chapterSubtitle,
            { color: theme.textSecondary, fontFamily: FONT_FAMILIES.ethiopicSerif },
          ]}
        >
          {chapterDisplay}
        </Text>
      </TouchableOpacity>

      {/* Right Action Buttons */}
      <View style={styles.sideGroup}>
        <TouchableOpacity
          accessibilityLabel="ቃል ፈልግ"
          onPress={() => setIsSearchOpen(true)}
          style={[styles.iconButton, { borderColor: theme.borderHairline }]}
          activeOpacity={0.65}
        >
          <Search size={18} color={theme.textSecondary} strokeWidth={1.8} />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="ዕልባቶችና ማስታወሻዎች"
          onPress={() => setIsBookmarksOpen(true)}
          style={[styles.iconButton, { borderColor: theme.borderHairline }]}
          activeOpacity={0.65}
        >
          <Bookmark size={18} color={theme.textSecondary} strokeWidth={1.8} />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="የንባብ ምርጫዎች"
          onPress={() => setIsSettingsOpen(true)}
          style={[styles.iconButton, { borderColor: theme.borderHairline }]}
          activeOpacity={0.65}
        >
          <Sliders size={18} color={theme.textSecondary} strokeWidth={1.8} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  sideGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  centerTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 17,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  chevron: {
    marginLeft: 4,
    opacity: 0.85,
  },
  chapterSubtitle: {
    fontSize: 12,
    marginTop: 1,
    letterSpacing: 0.5,
    opacity: 0.85,
  },
});
