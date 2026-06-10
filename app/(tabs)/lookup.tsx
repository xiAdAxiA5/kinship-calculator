import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../src/i18n/LanguageContext';
import { createKinshipEngine } from '../../src/engine';
import { KinshipTerm } from '../../src/engine/types';

const engine = createKinshipEngine();

const CATEGORIES = [
  { key: 'all', labelZh: '全部', labelEn: 'All' },
  { key: 'direct', labelZh: '直系', labelEn: 'Direct' },
  { key: 'paternal', labelZh: '父系', labelEn: 'Paternal' },
  { key: 'maternal', labelZh: '母系', labelEn: 'Maternal' },
  { key: 'affinal', labelZh: '姻亲', labelEn: 'Affinal' },
  { key: 'senior', labelZh: '长辈', labelEn: 'Senior' },
  { key: 'same_gen', labelZh: '同辈', labelEn: 'Same' },
  { key: 'junior', labelZh: '晚辈', labelEn: 'Junior' },
  { key: 'special', labelZh: '特殊', labelEn: 'Special' },
];

export default function LookupScreen() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const results = useMemo(() => {
    if (search.trim()) {
      return engine.lookupByTerm(search);
    }
    if (category === 'all') {
      return engine.getAllTerms();
    }
    return engine.getAllTerms().filter(term => term.tags.includes(category));
  }, [search, category]);

  const handleTermPress = (term: KinshipTerm) => {
    router.push({
      pathname: '/result',
      params: {
        term: JSON.stringify(term),
        path: JSON.stringify(term.paths[0] || []),
      },
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={(text) => { setSearch(text); setCategory('all'); }}
        placeholder={t('search_placeholder')}
        placeholderTextColor="#aaa"
      />

      {!search.trim() && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.catBtn, category === cat.key && styles.catBtnActive]}
              onPress={() => setCategory(cat.key)}
            >
              <Text style={[styles.catBtnText, category === cat.key && styles.catBtnTextActive]}>
                {lang === 'zh' ? cat.labelZh : cat.labelEn}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView style={styles.results}>
        {results.map((term, i) => (
          <TouchableOpacity
            key={`${term.term}-${i}`}
            style={styles.termItem}
            onPress={() => handleTermPress(term)}
          >
            <Text style={styles.termText}>{term.term}</Text>
            <View style={styles.termInfo}>
              <Text style={styles.termPinyin}>{term.pinyin}</Text>
              <Text style={styles.termBrief} numberOfLines={1}>
                {lang === 'zh' ? term.explanationZh : term.explanationEn}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {results.length === 0 && (
          <Text style={styles.empty}>{lang === 'zh' ? '未找到匹配的称谓' : 'No matches found'}</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  searchInput: {
    margin: 16, marginBottom: 8,
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 16,
    backgroundColor: '#fff',
  },
  categories: { paddingHorizontal: 16, marginBottom: 8, maxHeight: 44 },
  catBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee',
    marginRight: 8,
  },
  catBtnActive: { backgroundColor: '#c41e3a', borderColor: '#c41e3a' },
  catBtnText: { fontSize: 13, color: '#666' },
  catBtnTextActive: { color: '#fff' },
  results: { flex: 1, paddingHorizontal: 16 },
  termItem: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 8, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  termText: { fontSize: 20, fontWeight: 'bold', color: '#c41e3a', width: 80 },
  termInfo: { flex: 1, marginLeft: 12 },
  termPinyin: { fontSize: 13, color: '#888' },
  termBrief: { fontSize: 13, color: '#666', marginTop: 2 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 15 },
});
