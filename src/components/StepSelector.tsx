import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { BasicRelation } from '../engine/types';
import { useLanguage } from '../i18n/LanguageContext';

const STEP_OPTIONS: BasicRelation[] = [
  'father', 'mother',
  'older_brother', 'younger_brother', 'older_sister', 'younger_sister',
  'husband', 'wife',
  'son', 'daughter',
];

interface Props {
  steps: BasicRelation[];
  onAdd: (rel: BasicRelation) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
}

export function StepSelector({ steps, onAdd, onRemove, onClear }: Props) {
  const { t, lang } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.pathRow}>
        <View style={styles.pathChip}>
          <Text style={styles.pathText}>{t('step_me')}</Text>
        </View>
        {steps.map((step, i) => (
          <View key={i} style={styles.stepGroup}>
            <Text style={styles.arrow}>的</Text>
            <TouchableOpacity onPress={() => onRemove(i)}>
              <View style={[styles.pathChip, styles.pathChipActive]}>
                <Text style={styles.pathTextActive}>
                  {lang === 'zh' ? getLabelZh(step) : getLabelEn(step)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.label}>{t('btn_add_step')}:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsRow}>
        {STEP_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={styles.optionBtn}
            onPress={() => onAdd(opt)}
          >
            <Text style={styles.optionText}>
              {lang === 'zh' ? getLabelZh(opt) : getLabelEn(opt)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {steps.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
          <Text style={styles.clearBtnText}>{t('btn_clear')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function getLabelZh(r: BasicRelation): string {
  const map: Record<BasicRelation, string> = {
    father: '爸爸', mother: '妈妈',
    older_brother: '哥哥', younger_brother: '弟弟',
    older_sister: '姐姐', younger_sister: '妹妹',
    husband: '丈夫', wife: '妻子',
    son: '儿子', daughter: '女儿',
  };
  return map[r];
}

function getLabelEn(r: BasicRelation): string {
  const map: Record<BasicRelation, string> = {
    father: 'Father', mother: 'Mother',
    older_brother: 'Older Bro', younger_brother: 'Younger Bro',
    older_sister: 'Older Sis', younger_sister: 'Younger Sis',
    husband: 'Husband', wife: 'Wife',
    son: 'Son', daughter: 'Daughter',
  };
  return map[r];
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  pathRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  stepGroup: { flexDirection: 'row', alignItems: 'center' },
  pathChip: {
    backgroundColor: '#f0f0f0', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, marginVertical: 4,
  },
  pathChipActive: { backgroundColor: '#c41e3a' },
  pathText: { fontSize: 15, color: '#333' },
  pathTextActive: { fontSize: 15, color: '#fff' },
  arrow: { marginHorizontal: 4, fontSize: 14, color: '#999' },
  label: { fontSize: 14, color: '#666', marginTop: 16, marginBottom: 8 },
  optionsRow: { flexDirection: 'row', marginBottom: 8 },
  optionBtn: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#c41e3a',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    marginRight: 8,
  },
  optionText: { fontSize: 14, color: '#c41e3a' },
  clearBtn: { alignSelf: 'flex-start', marginTop: 8 },
  clearBtnText: { fontSize: 13, color: '#999' },
});
