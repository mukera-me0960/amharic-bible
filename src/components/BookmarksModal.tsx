import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { X, Bookmark, FileText, Highlighter, Trash2, ArrowRight } from 'lucide-react-native';
import { useBible } from '../context/BibleContext';
import { getBookByIndex } from '../data/bibleMetadata';
import { FONT_FAMILIES } from '../theme/typography';
import { toGeezNumeral } from '../utils/amharicUtils';

type ActiveTab = 'bookmarks' | 'highlights' | 'notes';

export const BookmarksModal: React.FC = () => {
  const {
    isBookmarksOpen,
    setIsBookmarksOpen,
    bookmarks,
    removeBookmarkById,
    highlights,
    setVerseHighlight,
    notes,
    deleteNoteById,
    goToBookAndChapter,
    theme,
    settings,
  } = useBible();

  const [activeTab, setActiveTab] = useState<ActiveTab>('bookmarks');

  const highlightList = Object.values(highlights);

  const handleJump = (bookIndex: number, chapterNumber: number) => {
    goToBookAndChapter(bookIndex, chapterNumber);
    setIsBookmarksOpen(false);
  };

  return (
    <Modal
      visible={isBookmarksOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setIsBookmarksOpen(false)}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.headerBar, { borderBottomColor: theme.borderHairline }]}>
          <Text
            style={[
              styles.headerTitle,
              { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
            ]}
          >
            የግል ጥናትና ማስታወሻዎች
          </Text>

          <TouchableOpacity
            onPress={() => setIsBookmarksOpen(false)}
            style={[styles.closeButton, { borderColor: theme.borderHairline }]}
            activeOpacity={0.7}
          >
            <X size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={[styles.tabBar, { borderBottomColor: theme.borderHairline }]}>
          <TouchableOpacity
            onPress={() => setActiveTab('bookmarks')}
            style={[
              styles.tabItem,
              activeTab === 'bookmarks' && {
                borderBottomColor: theme.accentCrimson,
                borderBottomWidth: 2,
              },
            ]}
            activeOpacity={0.7}
          >
            <Bookmark
              size={15}
              color={activeTab === 'bookmarks' ? theme.accentCrimson : theme.textSecondary}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'bookmarks' ? theme.accentCrimson : theme.textSecondary,
                  fontFamily:
                    activeTab === 'bookmarks'
                      ? FONT_FAMILIES.ethiopicSerifBold
                      : FONT_FAMILIES.ethiopicSerif,
                },
              ]}
            >
              ዕልባቶች ({bookmarks.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('highlights')}
            style={[
              styles.tabItem,
              activeTab === 'highlights' && {
                borderBottomColor: theme.accentCrimson,
                borderBottomWidth: 2,
              },
            ]}
            activeOpacity={0.7}
          >
            <Highlighter
              size={15}
              color={activeTab === 'highlights' ? theme.accentCrimson : theme.textSecondary}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'highlights' ? theme.accentCrimson : theme.textSecondary,
                  fontFamily:
                    activeTab === 'highlights'
                      ? FONT_FAMILIES.ethiopicSerifBold
                      : FONT_FAMILIES.ethiopicSerif,
                },
              ]}
            >
              ማድመቂያዎች ({highlightList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('notes')}
            style={[
              styles.tabItem,
              activeTab === 'notes' && {
                borderBottomColor: theme.accentCrimson,
                borderBottomWidth: 2,
              },
            ]}
            activeOpacity={0.7}
          >
            <FileText
              size={15}
              color={activeTab === 'notes' ? theme.accentCrimson : theme.textSecondary}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'notes' ? theme.accentCrimson : theme.textSecondary,
                  fontFamily:
                    activeTab === 'notes'
                      ? FONT_FAMILIES.ethiopicSerifBold
                      : FONT_FAMILIES.ethiopicSerif,
                },
              ]}
            >
              ማስታወሻዎች ({notes.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Bookmarks */}
          {activeTab === 'bookmarks' && (
            <View style={styles.listContainer}>
              {bookmarks.length === 0 ? (
                <View style={styles.emptyState}>
                  <Bookmark size={32} color={theme.textMuted} style={styles.emptyIcon} />
                  <Text
                    style={[
                      styles.emptyTitle,
                      { color: theme.textSecondary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                    ]}
                  >
                    ምንም የተቀመጠ ዕልባት የለም
                  </Text>
                  <Text
                    style={[
                      styles.emptyDesc,
                      { color: theme.textMuted, fontFamily: FONT_FAMILIES.ethiopicSerif },
                    ]}
                  >
                    በሚነቡበት ጊዜ ማንኛውንም ጥቅስ ነክተው ዕልባት ማድረግ ይችላሉ።
                  </Text>
                </View>
              ) : (
                bookmarks.map((b) => {
                  const chDisp = settings.geezNumerals
                    ? toGeezNumeral(b.chapterNumber)
                    : `${b.chapterNumber}`;
                  const vDisp = settings.geezNumerals
                    ? toGeezNumeral(b.verseNumber)
                    : `${b.verseNumber}`;

                  return (
                    <View
                      key={b.id}
                      style={[
                        styles.itemCard,
                        {
                          backgroundColor: theme.cardBackground,
                          borderColor: theme.borderHairline,
                        },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => handleJump(b.bookIndex, b.chapterNumber)}
                        style={styles.itemContent}
                        activeOpacity={0.7}
                      >
                        <View style={styles.itemHeader}>
                          <Text
                            style={[
                              styles.itemReference,
                              {
                                color: theme.accentCrimson,
                                fontFamily: FONT_FAMILIES.ethiopicSerifBold,
                              },
                            ]}
                          >
                            {b.bookTitleAm} {chDisp}፥{vDisp}
                          </Text>
                          <ArrowRight size={14} color={theme.textMuted} />
                        </View>
                        <Text
                          style={[
                            styles.itemVerseText,
                            { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                          ]}
                          numberOfLines={3}
                        >
                          «{b.text}»
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => removeBookmarkById(b.id)}
                        style={[styles.deleteBtn, { borderLeftColor: theme.borderHairline }]}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={15} color={theme.textMuted} />
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* 2. Highlights */}
          {activeTab === 'highlights' && (
            <View style={styles.listContainer}>
              {highlightList.length === 0 ? (
                <View style={styles.emptyState}>
                  <Highlighter size={32} color={theme.textMuted} style={styles.emptyIcon} />
                  <Text
                    style={[
                      styles.emptyTitle,
                      { color: theme.textSecondary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                    ]}
                  >
                    ምንም የተደመቀ ጥቅስ የለም
                  </Text>
                  <Text
                    style={[
                      styles.emptyDesc,
                      { color: theme.textMuted, fontFamily: FONT_FAMILIES.ethiopicSerif },
                    ]}
                  >
                    ጥቅሶችን ነክተው በባህላዊ የማድመቂያ ቀለማት ማድመቅ ይችላሉ።
                  </Text>
                </View>
              ) : (
                highlightList.map((h) => {
                  const bMeta = getBookByIndex(h.bookIndex);
                  const chDisp = settings.geezNumerals
                    ? toGeezNumeral(h.chapterNumber)
                    : `${h.chapterNumber}`;
                  const vDisp = settings.geezNumerals
                    ? toGeezNumeral(h.verseNumber)
                    : `${h.verseNumber}`;

                  return (
                    <View
                      key={h.id}
                      style={[
                        styles.itemCard,
                        {
                          backgroundColor: theme.cardBackground,
                          borderColor: theme.borderHairline,
                        },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => handleJump(h.bookIndex, h.chapterNumber)}
                        style={styles.itemContent}
                        activeOpacity={0.7}
                      >
                        <View style={styles.itemHeader}>
                          <Text
                            style={[
                              styles.itemReference,
                              {
                                color: theme.accentCrimson,
                                fontFamily: FONT_FAMILIES.ethiopicSerifBold,
                              },
                            ]}
                          >
                            {bMeta?.titleAm} {chDisp}፥{vDisp}
                          </Text>
                          <ArrowRight size={14} color={theme.textMuted} />
                        </View>
                        <Text
                          style={[
                            styles.itemVerseText,
                            { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                          ]}
                          numberOfLines={3}
                        >
                          «{h.text}»
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          setVerseHighlight(
                            {
                              id: h.id,
                              bookIndex: h.bookIndex,
                              chapterIndex: h.chapterNumber - 1,
                              chapterNumber: h.chapterNumber,
                              verseNumber: h.verseNumber,
                              verseLabel: `${h.verseNumber}`,
                              verseLabelGeez: toGeezNumeral(h.verseNumber),
                              text: h.text,
                              isCombined: false,
                              startVerse: h.verseNumber,
                              endVerse: h.verseNumber,
                            },
                            null
                          )
                        }
                        style={[styles.deleteBtn, { borderLeftColor: theme.borderHairline }]}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={15} color={theme.textMuted} />
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* 3. Notes */}
          {activeTab === 'notes' && (
            <View style={styles.listContainer}>
              {notes.length === 0 ? (
                <View style={styles.emptyState}>
                  <FileText size={32} color={theme.textMuted} style={styles.emptyIcon} />
                  <Text
                    style={[
                      styles.emptyTitle,
                      { color: theme.textSecondary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                    ]}
                  >
                    ምንም የግል ማስታወሻ የለም
                  </Text>
                  <Text
                    style={[
                      styles.emptyDesc,
                      { color: theme.textMuted, fontFamily: FONT_FAMILIES.ethiopicSerif },
                    ]}
                  >
                    በንባብ ወቅት ያስተዋሉትንና የተሰማዎትን ማስታወሻ በየጥቅሱ ሥር ማስቀመጥ ይችላሉ።
                  </Text>
                </View>
              ) : (
                notes.map((n) => {
                  const chDisp = settings.geezNumerals
                    ? toGeezNumeral(n.chapterNumber)
                    : `${n.chapterNumber}`;
                  const vDisp = settings.geezNumerals
                    ? toGeezNumeral(n.verseNumber)
                    : `${n.verseNumber}`;

                  return (
                    <View
                      key={n.id}
                      style={[
                        styles.noteCard,
                        {
                          backgroundColor: theme.cardBackground,
                          borderColor: theme.borderHairline,
                        },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => handleJump(n.bookIndex, n.chapterNumber)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.itemHeader}>
                          <Text
                            style={[
                              styles.itemReference,
                              {
                                color: theme.accentCrimson,
                                fontFamily: FONT_FAMILIES.ethiopicSerifBold,
                              },
                            ]}
                          >
                            {n.bookTitleAm} {chDisp}፥{vDisp}
                          </Text>
                          <ArrowRight size={14} color={theme.textMuted} />
                        </View>

                        <Text
                          style={[
                            styles.noteVerseSnippet,
                            { color: theme.textSecondary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                          ]}
                          numberOfLines={2}
                        >
                          «{n.verseText}»
                        </Text>
                      </TouchableOpacity>

                      <View
                        style={[
                          styles.noteBodyBox,
                          {
                            backgroundColor: theme.paperBackground,
                            borderLeftColor: theme.accentGold,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.noteBodyText,
                            { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                          ]}
                        >
                          {n.noteContent}
                        </Text>
                      </View>

                      <View style={styles.noteCardFooter}>
                        <TouchableOpacity
                          onPress={() => deleteNoteById(n.id)}
                          style={styles.deleteNoteBtn}
                          activeOpacity={0.7}
                        >
                          <Trash2 size={13} color={theme.textMuted} />
                          <Text
                            style={[
                              styles.deleteNoteText,
                              { color: theme.textMuted, fontFamily: FONT_FAMILIES.ethiopicSerif },
                            ]}
                          >
                            ሰርዝ
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  tabIcon: {
    marginRight: 2,
  },
  tabText: {
    fontSize: 13,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  listContainer: {
    gap: 10,
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    marginBottom: 12,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  itemCard: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  itemContent: {
    flex: 1,
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemReference: {
    fontSize: 14,
  },
  itemVerseText: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  deleteBtn: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
  },
  noteCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 4,
  },
  noteVerseSnippet: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 8,
    opacity: 0.85,
  },
  noteBodyBox: {
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  noteBodyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  noteCardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteNoteText: {
    fontSize: 12,
  },
});
