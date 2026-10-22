import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { THEMES, ThemeColors, ThemeMode } from '../theme/colors';
import { ALL_BOOKS, BookMeta, getBookByIndex } from '../data/bibleMetadata';
import { getChapter, RenderedChapter, RenderedVerse } from '../data/bibleLoader';
import {
  BookmarkItem,
  DEFAULT_SETTINGS,
  DEFAULT_LAST_READ,
  HighlightColorKey,
  HighlightItem,
  LastReadState,
  loadBookmarks,
  loadHighlights,
  loadLastRead,
  loadNotes,
  loadSettings,
  NoteItem,
  ReaderSettings,
  saveBookmarks,
  saveHighlights,
  saveLastRead,
  saveNotes,
  saveSettings,
} from '../utils/storage';

interface BibleContextValue {
  // Navigation & Location
  currentBookIndex: number;
  currentChapterNumber: number;
  currentBookMeta: BookMeta;
  currentChapter: RenderedChapter | null;
  hasNextChapter: boolean;
  hasPrevChapter: boolean;
  goToBookAndChapter: (bookIndex: number, chapterNumber: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;

  // Theme & Reading Typography
  theme: ThemeColors;
  settings: ReaderSettings;
  updateSettings: (patch: Partial<ReaderSettings>) => void;
  setThemeMode: (mode: ThemeMode) => void;

  // Selection & Marginalia
  selectedVerse: RenderedVerse | null;
  setSelectedVerse: (verse: RenderedVerse | null) => void;

  // Bookmarks
  bookmarks: BookmarkItem[];
  isVerseBookmarked: (verse: RenderedVerse) => boolean;
  toggleBookmark: (verse: RenderedVerse) => void;
  removeBookmarkById: (id: string) => void;

  // Highlights
  highlights: Record<string, HighlightItem>;
  getVerseHighlight: (verse: RenderedVerse) => HighlightItem | undefined;
  setVerseHighlight: (verse: RenderedVerse, colorKey: HighlightColorKey | null) => void;

  // Notes
  notes: NoteItem[];
  getVerseNote: (verse: RenderedVerse) => NoteItem | undefined;
  saveVerseNote: (verse: RenderedVerse, noteContent: string) => void;
  deleteNoteById: (id: string) => void;

  // Modals & Overlays
  isBookSelectorOpen: boolean;
  setIsBookSelectorOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isBookmarksOpen: boolean;
  setIsBookmarksOpen: (open: boolean) => void;
  isDailyVerseOpen: boolean;
  setIsDailyVerseOpen: (open: boolean) => void;
}

const BibleContext = createContext<BibleContextValue | undefined>(undefined);

export const BibleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  const [currentBookIndex, setCurrentBookIndex] = useState<number>(0);
  const [currentChapterNumber, setCurrentChapterNumber] = useState<number>(1);
  const [selectedVerse, setSelectedVerse] = useState<RenderedVerse | null>(null);

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [highlights, setHighlights] = useState<Record<string, HighlightItem>>({});
  const [notes, setNotes] = useState<NoteItem[]>([]);

