import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KinshipTerm } from '../engine/types';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  term: KinshipTerm;
}

export function TermCard({ term }: Props) {
  const { lang } = useLanguage();

  return (
    <View style={styles.card}>
      <Text style={styles.term}>{term.term}</Text>
      <Text style={styles.pinyin}>{term.pinyin}</Text>
      <View style={styles.divider} />
      <Text style={styles.explanation}>
        {lang === 'zh' ? term.explanationZh : term.explanationEn}
      </Text>
      {term.tags.length > 0 && (
        <View style={styles.tags}>
          {term.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 24, marginVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
    alignItems: 'center',
  },
  term: { fontSize: 36, fontWeight: 'bold', color: '#c41e3a' },
  pinyin: { fontSize: 16, color: '#888', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#eee', alignSelf: 'stretch', marginVertical: 16 },
  explanation: { fontSize: 15, color: '#333', textAlign: 'center', lineHeight: 22 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, justifyContent: 'center' },
  tag: {
    backgroundColor: '#f5f5f5', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 4, margin: 3,
  },
  tagText: { fontSize: 12, color: '#888' },
});
