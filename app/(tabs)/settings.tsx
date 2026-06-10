import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLanguage } from '../../src/i18n/LanguageContext';

export default function SettingsScreen() {
  const { lang, setLang, t } = useLanguage();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>{t('lang_switch')}</Text>
      <View style={styles.langRow}>
        <TouchableOpacity
          style={[styles.langBtn, lang === 'zh' && styles.langBtnActive]}
          onPress={() => setLang('zh')}
        >
          <Text style={[styles.langBtnText, lang === 'zh' && styles.langBtnTextActive]}>中文</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
          onPress={() => setLang('en')}
        >
          <Text style={[styles.langBtnText, lang === 'en' && styles.langBtnTextActive]}>English</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>{t('about_title')}</Text>
      <View style={styles.aboutBox}>
        <Text style={styles.aboutText}>{t('about_text')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12, marginTop: 8 },
  langRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  langBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    alignItems: 'center',
  },
  langBtnActive: { backgroundColor: '#c41e3a', borderColor: '#c41e3a' },
  langBtnText: { fontSize: 16, color: '#666' },
  langBtnTextActive: { color: '#fff', fontWeight: '600' },
  aboutBox: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  aboutText: { fontSize: 14, color: '#666', lineHeight: 22 },
});
