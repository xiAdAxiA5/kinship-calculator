import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../src/i18n/LanguageContext';
import { PathTextInput } from '../../src/components/PathTextInput';
import { StepSelector } from '../../src/components/StepSelector';
import { createKinshipEngine } from '../../src/engine';
import { BasicRelation } from '../../src/engine/types';

type InputMode = 'text' | 'select';

const engine = createKinshipEngine();

export default function CalculateScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>('text');
  const [steps, setSteps] = useState<BasicRelation[]>([]);

  const handleTextSubmit = (text: string) => {
    const result = engine.calculate(text);
    router.push({
      pathname: '/result',
      params: {
        path: JSON.stringify(result.path),
        term: result.term ? JSON.stringify(result.term) : null,
        error: result.error || null,
      },
    });
  };

  const handleStepSubmit = () => {
    if (steps.length === 0) return;
    const result = engine.calculateFromSteps(steps);
    router.push({
      pathname: '/result',
      params: {
        path: JSON.stringify(result.path),
        term: result.term ? JSON.stringify(result.term) : null,
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'text' && styles.modeBtnActive]}
          onPress={() => setMode('text')}
        >
          <Text style={[styles.modeBtnText, mode === 'text' && styles.modeBtnTextActive]}>
            {t('input_text_mode')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'select' && styles.modeBtnActive]}
          onPress={() => setMode('select')}
        >
          <Text style={[styles.modeBtnText, mode === 'select' && styles.modeBtnTextActive]}>
            {t('input_select_mode')}
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'text' ? (
        <PathTextInput onSubmit={handleTextSubmit} />
      ) : (
        <View>
          <StepSelector
            steps={steps}
            onAdd={(rel) => setSteps([...steps, rel])}
            onRemove={(i) => setSteps(steps.filter((_, idx) => idx !== i))}
            onClear={() => setSteps([])}
          />
          <TouchableOpacity
            style={[styles.submitBtn, steps.length === 0 && styles.submitBtnDisabled]}
            onPress={handleStepSubmit}
            disabled={steps.length === 0}
          >
            <Text style={styles.submitBtnText}>{t('btn_calculate')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  content: { padding: 16 },
  modeRow: { flexDirection: 'row', marginBottom: 20, gap: 8 },
  modeBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: '#c41e3a', borderColor: '#c41e3a' },
  modeBtnText: { fontSize: 15, color: '#666' },
  modeBtnTextActive: { color: '#fff' },
  submitBtn: {
    backgroundColor: '#c41e3a', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 12,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
