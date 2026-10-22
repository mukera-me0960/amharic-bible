# ✟ መጽሐፍ ቅዱስ — Amharic Bible

<div align="center">

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.87.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-942923?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

**«ሕግህ ለእግሬ መብራት፥ ለመንገዴም ብርሃን ነው።»**  
*— መዝሙር 119፥105*

<br />

*An elegant, timeless, and deeply respectful Amharic Bible reading experience inspired by the classical King James Bible tradition and ancient Ethiopic illuminated manuscripts (ብራና).*

</div>

---

## ✦ Vision & Aesthetic Philosophy

Most modern digital Bible apps feel overly computerized, cluttered with social media elements, and disconnected from the sacred weight of scripture. 

**Amharic Bible** is crafted to revive the dignity of reading God's Word:
- **Manuscript Typography**: High-legibility Ethiopic serif typefaces (*Noto Serif Ethiopic*, *Cinzel*, and *EB Garamond*) with generous line-heights and bounded reading measures for distraction-free contemplation.
- **Rubricated Scripture Design**: Red Ge'ez numerals (፩, ፪, ፫...) and ornamental cross dividers (`✟`) inspired by classic liturgical rubrics and antique manuscripts.
- **Sacred Paper Themes**: 4 harmonious, eye-pleasing themes crafted with warm parchment undertones.

---

## ✨ Key Features

### 📖 Classic Scripture Reading
- **Dual Reading Modes**:
  - *ቀጣይነት ያለው ንባብ (Continuous Flow)*: Traditional paragraph reading mode with inline verse markers and illuminated drop caps.
  - *የቁጥር ዝርዝር (Verse-by-Verse)*: Classic indented verse reference layout with distinct line separations.
- **Amharic & Ge'ez Numerals**: Toggle between classical Ge'ez numbers (፩, ፪, ፫) and Western Arabic digits (1, 2, 3).
- **Customizable Typesetting**: Tunable font scale (15px to 32px) and 4 comfortable line-height presets (*ምቹ*, *መደበኛ*, *ሰፊ*, *የተዘረጋ*).

### 👆 Fluid Swipe Navigation
- **Natural Chapter Gestures**: Swipe right-to-left (**←**) to advance to the next chapter; swipe left-to-right (**→**) to return to the previous chapter without breaking reading momentum.

### 🎨 Mineral Pigment Highlighting & Notes
- **5 Authentic Pigment Tints**:
  - 🔴 **Vermilion (ቀይ)** — Liturgical scarlet
  - 🟡 **Saffron (ወርቃማ)** — Sacred gold
  - 🟢 **Sage (ወይራ)** — Olive leaf
  - 🔵 **Lapis (ሰማያዊ)** — Celestial azure
  - 🟤 **Ochre (ቢጫ)** — Earth pigment
- **Auto-Closing Action Sheet**: Selecting a pigment color applies the highlight and automatically dismisses the sheet so you can continue reading seamlessly.
- **Personal Reflections**: Write private study reflections and notes linked to specific verses.

### 📜 Illuminated Daily Verse (የዕለቱ ቃል)
- Curated daily scripture meditations presented in an illuminated parchment card with quick chapter jumping, verse copying, and sharing.

### 🔍 Concordance & Search (የቃላት ፍለጋ)
- Fast concordance search with intelligent Amharic phonetic normalization for interchangeable characters:
  - `ሀ` / `ሐ` / `ኀ`
  - `ሰ` / `ሠ`
  - `አ` / `ዐ`
  - `ጸ` / `ፀ`

### 🌙 4 Sacred Reading Themes
| Theme | Name | Description |
| :--- | :--- | :--- |
| 📜 | **ጥንታዊ ብራና (Royal Parchment)** | Warm antique parchment with warm umber and crimson rubrics |
| 📄 | **የከበረ ወረቀት (Linen Ivory)** | Crisp linen paper with rich charcoal ink |
| 🕯️ | **የሌሊት ጽሞና (Monastic Dark)** | Soft slate midnight dark mode for night meditation |
| 🌌 | **ጥቁር ጽላት (Midnight Ink)** | Deep AMOLED black with high-contrast warm ivory text |

