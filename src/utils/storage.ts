import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../theme/colors';

export type HighlightColorKey = 'vermilion' | 'saffron' | 'sage' | 'lapis' | 'ochre';
export type LineHeightKey = 'compact' | 'classic' | 'generous';
export type ReadingMode = 'flow' | 'verse';

export interface BookmarkItem {
  id: string;
  bookIndex: number;
  chapterNumber: number;
  verseNumber: number;
  verseLabel: string;
  bookTitleAm: string;
  text: string;
  createdAt: number;
}

export interface HighlightItem {
  id: string; // key e.g. "b0_c1_v1"
  bookIndex: number;
  chapterNumber: number;
  verseNumber: number;
  colorKey: HighlightColorKey;
  text: string;
  createdAt: number;
}

export interface NoteItem {
  id: string;
  bookIndex: number;
  chapterNumber: number;
  verseNumber: number;
  verseLabel: string;
  bookTitleAm: string;
  verseText: string;
  noteContent: string;
  updatedAt: number;
}

export interface ReaderSettings {
  themeMode: ThemeMode;
  fontSize: number;
  lineHeightKey: LineHeightKey;
  readingMode: ReadingMode;
  geezNumerals: boolean;
  rubricatedNumbers: boolean;
  continuousScroll: boolean;
}

export interface LastReadState {
  bookIndex: number;
  chapterNumber: number;
  updatedAt: number;
}

const KEYS = {
  SETTINGS: '@bible_settings_v1',
  BOOKMARKS: '@bible_bookmarks_v1',
  HIGHLIGHTS: '@bible_highlights_v1',
  NOTES: '@bible_notes_v1',
  LAST_READ: '@bible_last_read_v1',
};

export const DEFAULT_SETTINGS: ReaderSettings = {
  themeMode: 'parchment',
  fontSize: 20,
  lineHeightKey: 'classic',
  readingMode: 'flow',
  geezNumerals: true,
  rubricatedNumbers: true,
  continuousScroll: false,
};

export const DEFAULT_LAST_READ: LastReadState = {
  bookIndex: 0, // Genesis (ኦሪት ዘፍጥረት)
  chapterNumber: 1,
  updatedAt: Date.now(),
};

export async function loadSettings(): Promise<ReaderSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: ReaderSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings', e);
  }
}

export async function loadLastRead(): Promise<LastReadState> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.LAST_READ);
    return raw ? JSON.parse(raw) : DEFAULT_LAST_READ;
  } catch {
    return DEFAULT_LAST_READ;
  }
}

export async function saveLastRead(state: LastReadState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.LAST_READ, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save last read', e);
  }
}

export async function loadBookmarks(): Promise<BookmarkItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveBookmarks(bookmarks: BookmarkItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (e) {
    console.warn('Failed to save bookmarks', e);
  }
}

export async function loadHighlights(): Promise<Record<string, HighlightItem>> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.HIGHLIGHTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function saveHighlights(highlights: Record<string, HighlightItem>): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.HIGHLIGHTS, JSON.stringify(highlights));
  } catch (e) {
    console.warn('Failed to save highlights', e);
  }
}

export async function loadNotes(): Promise<NoteItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.NOTES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveNotes(notes: NoteItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
  } catch (e) {
    console.warn('Failed to save notes', e);
  }
}
