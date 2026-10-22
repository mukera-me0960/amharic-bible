import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { X, Search, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { useBible } from '../context/BibleContext';
import {
  ALL_BOOKS,
  BookMeta,
  CATEGORIES,
  BookCategory,
  OLD_TESTAMENT_BOOKS,
  NEW_TESTAMENT_BOOKS,
} from '../data/bibleMetadata';
import { FONT_FAMILIES } from '../theme/typography';
import { toGeezNumeral, normalizeAmharic } from '../utils/amharicUtils';

export const BookSelectorModal: React.FC = () => {
  const {
    isBookSelectorOpen,
    setIsBookSelectorOpen,
    goToBookAndChapter,
    currentBookIndex,
    currentChapterNumber,
    theme,
    settings,
  } = useBible();

  const [activeTestament, setActiveTestament] = useState<'OT' | 'NT'>('OT');
  const [selectedBookForChapters, setSelectedBookForChapters] = useState<BookMeta | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const booksToDisplay = (activeTestament === 'OT' ? OLD_TESTAMENT_BOOKS : NEW_TESTAMENT_BOOKS).filter(
    (b) => {
      if (!searchFilter.trim()) return true;
      const q = normalizeAmharic(searchFilter);
      return (
        normalizeAmharic(b.titleAm).includes(q) ||
        b.titleEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
        b.abbvAm.includes(searchFilter)
      );
    }
  );

  const categoriesInTab: BookCategory[] =
    activeTestament === 'OT'
      ? ['law', 'history', 'poetry', 'prophecy']
      : ['gospel', 'history', 'paul', 'general', 'revelation'];

  const handleSelectChapter = (chapterNum: number) => {
    if (!selectedBookForChapters) return;
    goToBookAndChapter(selectedBookForChapters.index, chapterNum);
    setSelectedBookForChapters(null);
    setIsBookSelectorOpen(false);
  };

  const handleClose = () => {
    setSelectedBookForChapters(null);
    setSearchFilter('');
    setIsBookSelectorOpen(false);
  };

  return (
    <Modal
      visible={isBookSelectorOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: theme.background }]}>
        {/* Header Bar */}
        <View style={[styles.headerBar, { borderBottomColor: theme.borderHairline }]}>
          {selectedBookForChapters ? (
            <TouchableOpacity
              onPress={() => setSelectedBookForChapters(null)}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={theme.textPrimary} />
              <Text
                style={[
                  styles.backText,
                  { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                ]}
              >
                ወደ መጻሕፍት ዝርዝር
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={[
                styles.modalTitle,
                { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
              ]}
            >
              ቅዱሳት መጻሕፍት
            </Text>
          )}

          <TouchableOpacity
            onPress={handleClose}
            style={[styles.closeButton, { borderColor: theme.borderHairline }]}
            activeOpacity={0.7}
          >
            <X size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        {selectedBookForChapters ? (
          /* Chapter Selection Grid */
          <ScrollView
            style={styles.chapterScrollView}
            contentContainerStyle={styles.chapterScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.selectedBookBanner}>
              <Text
                style={[
                  styles.selectedBookAm,
                  { color: theme.accentCrimson, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                ]}
              >
                {selectedBookForChapters.titleAm}
              </Text>
              <Text
                style={[
                  styles.selectedBookEn,
                  { color: theme.textMuted, fontFamily: FONT_FAMILIES.garamondSerif },
                ]}
              >
                {selectedBookForChapters.titleEn} • {selectedBookForChapters.totalChapters} ምዕራፎች
              </Text>
            </View>

            <Text
              style={[
                styles.chooseChapterLabel,
                { color: theme.textSecondary, fontFamily: FONT_FAMILIES.ethiopicSerif },
              ]}
            >
              ምዕራፍ ይምረጡ
            </Text>

            <View style={styles.chapterGrid}>
              {Array.from({ length: selectedBookForChapters.totalChapters }, (_, i) => i + 1).map(
                (chNum) => {
                  const isCurrent =
                    currentBookIndex === selectedBookForChapters.index &&
                    currentChapterNumber === chNum;

                  const chDisplay = settings.geezNumerals
                    ? toGeezNumeral(chNum)
                    : `${chNum}`;

                  return (
                    <TouchableOpacity
                      key={chNum}
                      onPress={() => handleSelectChapter(chNum)}
                      style={[
                        styles.chapterGridItem,
                        {
                          borderColor: isCurrent ? theme.accentCrimson : theme.borderHairline,
                          backgroundColor: isCurrent ? theme.accentCrimson : theme.cardBackground,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chapterGridNum,
                          {
                            color: isCurrent ? '#FFFFFF' : theme.textPrimary,
                            fontFamily: settings.geezNumerals
                              ? FONT_FAMILIES.ethiopicSerifBold
                              : FONT_FAMILIES.garamondSerif,
                          },
                        ]}
                      >
                        {chDisplay}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          </ScrollView>
        ) : (
          /* Book List Screen */
          <View style={styles.booksMainContainer}>
            {/* Search Input */}
            <View
              style={[
                styles.searchBox,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.borderHairline,
                },
              ]}
            >
              <Search size={16} color={theme.textMuted} style={styles.searchIcon} />
              <TextInput
                value={searchFilter}
                onChangeText={setSearchFilter}
                placeholder="መጽሐፍ በስም ፈልግ... (ዘፍጥረት / Matthew)"
                placeholderTextColor={theme.textMuted}
                style={[
                  styles.searchInput,
                  { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                ]}
              />
              {searchFilter ? (
                <TouchableOpacity onPress={() => setSearchFilter('')}>
                  <X size={16} color={theme.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Testament Tab Switcher */}
            <View style={[styles.tabBar, { borderBottomColor: theme.borderHairline }]}>
              <TouchableOpacity
                onPress={() => setActiveTestament('OT')}
                style={[
                  styles.tabItem,
                  activeTestament === 'OT' && {
                    borderBottomColor: theme.accentCrimson,
                    borderBottomWidth: 2,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: activeTestament === 'OT' ? theme.accentCrimson : theme.textSecondary,
                      fontFamily:
                        activeTestament === 'OT'
                          ? FONT_FAMILIES.ethiopicSerifBold
                          : FONT_FAMILIES.ethiopicSerif,
                    },
                  ]}
                >
                  ብሉይ ኪዳን (፴፱)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTestament('NT')}
                style={[
                  styles.tabItem,
                  activeTestament === 'NT' && {
                    borderBottomColor: theme.accentCrimson,
                    borderBottomWidth: 2,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: activeTestament === 'NT' ? theme.accentCrimson : theme.textSecondary,
                      fontFamily:
                        activeTestament === 'NT'
                          ? FONT_FAMILIES.ethiopicSerifBold
                          : FONT_FAMILIES.ethiopicSerif,
                    },
                  ]}
                >
                  አዲስ ኪዳን (፳፯)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Books List by Category */}
            <ScrollView
              style={styles.booksScrollView}
              contentContainerStyle={styles.booksScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {categoriesInTab.map((catKey) => {
                const catInfo = CATEGORIES[catKey];
                const catBooks = booksToDisplay.filter((b) => b.category === catKey);

                if (catBooks.length === 0) return null;

                return (
                  <View key={catKey} style={styles.categorySection}>
                    <View style={styles.categoryHeader}>
                      <Text
                        style={[
                          styles.categoryTitleAm,
                          {
                            color: theme.accentCrimson,
                            fontFamily: FONT_FAMILIES.ethiopicSerifBold,
                          },
                        ]}
                      >
                        {catInfo.nameAm}
                      </Text>
                      <Text
                        style={[
                          styles.categorySubtitle,
                          { color: theme.textMuted, fontFamily: FONT_FAMILIES.garamondSerif },
                        ]}
                      >
                        {catInfo.nameEn}
                      </Text>
                    </View>

                    <View style={styles.booksGrid}>
                      {catBooks.map((book) => {
                        const isCurrent = currentBookIndex === book.index;
                        return (
                          <TouchableOpacity
                            key={book.id}
                            onPress={() => setSelectedBookForChapters(book)}
                            style={[
                              styles.bookCard,
                              {
                                backgroundColor: isCurrent
                                  ? theme.activeItemBg
                                  : theme.cardBackground,
                                borderColor: isCurrent
                                  ? theme.accentCrimson
                                  : theme.borderHairline,
                              },
                            ]}
                            activeOpacity={0.7}
                          >
                            <View style={styles.bookCardLeft}>
                              <Text
                                style={[
                                  styles.bookCardTitleAm,
                                  {
                                    color: theme.textPrimary,
                                    fontFamily: FONT_FAMILIES.ethiopicSerifBold,
                                  },
                                ]}
                                numberOfLines={1}
                              >
                                {book.titleAm}
                              </Text>
                              <Text
                                style={[
                                  styles.bookCardSubtitle,
                                  {
                                    color: theme.textSecondary,
                                    fontFamily: FONT_FAMILIES.garamondSerif,
                                  },
                                ]}
                              >
                                {book.titleEn} • {book.totalChapters} ምዕራፍ
                              </Text>
                            </View>

                            <ChevronRight size={16} color={theme.textMuted} />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalSafeArea: {
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
  modalTitle: {
    fontSize: 18,
    letterSpacing: 0.5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 15,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  booksMainContainer: {
    flex: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 15,
    letterSpacing: 0.3,
  },
  booksScrollView: {
    flex: 1,
  },
  booksScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 40,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    marginBottom: 8,
    paddingBottom: 4,
  },
  categoryTitleAm: {
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  categorySubtitle: {
    fontSize: 11,
    opacity: 0.8,
    marginTop: 1,
  },
  booksGrid: {
    gap: 6,
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  bookCardLeft: {
    flex: 1,
  },
  bookCardTitleAm: {
    fontSize: 16,
  },
  bookCardSubtitle: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.85,
  },
  // Chapter Grid Styles
  chapterScrollView: {
    flex: 1,
  },
  chapterScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    alignItems: 'center',
  },
  selectedBookBanner: {
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedBookAm: {
    fontSize: 22,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  selectedBookEn: {
    fontSize: 13,
    marginTop: 3,
  },
  chooseChapterLabel: {
    fontSize: 14,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  chapterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    maxWidth: 480,
  },
  chapterGridItem: {
    width: 52,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterGridNum: {
    fontSize: 15,
  },
});
