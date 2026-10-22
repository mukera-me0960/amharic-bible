import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  ActivityIndicator,
  Text,
  SafeAreaView,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  NotoSerifEthiopic_400Regular,
  NotoSerifEthiopic_700Bold,
} from '@expo-google-fonts/noto-serif-ethiopic';
import { Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import {
  EBGaramond_400Regular,
  EBGaramond_500Medium,
  EBGaramond_700Bold,
} from '@expo-google-fonts/eb-garamond';

import { BibleProvider, useBible } from './src/context/BibleContext';
import { Header } from './src/components/Header';
import { ChapterReader } from './src/components/ChapterReader';
import { BookSelectorModal } from './src/components/BookSelectorModal';
import { SettingsDrawer } from './src/components/SettingsDrawer';
import { SearchModal } from './src/components/SearchModal';
import { VerseActionModal } from './src/components/VerseActionModal';
import { BookmarksModal } from './src/components/BookmarksModal';
import { DailyVerseModal } from './src/components/DailyVerseModal';

const MainApp: React.FC = () => {
  const { theme } = useBible();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.headerBackground }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          style={theme.mode === 'monastic' || theme.mode === 'pureDark' ? 'light' : 'dark'}
        />
        <Header />
        <ChapterReader />

        {/* Modals & Drawers */}
        <BookSelectorModal />
        <SettingsDrawer />
        <SearchModal />
        <VerseActionModal />
        <BookmarksModal />
        <DailyVerseModal />
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    NotoSerifEthiopic_400Regular,
    NotoSerifEthiopic_700Bold,
    Cinzel_700Bold,
    EBGaramond_400Regular,
    EBGaramond_500Medium,
    EBGaramond_700Bold,
  });

  // Inject web Google Fonts link if running on web for instant crisp serif rendering
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const linkId = 'amharic-bible-google-fonts';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Noto+Serif+Ethiopic:wght@300;400;500;600;700&display=swap';
        document.head.appendChild(link);

        // Inject global document styles for smooth scrolling and clean font antialiasing
        const style = document.createElement('style');
        style.innerHTML = `
          body, html, #root {
            margin: 0;
            padding: 0;
            height: 100%;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            font-family: 'Noto Serif Ethiopic', 'Abyssinica SIL', 'Nyala', Georgia, serif;
          }
          ::selection {
            background-color: rgba(148, 41, 35, 0.25);
            color: inherit;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  if (!fontsLoaded && Platform.OS !== 'web') {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#942923" />
        <Text style={styles.loadingLabel}>መጽሐፍ ቅዱስ...</Text>
      </View>
    );
  }

  return (
    <BibleProvider>
      <MainApp />
    </BibleProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0,
  },
  container: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5EFE1',
    gap: 12,
  },
  loadingLabel: {
    fontSize: 16,
    color: '#3F2518',
    letterSpacing: 0.5,
  },
});
