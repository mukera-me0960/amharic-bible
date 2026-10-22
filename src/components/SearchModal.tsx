import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react-native';
import { useBible } from '../context/BibleContext';
import { searchBible, SearchResultItem } from '../data/bibleLoader';
import { FONT_FAMILIES } from '../theme/typography';
import { toGeezNumeral } from '../utils/amharicUtils';

const SEARCH_SUGGESTIONS = [
  'እግዚአብሔር',
  'ኢየሱስ',
  'ፍቅር',
  'እምነት',
  'ሰላም',
  'ብርሃን',
  'ሕይወት',
  'ጸጋ',
  'ተስፋ',
  'ቅዱስ',
];

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    goToBookAndChapter,
    theme,
    settings,
  } = useBible();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | 'OT' | 'NT'>('ALL');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const results: SearchResultItem[] = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
    return searchBible(
      searchQuery,
      testamentFilter === 'ALL' ? undefined : testamentFilter,
      60
    );
  }, [searchQuery, testamentFilter]);

  const handleSelectResult = (item: SearchResultItem) => {
    goToBookAndChapter(item.bookIndex, item.chapterNumber);
    setIsSearchOpen(false);
  };

  const handleClose = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <Modal
      visible={isSearchOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        {/* Top Header */}
        <View style={[styles.headerBar, { borderBottomColor: theme.borderHairline }]}>
          <Text
            style={[
              styles.headerTitle,
              { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
            ]}
          >
            የቃላት ፍለጋና ማውጫ
          </Text>

          <TouchableOpacity
            onPress={handleClose}
            style={[styles.closeButton, { borderColor: theme.borderHairline }]}
            activeOpacity={0.7}
          >
            <X size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Search Input Box */}
        <View style={styles.searchSection}>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderHairline,
              },
            ]}
          >
            <Search size={18} color={theme.accentCrimson} style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="በመጽሐፍ ቅዱስ ውስጥ ቃል ወይም ሐረግ ይፈልጉ..."
              placeholderTextColor={theme.textMuted}
              style={[
                styles.input,
                { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
              ]}
              autoFocus={false}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={theme.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Filter Pills: All / Old Testament / New Testament */}
          <View style={styles.filtersRow}>
            {(
              [
                { key: 'ALL', label: 'መላው መጽሐፍ ቅዱስ' },
                { key: 'OT', label: 'ብሉይ ኪዳን' },
                { key: 'NT', label: 'አዲስ ኪዳን' },
              ] as { key: 'ALL' | 'OT' | 'NT'; label: string }[]
            ).map((f) => {
              const isSelected = testamentFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => setTestamentFilter(f.key)}
                  style={[
                    styles.filterPill,
                    {
                      backgroundColor: isSelected
                        ? theme.accentCrimson
                        : theme.cardBackground,
                      borderColor: isSelected
                        ? theme.accentCrimson
                        : theme.borderHairline,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      {
                        color: isSelected ? '#FFFFFF' : theme.textSecondary,
                        fontFamily: FONT_FAMILIES.ethiopicSerif,
                      },
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick Suggestions Chips (if empty query) */}
          {!searchQuery && (
            <View style={styles.suggestionsContainer}>
              <Text
                style={[
                  styles.suggestionsLabel,
                  { color: theme.textMuted, fontFamily: FONT_FAMILIES.ethiopicSerif },
                ]}
              >
                የተለመዱ ፍለጋዎች፦
              </Text>
              <View style={styles.chipsRow}>
                {SEARCH_SUGGESTIONS.map((word) => (
                  <TouchableOpacity
                    key={word}
                    onPress={() => setSearchQuery(word)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: theme.cardBackground,
                        borderColor: theme.borderHairline,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: theme.textPrimary,
                          fontFamily: FONT_FAMILIES.ethiopicSerif,
                        },
                      ]}
                    >
                      {word}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Results List */}
        <ScrollView
          style={styles.resultsScrollView}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
        >
          {searchQuery && results.length === 0 && (
            <View style={styles.emptyResultsBox}>
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.textMuted, fontFamily: FONT_FAMILIES.ethiopicSerif },
                ]}
              >
                ምንም የተገኘ ጥቅስ የለም።
              </Text>
            </View>
          )}

          {results.length > 0 && (
            <View style={styles.resultsHeaderRow}>
              <Text
                style={[
                  styles.resultsCountText,
                  { color: theme.accentCrimson, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                ]}
              >
                {results.length} የተገኙ ጥቅሶች
              </Text>
            </View>
          )}

          {results.map((item, idx) => {
            const chDisplay = settings.geezNumerals
              ? toGeezNumeral(item.chapterNumber)
              : `${item.chapterNumber}`;
            const vDisplay = settings.geezNumerals
              ? toGeezNumeral(item.verseNumber)
              : `${item.verseNumber}`;

            return (
              <TouchableOpacity
                key={`${item.bookIndex}_${item.chapterNumber}_${item.verseNumber}_${idx}`}
                onPress={() => handleSelectResult(item)}
                style={[
                  styles.resultItemCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.borderHairline,
                  },
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.resultItemHeader}>
                  <Text
                    style={[
                      styles.resultReference,
                      {
                        color: theme.accentCrimson,
                        fontFamily: FONT_FAMILIES.ethiopicSerifBold,
                      },
                    ]}
                  >
                    {item.bookTitleAm} {chDisplay}፥{vDisplay}
                  </Text>
                  <ArrowRight size={14} color={theme.textMuted} />
                </View>

                <Text
                  style={[
                    styles.resultVerseText,
                    {
                      color: theme.textPrimary,
                      fontFamily: FONT_FAMILIES.ethiopicSerif,
                    },
                  ]}
                  numberOfLines={3}
                >
                  {item.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) + 10 : 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
  suggestionsContainer: {
    marginTop: 18,
  },
  suggestionsLabel: {
    fontSize: 12,
    marginBottom: 8,
    opacity: 0.8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
  resultsScrollView: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 40,
    gap: 8,
  },
  emptyResultsBox: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    letterSpacing: 0.5,
  },
  resultsHeaderRow: {
    paddingVertical: 4,
    marginBottom: 4,
  },
  resultsCountText: {
    fontSize: 13,
    letterSpacing: 0.5,
  },
  resultItemCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  resultItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  resultReference: {
    fontSize: 14,
  },
  resultVerseText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
