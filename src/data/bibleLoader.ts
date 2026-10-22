import rawBibleData from '../../amharic_bible.json';
import { ALL_BOOKS, BookMeta, getBookByIndex } from './bibleMetadata';
import { normalizeAmharic, toGeezNumeral } from '../utils/amharicUtils';

export interface RawChapter {
  chapter: string;
  title?: string;
  verses: string[];
}

export interface RawBook {
  title: string;
  abbv?: string;
  chapters: RawChapter[];
}

export interface RawBible {
  title: string;
  books: RawBook[];
}

const bible = rawBibleData as RawBible;

export interface RenderedVerse {
  id: string; // e.g. "1_1_1" -> bookIndex_chapterIndex_verseNumber
  bookIndex: number;
  chapterIndex: number; // 0-indexed
  chapterNumber: number; // 1-indexed
  verseNumber: number; // 1-indexed
  verseLabel: string; // e.g. "1" or "2-3"
  verseLabelGeez: string; // e.g. "፩" or "፪-፫"
  text: string;
  isCombined: boolean;
  startVerse: number;
  endVerse: number;
}

export interface RenderedChapter {
  bookIndex: number;
  bookMeta: BookMeta;
  chapterNumber: number; // 1-indexed
  title?: string;
  verses: RenderedVerse[];
}

/**
 * Parses and returns a cleanly formatted chapter
 */
export function getChapter(bookIndex: number, chapterNumber: number): RenderedChapter | null {
  const book = bible.books[bookIndex];
  const meta = getBookByIndex(bookIndex);
  if (!book || !meta) return null;

  const chapterObj = book.chapters[chapterNumber - 1];
  if (!chapterObj) return null;

  const renderedVerses: RenderedVerse[] = [];
  const rawVerses = chapterObj.verses;

  let pendingEmptyStart: number | null = null;

  for (let i = 0; i < rawVerses.length; i++) {
    const verseText = rawVerses[i] ? rawVerses[i].trim() : '';
    const currentVerseNum = i + 1;

    if (!verseText) {
      if (pendingEmptyStart === null) {
        pendingEmptyStart = currentVerseNum;
      }
      continue;
    }

    const startV = pendingEmptyStart !== null ? pendingEmptyStart : currentVerseNum;
    const endV = currentVerseNum;
    const isCombined = startV !== endV;

    const label = isCombined ? `${startV}-${endV}` : `${currentVerseNum}`;
    const labelGeez = isCombined
      ? `${toGeezNumeral(startV)}-${toGeezNumeral(endV)}`
      : toGeezNumeral(currentVerseNum);

    renderedVerses.push({
      id: `${bookIndex}_${chapterNumber - 1}_${currentVerseNum}`,
      bookIndex,
      chapterIndex: chapterNumber - 1,
      chapterNumber,
      verseNumber: currentVerseNum,
      verseLabel: label,
      verseLabelGeez: labelGeez,
      text: verseText,
      isCombined,
      startVerse: startV,
      endVerse: endV,
    });

    pendingEmptyStart = null;
  }

  return {
    bookIndex,
    bookMeta: meta,
    chapterNumber,
    title: chapterObj.title || '',
    verses: renderedVerses,
  };
}

export interface SearchResultItem {
  bookIndex: number;
  bookTitleAm: string;
  bookTitleEn: string;
  chapterNumber: number;
  verseNumber: number;
  verseLabel: string;
  text: string;
  matchSnippet: string;
}

/**
 * Searches across the entire Amharic Bible
 */
export function searchBible(
  query: string,
  filterTestament?: 'OT' | 'NT',
  limit: number = 50
): SearchResultItem[] {
  const cleanQuery = query.trim();
  if (cleanQuery.length < 2) return [];

  const normalizedQuery = normalizeAmharic(cleanQuery);
  const results: SearchResultItem[] = [];

  for (let b = 0; b < bible.books.length; b++) {
    const book = bible.books[b];
    const meta = ALL_BOOKS[b];
    if (filterTestament && meta.testament !== filterTestament) continue;

    for (let c = 0; c < book.chapters.length; c++) {
      const chapter = book.chapters[c];
      const chapterNum = c + 1;

      for (let v = 0; v < chapter.verses.length; v++) {
        const rawText = chapter.verses[v];
        if (!rawText) continue;

        const normalizedVerse = normalizeAmharic(rawText);
        if (normalizedVerse.includes(normalizedQuery) || rawText.includes(cleanQuery)) {
          results.push({
            bookIndex: b,
            bookTitleAm: meta.titleAm,
            bookTitleEn: meta.titleEn,
            chapterNumber: chapterNum,
            verseNumber: v + 1,
            verseLabel: `${v + 1}`,
            text: rawText,
            matchSnippet: rawText,
          });

          if (results.length >= limit) {
            return results;
          }
        }
      }
    }
  }

  return results;
}

/**
 * Curated Traditional Daily Scriptures for quiet reflection
 */
export const DAILY_MEDITATIONS = [
  {
    bookIndex: 18, // Psalms (መዝሙረ ዳዊት)
    chapterNumber: 23,
    verseNumber: 1,
    text: 'እግዚአብሔር እረኛዬ ነው፥ የሚያሳጣኝም የለም።',
    reference: 'መዝሙረ ዳዊት ፳፫፥፩',
  },
  {
    bookIndex: 42, // John (የዮሐንስ ወንጌል)
    chapterNumber: 1,
    verseNumber: 1,
    text: 'በመጀመሪያው ቃል ነበረ፥ ቃልም በእግዚአብሔር ዘንድ ነበረ፥ ቃልም እግዚአብሔር ነበረ።',
    reference: 'የዮሐንስ ወንጌል ፩፥፩',
  },
  {
    bookIndex: 42, // John
    chapterNumber: 3,
    verseNumber: 16,
    text: 'በእርሱ የሚያምን ሁሉ የዘላለም ሕይወት እንዲኖረው እንጂ እንዳይጠፋ እግዚአብሔር አንድያ ልጁን እስኪሰጥ ድረስ ዓለሙን እንዲሁ ወዶአልና።',
    reference: 'የዮሐንስ ወንጌል ፫፥፲፮',
  },
  {
    bookIndex: 18, // Psalms
    chapterNumber: 119,
    verseNumber: 105,
    text: 'ሕግህ ለእግሬ መብራት፥ ለመንገዴ ብርሃን ነው።',
    reference: 'መዝሙረ ዳዊት ፻፲፱፥፻፭',
  },
  {
    bookIndex: 19, // Proverbs (መጽሐፈ ምሳሌ)
    chapterNumber: 3,
    verseNumber: 5,
    text: 'በሙሉ ልብህ በእግዚአብሔር ታመን፥ በራስህም ማስተዋል አትደገፍ፤',
    reference: 'መጽሐፈ ምሳሌ ፫፥፭',
  },
  {
    bookIndex: 44, // Romans (ወደ ሮሜ ሰዎች)
    chapterNumber: 8,
    verseNumber: 28,
    text: 'እግዚአብሔርንም ለሚወዱት እንደ አሳቡም ለተጠሩት ነገር ሁሉ ለበጎ እንዲደረግ እናውቃለን።',
    reference: 'ወደ ሮሜ ሰዎች ፰፥፳፰',
  },
  {
    bookIndex: 49, // Philippians (ወደ ፊልጵስዩስ ሰዎች)
    chapterNumber: 4,
    verseNumber: 13,
    text: 'ኃይልን በሚሰጠኝ በክርስቶስ ሁሉን እችላለሁ።',
    reference: 'ወደ ፊልጵስዩስ ፬፥፲፫',
  },
];
