import React, { useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  PanResponder,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useBible } from '../context/BibleContext';
import { VerseItem } from './VerseItem';
import { OrnamentalDivider } from './OrnamentalDivider';
import { FONT_FAMILIES } from '../theme/typography';
import { toGeezNumeral } from '../utils/amharicUtils';

export const ChapterReader: React.FC = () => {
  const {
    theme,
    settings,
    currentChapter,
    currentBookMeta,
    currentChapterNumber,
    hasNextChapter,
    hasPrevChapter,
    nextChapter,
    prevChapter,
  } = useBible();

  const scrollViewRef = useRef<any>(null);
  const { width } = useWindowDimensions();

  const hasNextChapterRef = useRef(hasNextChapter);
  const hasPrevChapterRef = useRef(hasPrevChapter);
  const nextChapterRef = useRef(nextChapter);
  const prevChapterRef = useRef(prevChapter);

  useEffect(() => {
    hasNextChapterRef.current = hasNextChapter;
    hasPrevChapterRef.current = hasPrevChapter;
    nextChapterRef.current = nextChapter;
    prevChapterRef.current = prevChapter;
  }, [hasNextChapter, hasPrevChapter, nextChapter, prevChapter]);

  // PanResponder to capture horizontal swipes smoothly without disrupting vertical scroll
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture distinct horizontal swipes where horizontal movement dominates
        return (
          Math.abs(gestureState.dx) > 20 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5
        );
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 25 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5
        );
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {},
      onPanResponderRelease: (_, gestureState) => {
        const SWIPE_DISTANCE_THRESHOLD = 40;
        const SWIPE_VELOCITY_THRESHOLD = 0.2;
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.2;

        if (isHorizontal) {
          if (
            gestureState.dx > SWIPE_DISTANCE_THRESHOLD ||
            gestureState.vx > SWIPE_VELOCITY_THRESHOLD
          ) {
            // Swipe Left to Right -> Previous Chapter
            if (hasPrevChapterRef.current) {
              prevChapterRef.current();
            }
          } else if (
            gestureState.dx < -SWIPE_DISTANCE_THRESHOLD ||
            gestureState.vx < -SWIPE_VELOCITY_THRESHOLD
          ) {
            // Swipe Right to Left -> Next Chapter
            if (hasNextChapterRef.current) {
              nextChapterRef.current();
            }
          }
        }
      },
      onPanResponderTerminate: (_, gestureState) => {
        const SWIPE_DISTANCE_THRESHOLD = 40;
        const SWIPE_VELOCITY_THRESHOLD = 0.2;
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.2;

        if (isHorizontal) {
          if (
            gestureState.dx > SWIPE_DISTANCE_THRESHOLD ||
            gestureState.vx > SWIPE_VELOCITY_THRESHOLD
          ) {
            if (hasPrevChapterRef.current) {
              prevChapterRef.current();
            }
          } else if (
            gestureState.dx < -SWIPE_DISTANCE_THRESHOLD ||
            gestureState.vx < -SWIPE_VELOCITY_THRESHOLD
          ) {
            if (hasNextChapterRef.current) {
              nextChapterRef.current();
            }
          }
        }
      },
    })
  ).current;

  // Scroll to top whenever chapter changes
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentBookMeta.id, currentChapterNumber]);

  if (!currentChapter) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          ምዕራፉ እየተዘጋጀ ነው...
        </Text>
      </View>
    );
  }

  // Bounded reading width for desktop & tablets
  const maxContentWidth = Math.min(width - 32, 680);

  const chapterNumeralAm = settings.geezNumerals
    ? toGeezNumeral(currentChapterNumber)
    : `${currentChapterNumber}`;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} {...panResponder.panHandlers}>
      <ScrollView
        ref={scrollViewRef}
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: theme.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
      <View style={[styles.readingColumn, { width: maxContentWidth }]}>
        {/* Chapter Header / Inscription */}
        <View style={styles.chapterHeader}>
          <Text
            style={[
              styles.bookSuperTitle,
              {
                color: theme.accentCrimson,
                fontFamily: FONT_FAMILIES.ethiopicSerifBold,
              },
            ]}
          >
            {currentBookMeta.titleAm}
          </Text>

          <Text
            style={[
              styles.chapterTitle,
              {
                color: theme.textPrimary,
                fontFamily: FONT_FAMILIES.ethiopicSerifBold,
              },
            ]}
          >
            ምዕራፍ {chapterNumeralAm}
          </Text>

          {currentChapter.title ? (
            <Text
              style={[
                styles.pericopeTitle,
                {
                  color: theme.textSecondary,
                  fontFamily: FONT_FAMILIES.ethiopicSerif,
                },
              ]}
            >
              {currentChapter.title}
            </Text>
          ) : null}

          <OrnamentalDivider type="cross" style={styles.headerDivider} />
        </View>

        {/* Verses Container */}
        {settings.readingMode === 'flow' ? (
          <View style={styles.flowContainer}>
            {currentChapter.verses.map((verse, idx) => (
              <VerseItem
                key={verse.id}
                verse={verse}
                isFirstVerse={idx === 0}
              />
            ))}
          </View>
        ) : (
          <View style={styles.verseListContainer}>
            {currentChapter.verses.map((verse, idx) => (
              <VerseItem
                key={verse.id}
                verse={verse}
                isFirstVerse={idx === 0}
              />
            ))}
          </View>
        )}

        {/* Chapter Ending Ornament */}
        <OrnamentalDivider type="chapterEnd" style={styles.footerDivider} />

        {/* Chapter Navigation Footer */}
        <View style={styles.navFooter}>
          {hasPrevChapter ? (
            <TouchableOpacity
              onPress={prevChapter}
              style={[
                styles.navButton,
                {
                  borderColor: theme.borderHairline,
                  backgroundColor: theme.cardBackground,
                },
              ]}
              activeOpacity={0.7}
            >
              <ChevronLeft size={16} color={theme.textSecondary} />
              <Text
                style={[
                  styles.navButtonText,
                  {
                    color: theme.textPrimary,
                    fontFamily: FONT_FAMILIES.ethiopicSerif,
                  },
                ]}
              >
                ቀዳሚ ምዕራፍ
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.navButtonPlaceholder} />
          )}

          <View style={styles.chapterIndicator}>
            <Text
              style={[
                styles.chapterIndicatorText,
                {
                  color: theme.textMuted,
                  fontFamily: FONT_FAMILIES.garamondSerif,
                },
              ]}
            >
              {currentChapterNumber} / {currentBookMeta.totalChapters}
            </Text>
          </View>

          {hasNextChapter ? (
            <TouchableOpacity
              onPress={nextChapter}
              style={[
                styles.navButton,
                {
                  borderColor: theme.borderHairline,
                  backgroundColor: theme.cardBackground,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.navButtonText,
                  {
                    color: theme.textPrimary,
                    fontFamily: FONT_FAMILIES.ethiopicSerif,
                  },
                ]}
              >
                ቀጣይ ምዕራፍ
              </Text>
              <ChevronRight size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.navButtonPlaceholder} />
          )}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  readingColumn: {
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  chapterHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  bookSuperTitle: {
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
    opacity: 0.9,
  },
  chapterTitle: {
    fontSize: 26,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  pericopeTitle: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center',
    opacity: 0.8,
  },
  headerDivider: {
    marginVertical: 14,
  },
  flowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  verseListContainer: {
    width: '100%',
  },
  footerDivider: {
    marginTop: 36,
    marginBottom: 24,
  },
  navFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 3,
    borderWidth: 1,
    gap: 4,
  },
  navButtonPlaceholder: {
    width: 110,
  },
  navButtonText: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  chapterIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterIndicatorText: {
    fontSize: 13,
    letterSpacing: 0.5,
  },
  bottomSpacer: {
    height: 80,
  },
});
