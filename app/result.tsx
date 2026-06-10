import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../src/i18n/LanguageContext';
import { TermCard } from '../src/components/TermCard';
import { FamilyTreeView } from '../src/components/FamilyTreeView';
import { KinshipTerm, BasicRelation } from '../src/engine/types';
import { createKinshipEngine } from '../src/engine';
import { useRelatives } from '../src/store/RelativesContext';

const engine = createKinshipEngine();

export default function ResultScreen() {
  const { t, lang } = useLanguage();
  const { addRelative } = useRelatives();
  const params = useLocalSearchParams<{
    term: string; path: string; error: string;
    relativeName: string; relativePhoto: string;
    relativeAddress: string; relativeNotes: string;
  }>();

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveAddress, setSaveAddress] = useState('');
  const [saveNotes, setSaveNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const term: KinshipTerm | null = useMemo(() => {
    if (!params.term || params.term === 'null') return null;
    try { return JSON.parse(params.term); } catch { return null; }
  }, [params.term]);

  const path: BasicRelation[] = useMemo(() => {
    if (!params.path) return [];
    try { return JSON.parse(params.path); } catch { return []; }
  }, [params.path]);

  const isSavedView = !!params.relativeName;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      return result.assets[0].uri;
    }
    return null;
  };

  const handleSave = () => {
    if (!saveName.trim()) return;
    addRelative({
      name: saveName.trim(),
      term: term?.term ?? '',
      path,
      photo: photoUri || undefined,
      address: saveAddress.trim(),
      notes: saveNotes.trim(),
    });
    setSaveModalVisible(false);
    setSaveName('');
    setSaveAddress('');
    setSaveNotes('');
    setPhotoUri(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {isSavedView && (
        <View style={styles.savedHeader}>
          {params.relativePhoto ? (
            <Image source={{ uri: params.relativePhoto }} style={styles.savedPhoto} />
          ) : (
            <View style={[styles.savedPhoto, styles.savedPhotoPlaceholder]}>
              <Text style={styles.savedPhotoPlaceholderText}>{params.relativeName?.charAt(0)}</Text>
            </View>
          )}
          <Text style={styles.savedName}>{params.relativeName}</Text>
          {params.relativeAddress ? (
            <Text style={styles.savedAddress}>📍 {params.relativeAddress}</Text>
          ) : null}
          {params.relativeNotes ? (
            <Text style={styles.savedNotes}>📝 {params.relativeNotes}</Text>
          ) : null}
        </View>
      )}

      {params.error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{params.error}</Text>
        </View>
      ) : null}

      {term ? (
        <>
          <TermCard term={term} />

          {path.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('result_path')}</Text>
              <View style={styles.pathBox}>
                <Text style={styles.pathLabel}>
                  {t('label_me')}
                  {path.map((step, i) => (
                    <Text key={i} style={styles.pathStep}>
                      {' 的 '}{engine.getBasicRelations().find(b => b.key === step)?.labelZh ?? step}
                    </Text>
                  ))}
                </Text>
              </View>
              <Text style={styles.pathResult}>= {term.term}</Text>
            </View>
          )}

          {path.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('result_tree')}</Text>
              <FamilyTreeView
                path={path}
                targetName={isSavedView ? params.relativeName : undefined}
              />
            </View>
          )}

          {!isSavedView && (
            <TouchableOpacity style={styles.saveBtn} onPress={() => setSaveModalVisible(true)}>
              <Text style={styles.saveBtnText}>{t('result_save')}</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={styles.noResult}>
          <Text style={styles.noResultText}>{t('result_no_match')}</Text>
        </View>
      )}

      {/* Save Modal with Photo Upload */}
      <Modal visible={saveModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.modalTitle}>{t('save_dialog_title')}</Text>

            {/* Photo */}
            <Text style={styles.modalLabel}>{lang === 'zh' ? '照片' : 'Photo'}</Text>
            <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoPlaceholderIcon}>📷</Text>
                  <Text style={styles.photoPlaceholderText}>
                    {lang === 'zh' ? '点击选择照片' : 'Tap to add photo'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {photoUri && (
              <TouchableOpacity onPress={() => setPhotoUri(null)}>
                <Text style={styles.removePhoto}>
                  {lang === 'zh' ? '移除照片' : 'Remove photo'}
                </Text>
              </TouchableOpacity>
            )}

            <Text style={styles.modalLabel}>{t('save_dialog_name')}</Text>
            <TextInput
              style={styles.modalInput}
              value={saveName}
              onChangeText={setSaveName}
              placeholder={t('save_dialog_placeholder')}
              placeholderTextColor="#aaa"
            />

            <Text style={styles.modalLabel}>{lang === 'zh' ? '地址' : 'Address'}</Text>
            <TextInput
              style={styles.modalInput}
              value={saveAddress}
              onChangeText={setSaveAddress}
              placeholder={lang === 'zh' ? '例如：北京市朝阳区' : 'e.g. Beijing, China'}
              placeholderTextColor="#aaa"
            />

            <Text style={styles.modalLabel}>{lang === 'zh' ? '备注' : 'Notes'}</Text>
            <TextInput
              style={[styles.modalInput, styles.modalInputMultiline]}
              value={saveNotes}
              onChangeText={setSaveNotes}
              placeholder={lang === 'zh' ? '例如：每年过年都会见到' : 'e.g. See them every New Year'}
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => {
                setSaveModalVisible(false);
                setPhotoUri(null);
              }}>
                <Text style={styles.modalCancelBtnText}>{t('save_dialog_cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, !saveName.trim() && styles.btnDisabled]}
                onPress={handleSave}
                disabled={!saveName.trim()}
              >
                <Text style={styles.modalSaveBtnText}>{t('save_dialog_save')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  content: { padding: 16, paddingBottom: 40 },
  savedHeader: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 12, alignItems: 'center',
  },
  savedPhoto: {
    width: 80, height: 80, borderRadius: 40, marginBottom: 10,
  },
  savedPhotoPlaceholder: {
    backgroundColor: '#c41e3a', alignItems: 'center', justifyContent: 'center',
  },
  savedPhotoPlaceholderText: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  savedName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  savedAddress: { fontSize: 14, color: '#666', marginTop: 4 },
  savedNotes: { fontSize: 13, color: '#888', marginTop: 4, fontStyle: 'italic' },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: '#333', marginBottom: 10 },
  pathBox: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center',
  },
  pathLabel: { fontSize: 16, color: '#333' },
  pathStep: { fontSize: 16, color: '#c41e3a' },
  pathResult: { fontSize: 18, fontWeight: 'bold', color: '#c41e3a', marginTop: 12, textAlign: 'center' },
  errorBox: {
    backgroundColor: '#fff3cd', borderRadius: 12, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#ffc107',
  },
  errorText: { fontSize: 14, color: '#856404' },
  saveBtn: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#c41e3a',
    paddingVertical: 14, alignItems: 'center', marginTop: 20,
  },
  saveBtnText: { color: '#c41e3a', fontSize: 16, fontWeight: '600' },
  noResult: { alignItems: 'center', paddingTop: 60 },
  noResultText: { fontSize: 16, color: '#999' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, maxHeight: '90%',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16, textAlign: 'center' },
  modalLabel: { fontSize: 14, color: '#666', marginBottom: 6, marginTop: 12 },
  modalInput: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 15,
  },
  modalInputMultiline: { minHeight: 72, textAlignVertical: 'top' },
  // Photo
  photoBtn: { alignItems: 'center', marginBottom: 8 },
  photoPreview: { width: 120, height: 120, borderRadius: 60 },
  photoPlaceholder: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed',
  },
  photoPlaceholderIcon: { fontSize: 32 },
  photoPlaceholderText: { fontSize: 12, color: '#999', marginTop: 4 },
  removePhoto: { fontSize: 13, color: '#e74c3c', textAlign: 'center', marginBottom: 8 },
  modalButtons: { flexDirection: 'row', marginTop: 24, gap: 12 },
  modalCancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#f0f0f0', alignItems: 'center',
  },
  modalCancelBtnText: { fontSize: 16, color: '#666' },
  modalSaveBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#c41e3a', alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  modalSaveBtnText: { fontSize: 16, color: '#fff', fontWeight: '600' },
});
