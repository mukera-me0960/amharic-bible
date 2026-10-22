import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import {
  X,
  Bookmark,
  Copy,
  Share2,
  FileText,
  Check,
  Trash2,
} from 'lucide-react-native';
import { useBible } from '../context/BibleContext';
import { getBookByIndex } from '../data/bibleMetadata';
import { HighlightColorKey } from '../utils/storage';
import { FONT_FAMILIES } from '../theme/typography';
import { toGeezNumeral } from '../utils/amharicUtils';

export const VerseActionModal: React.FC = () => {
  const {
    selectedVerse,
    setSelectedVerse,
    theme,
    settings,
    isVerseBookmarked,
    toggleBookmark,
    getVerseHighlight,
    setVerseHighlight,
    getVerseNote,
    saveVerseNote,
  } = useBible();

  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>('');
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  useEffect(() => {
    if (selectedVerse) {
      const existingNote = getVerseNote(selectedVerse);
      setNoteText(existingNote ? existingNote.noteContent : '');
      setIsEditingNote(false);
      setCopiedToast(false);
    }
  }, [selectedVerse]);

  if (!selectedVerse) return null;

  const bookMeta = getBookByIndex(selectedVerse.bookIndex);
  const isBookmarked = isVerseBookmarked(selectedVerse);
  const currentHighlight = getVerseHighlight(selectedVerse);

  const chDisplay = settings.geezNumerals
    ? toGeezNumeral(selectedVerse.chapterNumber)
    : `${selectedVerse.chapterNumber}`;
  const vDisplay = settings.geezNumerals
    ? selectedVerse.verseLabelGeez
    : selectedVerse.verseLabel;

  const fullReference = `${bookMeta?.titleAm || ''} ${chDisplay}፥${vDisplay}`;

  const handleCopy = async () => {
    const textToCopy = `«${selectedVerse.text}»\n— ${fullReference}`;
    await Clipboard.setStringAsync(textToCopy);
    setCopiedToast(true);
    setTimeout(() => {
      setCopiedToast(false);
    }, 2000);
  };

  const handleShare = async () => {
    const message = `«${selectedVerse.text}»\n\n— ${fullReference}\n[መጽሐፍ ቅዱስ]`;
    if (Platform.OS === 'web') {
      if (navigator.share) {
        try {
          await navigator.share({ title: fullReference, text: message });
        } catch {
          // cancelled or unsupported
        }
      } else {
        await handleCopy();
      }
    } else {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await handleCopy();
      }
    }
  };

  const handleSaveNote = () => {
    saveVerseNote(selectedVerse, noteText);
    setIsEditingNote(false);
  };

  const highlightOptions: { key: HighlightColorKey; name: string; color: string }[] = [
    { key: 'vermilion', name: 'ቀይ', color: theme.highlightVermilion },
    { key: 'saffron', name: 'ወርቃማ', color: theme.highlightSaffron },
    { key: 'sage', name: 'ወይራ', color: theme.highlightSage },
    { key: 'lapis', name: 'ሰማያዊ', color: theme.highlightLapis },
    { key: 'ochre', name: 'ቢጫ', color: theme.highlightOchre },
  ];

  return (
    <Modal
      visible={!!selectedVerse}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setSelectedVerse(null)}
    >
      <View style={styles.backdrop}>
        <SafeAreaView
          style={[styles.sheetContainer, { backgroundColor: theme.paperBackground }]}
        >
          {/* Rounded Handle Indicator */}
          <View style={styles.handleContainer}>
            <View style={[styles.dragHandle, { backgroundColor: theme.borderHairline }]} />
          </View>

          {/* Header */}
          <View style={[styles.headerRow, { borderBottomColor: theme.borderHairline }]}>
            <Text
              style={[
                styles.referenceText,
                { color: theme.accentCrimson, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
              ]}
            >
              {fullReference}
            </Text>

            <TouchableOpacity
              onPress={() => setSelectedVerse(null)}
              style={[styles.closeBtn, { borderColor: theme.borderHairline }]}
            >
              <X size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Scripture Preview */}
          <View
            style={[
              styles.previewBox,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderHairline,
              },
            ]}
          >
            <Text
              style={[
                styles.previewText,
                { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
              ]}
              numberOfLines={3}
            >
              «{selectedVerse.text}»
            </Text>
          </View>

          {/* Highlight Mineral Pigments */}
          <View style={styles.highlightSection}>
            <Text
              style={[
                styles.sectionLabel,
                { color: theme.textSecondary, fontFamily: FONT_FAMILIES.ethiopicSerif },
              ]}
            >
              ማድመቂያ ቀለም፦
            </Text>

            <View style={styles.highlightRow}>
              {highlightOptions.map((h) => {
                const isActive = currentHighlight?.colorKey === h.key;
                return (
                  <TouchableOpacity
                    key={h.key}
                    onPress={() => {
                      setVerseHighlight(selectedVerse, isActive ? null : h.key);
                      setSelectedVerse(null);
                    }}
                    style={[
                      styles.highlightCircle,
                      {
                        backgroundColor: h.color,
                        borderColor: isActive ? theme.accentCrimson : theme.borderHairline,
                        borderWidth: isActive ? 2 : 1,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    {isActive && <Check size={14} color={theme.accentCrimson} strokeWidth={2.5} />}
                  </TouchableOpacity>
                );
              })}

              {currentHighlight && (
                <TouchableOpacity
                  onPress={() => {
                    setVerseHighlight(selectedVerse, null);
                    setSelectedVerse(null);
                  }}
                  style={[
                    styles.removeHighlightBtn,
                    { borderColor: theme.borderHairline, backgroundColor: theme.cardBackground },
                  ]}
                  activeOpacity={0.7}
                >
                  <Trash2 size={13} color={theme.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Note Input (if open) */}
          {isEditingNote ? (
            <View
              style={[
                styles.noteBox,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.borderHairline,
                },
              ]}
            >
              <Text
                style={[
                  styles.noteLabel,
                  { color: theme.accentCrimson, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                ]}
              >
                የግል ማስታወሻ / አስተንትኖ
              </Text>
              <TextInput
                value={noteText}
                onChangeText={setNoteText}
                placeholder="ስለዚህ ጥቅስ የግል ማስታወሻዎን እዚህ ይጻፉ..."
                placeholderTextColor={theme.textMuted}
                multiline
                style={[
                  styles.noteInput,
                  { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                ]}
              />
              <View style={styles.noteActionsRow}>
                <TouchableOpacity
                  onPress={() => setIsEditingNote(false)}
                  style={[styles.noteBtn, { borderColor: theme.borderHairline }]}
                >
                  <Text
                    style={[
                      styles.noteBtnText,
                      { color: theme.textSecondary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                    ]}
                  >
                    ይቅር
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveNote}
                  style={[styles.noteBtn, { backgroundColor: theme.accentCrimson }]}
                >
                  <Text
                    style={[
                      styles.noteBtnText,
                      { color: '#FFFFFF', fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                    ]}
                  >
                    አስቀምጥ
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {/* Action Buttons Row */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              onPress={handleCopy}
              style={[
                styles.actionItem,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.borderHairline,
                },
              ]}
              activeOpacity={0.7}
            >
              <Copy size={16} color={theme.textSecondary} />
              <Text
                style={[
                  styles.actionText,
                  { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                ]}
              >
                {copiedToast ? 'ተቀድቷል!' : 'ቅዳ'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleBookmark(selectedVerse)}
              style={[
                styles.actionItem,
                {
                  backgroundColor: isBookmarked ? theme.activeItemBg : theme.cardBackground,
                  borderColor: isBookmarked ? theme.accentCrimson : theme.borderHairline,
                },
              ]}
              activeOpacity={0.7}
            >
              <Bookmark
                size={16}
                color={isBookmarked ? theme.accentCrimson : theme.textSecondary}
                fill={isBookmarked ? theme.accentCrimson : 'transparent'}
              />
              <Text
                style={[
                  styles.actionText,
                  {
                    color: isBookmarked ? theme.accentCrimson : theme.textPrimary,
                    fontFamily: FONT_FAMILIES.ethiopicSerif,
                  },
                ]}
              >
                {isBookmarked ? 'ተሰይሟል' : 'ዕልባት'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsEditingNote(!isEditingNote)}
              style={[
                styles.actionItem,
                {
                  backgroundColor: noteText ? theme.activeItemBg : theme.cardBackground,
                  borderColor: theme.borderHairline,
                },
              ]}
              activeOpacity={0.7}
            >
              <FileText size={16} color={theme.textSecondary} />
              <Text
                style={[
                  styles.actionText,
                  { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                ]}
              >
                {noteText ? 'ማስታወሻ አርትዕ' : 'ማስታወሻ'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              style={[
                styles.actionItem,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.borderHairline,
                },
              ]}
              activeOpacity={0.7}
            >
              <Share2 size={16} color={theme.textSecondary} />
              <Text
                style={[
                  styles.actionText,
                  { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                ]}
              >
                አጋራ
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragHandle: {
    width: 38,
    height: 4.5,
    borderRadius: 3,
    opacity: 0.8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  referenceText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 3,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBox: {
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 14,
  },
  previewText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  highlightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeHighlightBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteBox: {
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 14,
  },
  noteLabel: {
    fontSize: 13,
    marginBottom: 6,
  },
  noteInput: {
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
    padding: 0,
  },
  noteActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  noteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 3,
    borderWidth: 1,
  },
  noteBtnText: {
    fontSize: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  actionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    gap: 6,
  },
  actionText: {
    fontSize: 12,
  },
});