  // Modals state
  const [isBookSelectorOpen, setIsBookSelectorOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isDailyVerseOpen, setIsDailyVerseOpen] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    async function init() {
      const [savedSettings, savedLastRead, savedBookmarks, savedHighlights, savedNotes] =
        await Promise.all([
          loadSettings(),
          loadLastRead(),
          loadBookmarks(),
          loadHighlights(),
          loadNotes(),
        ]);

      setSettingsState(savedSettings);
      setCurrentBookIndex(savedLastRead.bookIndex ?? 0);
      setCurrentChapterNumber(savedLastRead.chapterNumber ?? 1);
      setBookmarks(savedBookmarks);
      setHighlights(savedHighlights);
      setNotes(savedNotes);
    }
    init();
  }, []);

  const theme = useMemo(() => {
    return THEMES[settings.themeMode] || THEMES.parchment;
  }, [settings.themeMode]);

  const currentBookMeta = useMemo(() => {
    return getBookByIndex(currentBookIndex) || ALL_BOOKS[0];
  }, [currentBookIndex]);

  const currentChapter = useMemo(() => {
    return getChapter(currentBookIndex, currentChapterNumber);
  }, [currentBookIndex, currentChapterNumber]);

  const hasNextChapter = useMemo(() => {
    if (currentChapterNumber < currentBookMeta.totalChapters) return true;
    return currentBookIndex < ALL_BOOKS.length - 1;
  }, [currentBookIndex, currentChapterNumber, currentBookMeta]);

  const hasPrevChapter = useMemo(() => {
    if (currentChapterNumber > 1) return true;
    return currentBookIndex > 0;
  }, [currentBookIndex, currentChapterNumber]);

  const goToBookAndChapter = useCallback(
    (bIndex: number, cNum: number) => {
      const targetBook = getBookByIndex(bIndex);
      if (!targetBook) return;

      const safeChapter = Math.max(1, Math.min(cNum, targetBook.totalChapters));
      setCurrentBookIndex(bIndex);
      setCurrentChapterNumber(safeChapter);
      setSelectedVerse(null);

      // Save to persistence
      const lastRead: LastReadState = {
        bookIndex: bIndex,
        chapterNumber: safeChapter,
        updatedAt: Date.now(),
      };
      saveLastRead(lastRead);
    },
    []
  );

  const nextChapter = useCallback(() => {
    if (currentChapterNumber < currentBookMeta.totalChapters) {
      goToBookAndChapter(currentBookIndex, currentChapterNumber + 1);
    } else if (currentBookIndex < ALL_BOOKS.length - 1) {
      goToBookAndChapter(currentBookIndex + 1, 1);
    }
  }, [currentBookIndex, currentChapterNumber, currentBookMeta, goToBookAndChapter]);

  const prevChapter = useCallback(() => {
    if (currentChapterNumber > 1) {
      goToBookAndChapter(currentBookIndex, currentChapterNumber - 1);
    } else if (currentBookIndex > 0) {
      const prevBookMeta = ALL_BOOKS[currentBookIndex - 1];
      goToBookAndChapter(currentBookIndex - 1, prevBookMeta.totalChapters);
    }
  }, [currentBookIndex, currentChapterNumber, goToBookAndChapter]);

  const updateSettings = useCallback(
    (patch: Partial<ReaderSettings>) => {
      setSettingsState((prev) => {
        const next = { ...prev, ...patch };
        saveSettings(next);
        return next;
      });
    },
    []
  );

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      updateSettings({ themeMode: mode });
    },
    [updateSettings]
  );

  // Bookmark actions
  const isVerseBookmarked = useCallback(
    (verse: RenderedVerse): boolean => {
      const vid = `${verse.bookIndex}_${verse.chapterNumber}_${verse.verseNumber}`;
      return bookmarks.some((b) => b.id === vid);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (verse: RenderedVerse) => {
      const vid = `${verse.bookIndex}_${verse.chapterNumber}_${verse.verseNumber}`;
      setBookmarks((prev) => {
        const exists = prev.some((b) => b.id === vid);
        let next: BookmarkItem[];
        if (exists) {
          next = prev.filter((b) => b.id !== vid);
        } else {
          const meta = getBookByIndex(verse.bookIndex);
          const newItem: BookmarkItem = {
            id: vid,
            bookIndex: verse.bookIndex,
            chapterNumber: verse.chapterNumber,
            verseNumber: verse.verseNumber,
            verseLabel: verse.verseLabel,
            bookTitleAm: meta?.titleAm || '',
            text: verse.text,
            createdAt: Date.now(),
          };
          next = [newItem, ...prev];
        }
        saveBookmarks(next);
        return next;
      });
    },
    []
  );

  const removeBookmarkById = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      saveBookmarks(next);
      return next;
    });
  }, []);

  // Highlights actions
  const getVerseHighlight = useCallback(
    (verse: RenderedVerse): HighlightItem | undefined => {
      const key = `b${verse.bookIndex}_c${verse.chapterNumber}_v${verse.verseNumber}`;
      return highlights[key];
    },
    [highlights]
  );

  const setVerseHighlight = useCallback(
    (verse: RenderedVerse, colorKey: HighlightColorKey | null) => {
      const key = `b${verse.bookIndex}_c${verse.chapterNumber}_v${verse.verseNumber}`;
      setHighlights((prev) => {
        const next = { ...prev };
        if (!colorKey) {
          delete next[key];
        } else {
          next[key] = {
            id: key,
            bookIndex: verse.bookIndex,
            chapterNumber: verse.chapterNumber,
            verseNumber: verse.verseNumber,
            colorKey,
            text: verse.text,
            createdAt: Date.now(),
          };
        }
        saveHighlights(next);
        return next;
      });
    },
    []
  );

  // Notes actions
  const getVerseNote = useCallback(
    (verse: RenderedVerse): NoteItem | undefined => {
      const id = `b${verse.bookIndex}_c${verse.chapterNumber}_v${verse.verseNumber}`;
      return notes.find((n) => n.id === id);
    },
    [notes]
  );

  const saveVerseNote = useCallback(
    (verse: RenderedVerse, noteContent: string) => {
      const id = `b${verse.bookIndex}_c${verse.chapterNumber}_v${verse.verseNumber}`;
      const meta = getBookByIndex(verse.bookIndex);
      const cleanNote = noteContent.trim();

      setNotes((prev) => {
        let next: NoteItem[];
        if (!cleanNote) {
          next = prev.filter((n) => n.id !== id);
        } else {
          const existingIdx = prev.findIndex((n) => n.id === id);
          const item: NoteItem = {
            id,
            bookIndex: verse.bookIndex,
            chapterNumber: verse.chapterNumber,
            verseNumber: verse.verseNumber,
            verseLabel: verse.verseLabel,
            bookTitleAm: meta?.titleAm || '',
            verseText: verse.text,
            noteContent: cleanNote,
            updatedAt: Date.now(),
          };
          if (existingIdx >= 0) {
            next = [...prev];
            next[existingIdx] = item;
          } else {
            next = [item, ...prev];
          }
        }
        saveNotes(next);
        return next;
      });
    },
    []
  );

  const deleteNoteById = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      saveNotes(next);
      return next;
    });
  }, []);

  const value = {
    currentBookIndex,
    currentChapterNumber,
    currentBookMeta,
    currentChapter,
    hasNextChapter,
    hasPrevChapter,
    goToBookAndChapter,
    nextChapter,
    prevChapter,

    theme,
    settings,
    updateSettings,
    setThemeMode,

    selectedVerse,
    setSelectedVerse,

    bookmarks,
    isVerseBookmarked,
    toggleBookmark,
    removeBookmarkById,

    highlights,
    getVerseHighlight,
    setVerseHighlight,

    notes,
    getVerseNote,
    saveVerseNote,
    deleteNoteById,

    isBookSelectorOpen,
    setIsBookSelectorOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isSearchOpen,
    setIsSearchOpen,
    isBookmarksOpen,
    setIsBookmarksOpen,
    isDailyVerseOpen,
    setIsDailyVerseOpen,
  };

  return <BibleContext.Provider value={value}>{children}</BibleContext.Provider>;
};

export const useBible = (): BibleContextValue => {
  const context = useContext(BibleContext);
  if (!context) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
};
