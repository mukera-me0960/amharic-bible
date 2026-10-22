import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { X, ScrollText, BookOpen, Share2, Copy, Check, RefreshCw } from 'lucide-react-native';
import { useBible } from '../context/BibleContext';
import { DAILY_MEDITATIONS } from '../data/bibleLoader';
import { OrnamentalDivider } from './OrnamentalDivider';
import { FONT_FAMILIES } from '../theme/typography';

export const DailyVerseModal: React.FC = () => {
  const {
    isDailyVerseOpen,
    setIsDailyVerseOpen,
    goToBookAndChapter,
    theme,
  } = useBible();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const dailyItem = useMemo(() => {
    return DAILY_MEDITATIONS[currentIndex % DAILY_MEDITATIONS.length];
  }, [currentIndex]);

  const handleNextVerse = () => {
    setCurrentIndex((prev) => (prev + 1) % DAILY_MEDITATIONS.length);
  };

  const handleGoToChapter = () => {
    goToBookAndChapter(dailyItem.bookIndex, dailyItem.chapterNumber);
    setIsDailyVerseOpen(false);
  };

  const handleCopy = async () => {
    const text = `«${dailyItem.text}»\n— ${dailyItem.reference}\n[መጽሐፍ ቅዱስ]`;
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `«${dailyItem.text}»\n— ${dailyItem.reference}\n[መጽሐፍ ቅዱስ]`;
    if (Platform.OS === 'web') {
      if (navigator.share) {
        try {
          await navigator.share({ title: dailyItem.reference, text });
        } catch {
          // cancelled
        }
      } else {
        await handleCopy();
      }
    } else {
      await handleCopy();
    }
  };

  return (
    <Modal
      visible={isDailyVerseOpen}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setIsDailyVerseOpen(false)}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.centerWrapper}>
          <View
            style={[
              styles.manuscriptCard,
              {
                backgroundColor: theme.paperBackground,
                borderColor: theme.borderOrnamental,
              },
            ]}
          >
            {/* Top Bar */}
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <ScrollText size={16} color={theme.accentGold} />
                <Text
                  style={[
                    styles.cardHeaderTitle,
                    {
                      color: theme.accentCrimson,
                      fontFamily: FONT_FAMILIES.ethiopicSerifBold,
                    },
                  ]}
                >
                  የዕለቱ ቃልና አስተንትኖ
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setIsDailyVerseOpen(false)}
                style={[styles.closeBtn, { borderColor: theme.borderHairline }]}
                activeOpacity={0.7}
              >
                <X size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <OrnamentalDivider type="filigree" style={styles.topDivider} />

            {/* Sacred Verse Text */}
            <View style={styles.verseBody}>
              <Text
                style={[
                  styles.quoteMark,
                  { color: theme.accentCrimson, fontFamily: FONT_FAMILIES.garamondSerif },
                ]}
              >
                «
              </Text>
              <Text
                style={[
                  styles.verseText,
                  {
                    color: theme.textPrimary,
                    fontFamily: FONT_FAMILIES.ethiopicSerif,
                  },
                ]}
              >
                {dailyItem.text}
              </Text>
              <Text
                style={[
                  styles.quoteMark,
                  { color: theme.accentCrimson, fontFamily: FONT_FAMILIES.garamondSerif },
                ]}
              >
                »
              </Text>

              <Text
                style={[
                  styles.referenceText,
                  {
                    color: theme.accentCrimson,
                    fontFamily: FONT_FAMILIES.ethiopicSerifBold,
                  },
                ]}
              >
                — {dailyItem.reference}
              </Text>
            </View>

            <OrnamentalDivider type="cross" style={styles.bottomDivider} />

            {/* Actions */}
            <View style={styles.cardActions}>
              <TouchableOpacity
                onPress={handleGoToChapter}
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor: theme.accentCrimson,
                  },
                ]}
                activeOpacity={0.7}
              >
                <BookOpen size={16} color="#FFFFFF" />
                <Text
                  style={[
                    styles.primaryBtnText,
                    { fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                  ]}
                >
                  ወደ ምዕራፉ ሂድ
                </Text>
              </TouchableOpacity>

              <View style={styles.secondaryActionsRow}>
                <TouchableOpacity
                  onPress={handleNextVerse}
                  style={[
                    styles.secondaryBtn,
                    {
                      backgroundColor: theme.cardBackground,
                      borderColor: theme.borderHairline,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <RefreshCw size={14} color={theme.textSecondary} />
                  <Text
                    style={[
                      styles.secondaryBtnText,
                      { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                    ]}
                  >
                    ሌላ ጥቅስ
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCopy}
                  style={[
                    styles.secondaryBtn,
                    {
                      backgroundColor: theme.cardBackground,
                      borderColor: theme.borderHairline,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  {copied ? (
                    <Check size={14} color={theme.accentCrimson} />
                  ) : (
                    <Copy size={14} color={theme.textSecondary} />
                  )}
                  <Text
                    style={[
                      styles.secondaryBtnText,
                      { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                    ]}
                  >
                    {copied ? 'ተቀድቷል!' : 'ቅዳ'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShare}
                  style={[
                    styles.secondaryBtn,
                    {
                      backgroundColor: theme.cardBackground,
                      borderColor: theme.borderHairline,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Share2 size={14} color={theme.textSecondary} />
                  <Text
                    style={[
                      styles.secondaryBtnText,
                      { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                    ]}
                  >
                    አጋራ
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerWrapper: {
    width: '100%',
    maxWidth: 520,
  },
  manuscriptCard: {
    borderRadius: 18,
    borderWidth: 2,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderTitle: {
    fontSize: 15,
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topDivider: {
    marginVertical: 14,
  },
  verseBody: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  quoteMark: {
    fontSize: 24,
    opacity: 0.7,
  },
  verseText: {
    fontSize: 19,
    lineHeight: 32,
    textAlign: 'center',
    letterSpacing: 0.3,
    marginVertical: 4,
  },
  referenceText: {
    fontSize: 14,
    marginTop: 16,
    letterSpacing: 0.8,
  },
  bottomDivider: {
    marginVertical: 14,
  },
  cardActions: {
    gap: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 12,
  },
});
