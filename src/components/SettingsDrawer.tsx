import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Switch,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useBible } from '../context/BibleContext';
import { THEMES, ThemeMode } from '../theme/colors';
import { FONT_FAMILIES } from '../theme/typography';
import { LineHeightKey, ReadingMode } from '../utils/storage';

export const SettingsDrawer: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    theme,
    settings,
    updateSettings,
    setThemeMode,
  } = useBible();

  const handleFontSizeChange = (delta: number) => {
    const nextSize = Math.max(15, Math.min(32, settings.fontSize + delta));
    updateSettings({ fontSize: nextSize });
  };

  const themeOptions: ThemeMode[] = ['parchment', 'ivory', 'monastic', 'pureDark'];

  return (
    <Modal
      visible={isSettingsOpen}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setIsSettingsOpen(false)}
    >
      <View style={styles.modalBackdrop}>
        <SafeAreaView style={[styles.drawerContainer, { backgroundColor: theme.paperBackground }]}>
          {/* Rounded Handle Indicator */}
          <View style={styles.handleContainer}>
            <View style={[styles.dragHandle, { backgroundColor: theme.borderHairline }]} />
          </View>

          {/* Header */}
          <View style={[styles.drawerHeader, { borderBottomColor: theme.borderHairline }]}>
            <Text
              style={[
                styles.drawerTitle,
                { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
              ]}
            >
              የንባብ ምርጫዎች
            </Text>

            <TouchableOpacity
              onPress={() => setIsSettingsOpen(false)}
              style={[styles.closeButton, { borderColor: theme.borderHairline }]}
              activeOpacity={0.7}
            >
              <X size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.drawerScroll}
            contentContainerStyle={styles.drawerContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Theme Selection */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionLabel,
                  { color: theme.accentCrimson, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                ]}
              >
                የወረቀት ገጽታና ቀለም
              </Text>

              <View style={styles.themeGrid}>
                {themeOptions.map((modeKey) => {
                  const t = THEMES[modeKey];
                  const isSelected = settings.themeMode === modeKey;

                  return (
                    <TouchableOpacity
                      key={modeKey}
                      onPress={() => setThemeMode(modeKey)}
                      style={[
                        styles.themeCard,
                        {
                          backgroundColor: t.background,
                          borderColor: isSelected ? theme.accentCrimson : theme.borderHairline,
                          borderWidth: isSelected ? 2 : 1,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <View style={styles.themeCardInner}>
                        <Text
                          style={[
                            styles.themeNameAm,
                            { color: t.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                          ]}
                        >
                          {t.nameAm}
                        </Text>
                        <Text
                          style={[
                            styles.themeNameEn,
                            { color: t.textSecondary, fontFamily: FONT_FAMILIES.garamondSerif },
                          ]}
                        >
                          {t.nameEn}
                        </Text>
                      </View>

                      {isSelected && (
                        <View
                          style={[
                            styles.checkBadge,
                            { backgroundColor: theme.accentCrimson },
                          ]}
                        >
                          <Check size={12} color="#FFFFFF" strokeWidth={2.5} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. Font Size Scaling */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionLabel,
                  { color: theme.accentCrimson, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                ]}
              >
                የፊደል መጠን
              </Text>

              <View
                style={[
                  styles.fontSizeControlRow,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.borderHairline,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleFontSizeChange(-2)}
                  style={[styles.fontBtn, { borderRightColor: theme.borderHairline }]}
                  activeOpacity={0.7}
                  disabled={settings.fontSize <= 15}
                >
                  <Text
                    style={[
                      styles.fontBtnTextSmall,
                      { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                    ]}
                  >
                    ሀ-
                  </Text>
                </TouchableOpacity>

                <View style={styles.fontPreviewContainer}>
                  <Text
                    style={[
                      styles.fontPreviewSize,
                      { color: theme.textPrimary, fontFamily: FONT_FAMILIES.garamondSerif },
                    ]}
                  >
                    {settings.fontSize} px
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleFontSizeChange(2)}
                  style={[styles.fontBtn, { borderLeftColor: theme.borderHairline }]}
                  activeOpacity={0.7}
                  disabled={settings.fontSize >= 32}
                >
                  <Text
                    style={[
                      styles.fontBtnTextLarge,
                      { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                    ]}
                  >
                    ሀ+
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. Line Spacing */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionLabel,
                  { color: theme.accentCrimson, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                ]}
              >
                የመስመር ክፍተት
              </Text>

              <View style={styles.buttonToggleRow}>
                {(
                  [
                    { key: 'compact', label: 'ጥብቅ' },
                    { key: 'classic', label: 'መደበኛ' },
                    { key: 'generous', label: 'ሰፊ' },
                  ] as { key: LineHeightKey; label: string }[]
                ).map((item) => {
                  const isSelected = settings.lineHeightKey === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => updateSettings({ lineHeightKey: item.key })}
                      style={[
                        styles.toggleButton,
                        {
                          backgroundColor: isSelected
                            ? theme.accentCrimson
                            : theme.cardBackground,
                          borderColor: isSelected
                            ? theme.accentCrimson
                            : theme.borderHairline,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.toggleButtonText,
                          {
                            color: isSelected ? '#FFFFFF' : theme.textPrimary,
                            fontFamily: FONT_FAMILIES.ethiopicSerif,
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 4. Reading Mode: Paragraph Flow vs Verse List */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionLabel,
                  { color: theme.accentCrimson, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                ]}
              >
                የንባብ አቀራረብ ስልት
              </Text>

              <View style={styles.buttonToggleRow}>
                {(
                  [
                    { key: 'flow', label: 'ተከታታይ የንባብ ፍሰት' },
                    { key: 'verse', label: 'ቁጥር በቁጥር (ጥናት)' },
                  ] as { key: ReadingMode; label: string }[]
                ).map((item) => {
                  const isSelected = settings.readingMode === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => updateSettings({ readingMode: item.key })}
                      style={[
                        styles.toggleButton,
                        {
                          backgroundColor: isSelected
                            ? theme.accentCrimson
                            : theme.cardBackground,
                          borderColor: isSelected
                            ? theme.accentCrimson
                            : theme.borderHairline,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.toggleButtonText,
                          {
                            color: isSelected ? '#FFFFFF' : theme.textPrimary,
                            fontFamily: FONT_FAMILIES.ethiopicSerif,
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 5. Toggles for Ge'ez Numerals & Rubrication */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionLabel,
                  { color: theme.accentCrimson, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                ]}
              >
                ተጨማሪ ቅንብሮች
              </Text>

              {/* Ge'ez Numeral Switch */}
              <View
                style={[
                  styles.switchRow,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.borderHairline,
                  },
                ]}
              >
                <View style={styles.switchLabelCol}>
                  <Text
                    style={[
                      styles.switchTitle,
                      { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                    ]}
                  >
                    የግዕዝ ቁጥሮች (፩፣ ፪፣ ፫)
                  </Text>
                  <Text
                    style={[
                      styles.switchDesc,
                      { color: theme.textSecondary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                    ]}
                  >
                    በምዕራፍና ቁጥሮች ላይ ባህላዊውን የግዕዝ ቁጥር ይጠቀሙ
                  </Text>
                </View>

                <Switch
                  value={settings.geezNumerals}
                  onValueChange={(val) => updateSettings({ geezNumerals: val })}
                  trackColor={{ false: theme.borderHairline, true: theme.accentCrimson }}
                  thumbColor={theme.paperBackground}
                />
              </View>

              {/* Rubricated numbers Switch */}
              <View
                style={[
                  styles.switchRow,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.borderHairline,
                    marginTop: 8,
                  },
                ]}
              >
                <View style={styles.switchLabelCol}>
                  <Text
                    style={[
                      styles.switchTitle,
                      { color: theme.textPrimary, fontFamily: FONT_FAMILIES.ethiopicSerifBold },
                    ]}
                  >
                    ቀይ የቁጥር ማድመቂያ (Rubrication)
                  </Text>
                  <Text
                    style={[
                      styles.switchDesc,
                      { color: theme.textSecondary, fontFamily: FONT_FAMILIES.ethiopicSerif },
                    ]}
                  >
                    የጥንታዊ መጻሕፍት ባሕል የሆነውን ቀይ ቀለም ለቁጥሮች ያብሩ
                  </Text>
                </View>

                <Switch
                  value={settings.rubricatedNumbers}
                  onValueChange={(val) => updateSettings({ rubricatedNumbers: val })}
                  trackColor={{ false: theme.borderHairline, true: theme.accentCrimson }}
                  thumbColor={theme.paperBackground}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  drawerContainer: {
    height: '82%',
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
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  drawerTitle: {
    fontSize: 18,
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 3,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerScroll: {
    flex: 1,
  },
  drawerContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeCard: {
    width: '48%',
    padding: 12,
    borderRadius: 4,
    minHeight: 64,
    justifyContent: 'center',
    position: 'relative',
  },
  themeCardInner: {
    flex: 1,
  },
  themeNameAm: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
  themeNameEn: {
    fontSize: 11,
    marginTop: 2,
    opacity: 0.8,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fontBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontBtnTextSmall: {
    fontSize: 15,
  },
  fontBtnTextLarge: {
    fontSize: 20,
  },
  fontPreviewContainer: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontPreviewSize: {
    fontSize: 15,
    fontWeight: '600',
  },
  buttonToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    fontSize: 13,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  switchLabelCol: {
    flex: 1,
    paddingRight: 12,
  },
  switchTitle: {
    fontSize: 14,
  },
  switchDesc: {
    fontSize: 11,
    marginTop: 2,
    opacity: 0.8,
  },
});
