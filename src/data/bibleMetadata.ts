import booksMetaDataRaw from './booksMeta.json';

export type Testament = 'OT' | 'NT';

export type BookCategory =
  | 'law'
  | 'history'
  | 'poetry'
  | 'prophecy'
  | 'gospel'
  | 'paul'
  | 'general'
  | 'revelation';

export interface BookMeta {
  id: number;
  index: number;
  titleAm: string;
  titleEn: string;
  abbvAm: string;
  abbvEn: string;
  testament: Testament;
  category: BookCategory;
  totalChapters: number;
  totalVerses: number;
}

export interface CategoryInfo {
  key: BookCategory;
  nameAm: string;
  nameEn: string;
  testament: Testament;
  descriptionAm: string;
}

export const CATEGORIES: Record<BookCategory, CategoryInfo> = {
  law: {
    key: 'law',
    nameAm: 'የሕግ መጻሕፍት (ኦሪት)',
    nameEn: 'The Pentateuch / Law',
    testament: 'OT',
    descriptionAm: 'ዘፍጥረት እስከ ዘዳግም',
  },
  history: {
    key: 'history',
    nameAm: 'የታሪክ መጻሕፍት',
    nameEn: 'Historical Books',
    testament: 'OT',
    descriptionAm: 'ኢያሱ እስከ አስቴር እና የሐዋርያት ሥራ',
  },
  poetry: {
    key: 'poetry',
    nameAm: 'የቅኔና የጥበብ መጻሕፍት',
    nameEn: 'Poetry & Wisdom',
    testament: 'OT',
    descriptionAm: 'ኢዮብ እስከ መኃልየ መኃልይ',
  },
  prophecy: {
    key: 'prophecy',
    nameAm: 'የትንቢት መጻሕፍት',
    nameEn: 'The Prophets',
    testament: 'OT',
    descriptionAm: 'ኢሳይያስ እስከ ሚልክያስ',
  },
  gospel: {
    key: 'gospel',
    nameAm: 'ቅዱሳን ወንጌላት',
    nameEn: 'The Holy Gospels',
    testament: 'NT',
    descriptionAm: 'ማቴዎስ፣ ማርቆስ፣ ሉቃስ፣ ዮሐንስ',
  },
  paul: {
    key: 'paul',
    nameAm: 'የቅዱስ ጳውሎስ መልእክቶች',
    nameEn: 'Pauline Epistles',
    testament: 'NT',
    descriptionAm: 'ሮሜ እስከ ፊልሞና',
  },
  general: {
    key: 'general',
    nameAm: 'አጠቃላይ መልእክታት',
    nameEn: 'General Epistles',
    testament: 'NT',
    descriptionAm: 'ዕብራውያን እስከ ይሁዳ',
  },
  revelation: {
    key: 'revelation',
    nameAm: 'የዮሐንስ ራእይ',
    nameEn: 'Revelation / Apocalypse',
    testament: 'NT',
    descriptionAm: 'ትንቢተ ዮሐንስ',
  },
};

export const ALL_BOOKS: BookMeta[] = booksMetaDataRaw as BookMeta[];

export const OLD_TESTAMENT_BOOKS = ALL_BOOKS.filter((b) => b.testament === 'OT');
export const NEW_TESTAMENT_BOOKS = ALL_BOOKS.filter((b) => b.testament === 'NT');

export function getBookById(id: number): BookMeta | undefined {
  return ALL_BOOKS.find((b) => b.id === id);
}

export function getBookByIndex(index: number): BookMeta | undefined {
  return ALL_BOOKS[index];
}