---

## 🗂️ Project Architecture

```text
amharic-bible-json/
├── assets/                  # App icon, adaptive icon, splash screen assets
├── individual_books/        # 66 individual JSON files for all OT and NT books
├── src/
│   ├── components/          # Reusable UI components & modals
│   │   ├── BookmarksModal.tsx      # Saved bookmarks, notes & highlights drawer
│   │   ├── BookSelectorModal.tsx   # 66-book catalog & chapter grid picker
│   │   ├── ChapterReader.tsx       # Core reader engine with swipe gestures
│   │   ├── DailyVerseModal.tsx     # Illuminated daily meditation card
│   │   ├── Header.tsx              # Minimalist dignified top bar
│   │   ├── OrnamentalDivider.tsx   # Ethiopian cross & manuscript dividers
│   │   ├── SearchModal.tsx         # Amharic concordance search engine
│   │   ├── SettingsDrawer.tsx      # Theme & typography customizer
│   │   ├── VerseActionModal.tsx    # Verse highlighting & notes sheet
│   │   └── VerseItem.tsx           # Individual verse renderer
│   ├── context/
│   │   └── BibleContext.tsx        # Global reading state & persistence provider
│   ├── data/
│   │   ├── bibleLoader.ts          # Fast chapter indexing & daily verses
│   │   ├── bibleMetadata.ts        # 66 books metadata (OT 39 / NT 27)
│   │   └── booksMeta.json          # Precomputed chapter counts & abbreviations
│   ├── theme/
│   │   ├── colors.ts               # Palette tokens for 4 parchment themes
│   │   └── typography.ts           # Serif font configurations & line heights
│   └── utils/
│       ├── amharicUtils.ts         # Ge'ez numeral converter & search normalizer
│       └── storage.ts              # AsyncStorage persistence layer
├── amharic_bible.json       # Complete 66-book Bible in a single JSON file
├── app.json                 # Expo project configuration
├── App.tsx                  # Root application entry point
└── package.json             # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android Studio / Android Emulator (or Expo Go / iOS Simulator)

### Installation
```bash
# 1. Clone repository
git clone https://github.com/bekalu73/Amharic-Bible.git
cd Amharic-Bible

# 2. Install dependencies
npm install

# 3. Start Expo dev server
npx expo start
```

### Running on Android Emulator
```bash
# Launch Android build
npx expo run:android
# or with Expo dev server:
npx expo start --android
```

---

## 📑 JSON Data Specification

The repository includes both the complete Amharic Bible in a single unified JSON (`amharic_bible.json`) and 66 individual book JSON files in `individual_books/`.

### Combined Verse Convention
Unlike the KJV or NASB translations, the traditional Amharic Bible occasionally combines two contiguous verses into one (denoted on hardcover editions as `start-end`, e.g., `2-3`):

> **Genesis 7:2-3**  
> `2-3` ከንጹሕ እንስሳ ሁሉ ሰባት ሰባት ተባትና እንስት፥ ንጹሕ ካልሆነ እንስሳም ሁለት ሁለት ተባትና እንስት፥ ከሰማይ ወፍ ደግሞ ሰባት ሰባት ተባትና እንስት እያደረግህ በምድር ላይ ለዘር ይቀር ዘንድ ለአንተ ትወስዳለህ።

In the raw JSON dataset, combined verses are normalized so the reader seamlessly detects and labels them with their proper range (e.g., `፪-፫` or `2-3`).

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and distribute for personal, educational, and church projects.

<div align="center">
  <sub>የተዘጋጀው ለእግዚአብሔር ክብርና ለቃል አፍቃሪዎች ሁሉ ነው።</sub>
</div>