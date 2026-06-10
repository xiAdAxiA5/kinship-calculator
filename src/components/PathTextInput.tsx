import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onSubmit: (text: string) => void;
}

export function PathTextInput({ onSubmit }: Props) {
  const { t } = useLanguage();
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={t('input_placeholder')}
        placeholderTextColor="#aaa"
        multiline={false}
        returnKeyType="search"
        onSubmitEditing={() => text.trim() && onSubmit(text.trim())}
      />
      <TouchableOpacity
        style={[styles.btn, !text.trim() && styles.btnDisabled]}
        onPress={() => text.trim() && onSubmit(text.trim())}
        disabled={!text.trim()}
      >
        <Text style={styles.btnText}>{t('btn_calculate')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 16,
    backgroundColor: '#fff', marginBottom: 12,
  },
  btn: {
    backgroundColor: '#c41e3a', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
