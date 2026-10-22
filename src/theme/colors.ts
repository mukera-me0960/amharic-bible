export type ThemeMode = 'parchment' | 'ivory' | 'monastic' | 'pureDark';

export interface ThemeColors {
  mode: ThemeMode;
  nameAm: string;
  nameEn: string;
  
  // Backgrounds
  background: string;
  paperBackground: string;
  headerBackground: string;
  cardBackground: string;
  subtleBackground: string;
  overlayBackground: string;
  
  // Text Colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textVerseNumber: string;
  
  // Accents & Rubrication
  accentCrimson: string; // Traditional liturgical red / rubrication
  accentGold: string;    // Antique gilded gold
  accentDeep: string;    // Sacred deep emphasis
  
  // Dividers & Borders
  borderHairline: string;
  borderOrnamental: string;
  
  // Highlights (Traditional mineral & dry pigment tints)
  highlightVermilion: string; // Warm red / amber
  highlightSaffron: string;   // Golden yellow
  highlightSage: string;      // Subtle laurel green
  highlightLapis: string;     // Antique soft lapis blue
  highlightOchre: string;     // Warm earth ochre
  
  // Active / Selected states
  activeItemBg: string;
  statusBar: 'dark-content' | 'light-content';
}

export const THEMES: Record<ThemeMode, ThemeColors> = {
  // 1. Royal Parchment (ጥንታዊ ብራና) - Aged warm manuscript vellum
  parchment: {
    mode: 'parchment',
    nameAm: 'ጥንታዊ ብራና',
    nameEn: 'Royal Parchment',
    background: '#F5EFE1',
    paperBackground: '#F8F4EA',
    headerBackground: '#EFE7D5',
    cardBackground: '#ECE3CE',
    subtleBackground: '#E6DCBF',
    overlayBackground: 'rgba(245, 239, 225, 0.96)',
    
    textPrimary: '#231B15',
    textSecondary: '#5C4A3C',
    textMuted: '#8D7B6D',
    textVerseNumber: '#933829',
    
    accentCrimson: '#942923',
    accentGold: '#9C7A28',
    accentDeep: '#3F2518',
    
    borderHairline: '#DFD4BE',
    borderOrnamental: '#C8BA9B',
    
    highlightVermilion: 'rgba(224, 98, 84, 0.28)',
    highlightSaffron: 'rgba(230, 185, 60, 0.32)',
    highlightSage: 'rgba(125, 160, 110, 0.28)',
    highlightLapis: 'rgba(105, 145, 185, 0.28)',
    highlightOchre: 'rgba(200, 140, 80, 0.28)',
    
    activeItemBg: '#E7DCBE',
    statusBar: 'dark-content',
  },

  // 2. Fine Linen / Ivory (የከበረ ወረቀት) - Soft clean printed scripture paper
  ivory: {
    mode: 'ivory',
    nameAm: 'የከበረ ወረቀት',
    nameEn: 'Linen Ivory',
    background: '#FAF8F5',
    paperBackground: '#FFFFFF',
    headerBackground: '#F3EFEA',
    cardBackground: '#EDE7DF',
    subtleBackground: '#E6DFD4',
    overlayBackground: 'rgba(250, 248, 245, 0.96)',
    
    textPrimary: '#1E1B18',
    textSecondary: '#4F4842',
    textMuted: '#857D75',
    textVerseNumber: '#7D2E24',
    
    accentCrimson: '#8B261D',
    accentGold: '#947228',
    accentDeep: '#2C2621',
    
    borderHairline: '#E8E1D7',
    borderOrnamental: '#D4C9BC',
    
    highlightVermilion: 'rgba(224, 98, 84, 0.24)',
    highlightSaffron: 'rgba(235, 195, 60, 0.28)',
    highlightSage: 'rgba(125, 160, 110, 0.24)',
    highlightLapis: 'rgba(105, 145, 185, 0.24)',
    highlightOchre: 'rgba(200, 140, 80, 0.24)',
    
    activeItemBg: '#ECE4D8',
    statusBar: 'dark-content',
  },

  // 3. Monastic Dark (የሌሊት ጽሞና) - Warm deeply respectful dark reading mode
  monastic: {
    mode: 'monastic',
    nameAm: 'የሌሊት ጽሞና',
    nameEn: 'Monastic Umber',
    background: '#151311',
    paperBackground: '#1B1816',
    headerBackground: '#13110F',
    cardBackground: '#24201D',
    subtleBackground: '#2D2824',
    overlayBackground: 'rgba(21, 19, 17, 0.96)',
    
    textPrimary: '#E8E2D8',
    textSecondary: '#B8AFA4',
    textMuted: '#7D746A',
    textVerseNumber: '#C7756B',
    
    accentCrimson: '#D95850',
    accentGold: '#D4AF37',
    accentDeep: '#F0EBE1',
    
    borderHairline: '#2C2723',
    borderOrnamental: '#453E37',
    
    highlightVermilion: 'rgba(224, 98, 84, 0.35)',
    highlightSaffron: 'rgba(230, 185, 60, 0.35)',
    highlightSage: 'rgba(125, 160, 110, 0.35)',
    highlightLapis: 'rgba(105, 145, 185, 0.35)',
    highlightOchre: 'rgba(200, 140, 80, 0.35)',
    
    activeItemBg: '#2E2822',
    statusBar: 'light-content',
  },

  // 4. Pure Midnight Ink (ጥቁር ጽላት) - High-contrast literary black
  pureDark: {
    mode: 'pureDark',
    nameAm: 'ጥቁር ጽላት',
    nameEn: 'Midnight Ink',
    background: '#0D0D0E',
    paperBackground: '#141416',
    headerBackground: '#0B0B0C',
    cardBackground: '#1F1F23',
    subtleBackground: '#2A2A2F',
    overlayBackground: 'rgba(13, 13, 14, 0.97)',
    
    textPrimary: '#EDECE8',
    textSecondary: '#A9A7A0',
    textMuted: '#6E6C65',
    textVerseNumber: '#B86860',
    
    accentCrimson: '#C94B43',
    accentGold: '#C5A059',
    accentDeep: '#F5F5F3',
    
    borderHairline: '#232328',
    borderOrnamental: '#383842',
    
    highlightVermilion: 'rgba(224, 98, 84, 0.35)',
    highlightSaffron: 'rgba(230, 185, 60, 0.35)',
    highlightSage: 'rgba(125, 160, 110, 0.35)',
    highlightLapis: 'rgba(105, 145, 185, 0.35)',
    highlightOchre: 'rgba(200, 140, 80, 0.35)',
    
    activeItemBg: '#25252B',
    statusBar: 'light-content',
  }
};
