import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../src/i18n/LanguageContext';
import { createKinshipEngine } from '../../src/engine';
import { KinshipTerm } from '../../src/engine/types';
import { useRelatives } from '../../src/store/RelativesContext';

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
  const { relatives, removeRelative } = useRelatives();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showSaved, setShowSaved] = useState(false);

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

  const handleSavedPress = (rel: typeof relatives[number]) => {
    const termEntry = engine.getAllTerms().find(t => t.term === rel.term);
    router.push({
      pathname: '/result',
      params: {
        term: termEntry ? JSON.stringify(termEntry) : null,
        path: JSON.stringify(rel.path),
        relativeName: rel.name,
        relativePhoto: rel.photo || null,
        relativeAddress: rel.address || null,
        relativeNotes: rel.notes || null,
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
              onPress={() => { setCategory(cat.key); setShowSaved(false); }}
            >
              <Text style={[styles.catBtnText, category === cat.key && styles.catBtnTextActive]}>
                {lang === 'zh' ? cat.labelZh : cat.labelEn}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Toggle: terms / saved relatives */}
      {!search.trim() && (
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, !showSaved && styles.toggleBtnActive]}
            onPress={() => setShowSaved(false)}
          >
            <Text style={[styles.toggleBtnText, !showSaved && styles.toggleBtnTextActive]}>
              {lang === 'zh' ? '称谓列表' : 'Terms'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, showSaved && styles.toggleBtnActive]}
            onPress={() => setShowSaved(true)}
          >
            <Text style={[styles.toggleBtnText, showSaved && styles.toggleBtnTextActive]}>
              {t('saved_relatives')} ({relatives.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.results}>
        {!showSaved ? (
          <>
            {results.map((term, i) => (
              <TouchableOpacity key={`${term.term}-${i}`} style={styles.termItem} onPress={() => handleTermPress(term)}>
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
          </>
        ) : (
          <>
            {relatives.length === 0 ? (
              <Text style={styles.empty}>{t('saved_empty')}</Text>
            ) : (
              relatives.map(rel => (
                <TouchableOpacity key={rel.id} style={styles.savedItem} onPress={() => handleSavedPress(rel)}>
                  <Text style={styles.savedName}>{rel.name}</Text>
                  <View style={styles.savedInfo}>
                    <Text style={styles.savedTerm}>{rel.term}</Text>
                    {rel.address ? <Text style={styles.savedAddr} numberOfLines={1}>{rel.address}</Text> : null}
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => {
                      Alert.alert(
                        lang === 'zh' ? '删除' : 'Delete',
                        lang === 'zh' ? `确定删除 ${rel.name} 吗？` : `Delete ${rel.name}?`,
                        [
                          { text: lang === 'zh' ? '取消' : 'Cancel', style: 'cancel' },
                          { text: lang === 'zh' ? '删除' : 'Delete', style: 'destructive', onPress: () => removeRelative(rel.id) },
                        ],
                      );
                    }}
                  >
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </>
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
  toggleRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8, gap: 8 },
  toggleBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 10,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: '#333', borderColor: '#333' },
  toggleBtnText: { fontSize: 14, color: '#666' },
  toggleBtnTextActive: { color: '#fff' },
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
  savedItem: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 8, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  savedName: { fontSize: 18, fontWeight: 'bold', color: '#333', width: 80 },
  savedInfo: { flex: 1, marginLeft: 12 },
  savedTerm: { fontSize: 14, color: '#c41e3a' },
  savedAddr: { fontSize: 12, color: '#999', marginTop: 2 },
  deleteBtn: { padding: 8 },
  deleteBtnText: { fontSize: 16, color: '#ccc' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 15 },
});
