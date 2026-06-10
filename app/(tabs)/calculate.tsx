import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Alert, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../src/i18n/LanguageContext';
import { PathTextInput } from '../../src/components/PathTextInput';
import { StepSelector } from '../../src/components/StepSelector';
import { createKinshipEngine } from '../../src/engine';
import { BasicRelation } from '../../src/engine/types';
import { useRelatives } from '../../src/store/RelativesContext';

type InputMode = 'text' | 'select';

const engine = createKinshipEngine();

export default function CalculateScreen() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const { relatives, trashed, removeRelative, restoreRelative, permanentlyDelete } = useRelatives();

  const [showNew, setShowNew] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [calcMode, setCalcMode] = useState<InputMode>('text');
  const [steps, setSteps] = useState<BasicRelation[]>([]);

  const handleTextSubmit = (text: string) => {
    const result = engine.calculate(text);
    setShowNew(false);
    setSteps([]);
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
    setShowNew(false);
    setSteps([]);
    router.push({
      pathname: '/result',
      params: {
        path: JSON.stringify(result.path),
        term: result.term ? JSON.stringify(result.term) : null,
      },
    });
  };

  const handleRelativePress = (rel: typeof relatives[number]) => {
    const termEntry = engine.getAllTerms().find(t => t.term === rel.term);
    router.push({
      pathname: '/result',
      params: {
        term: termEntry ? JSON.stringify(termEntry) : null,
        path: JSON.stringify(rel.path),
        relativeName: rel.name,
        relativeAddress: rel.address || null,
        relativeNotes: rel.notes || null,
      },
    });
  };

  const zh = lang === 'zh';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{zh ? '我的家族图谱' : 'My Family Tree'}</Text>
        <Text style={styles.headerSub}>
          {relatives.length === 0
            ? (zh ? '还没有记录亲戚，点击下方按钮开始' : 'No relatives yet, tap below to start')
            : (zh ? `已记录 ${relatives.length} 位亲戚` : `${relatives.length} relatives saved`)}
        </Text>
      </View>

      {/* Main content: Relative cards */}
      <ScrollView style={styles.cardList} contentContainerStyle={styles.cardListContent}>
        {relatives.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌳</Text>
            <Text style={styles.emptyText}>
              {zh ? '点击下方 + 按钮\n添加你的第一位亲戚' : 'Tap the + button below\nto add your first relative'}
            </Text>
          </View>
        ) : (
          relatives.map(rel => {
            const termEntry = engine.getAllTerms().find(t => t.term === rel.term);
            return (
              <TouchableOpacity
                key={rel.id}
                style={styles.relativeCard}
                onPress={() => handleRelativePress(rel)}
                onLongPress={() => {
                  Alert.alert(
                    rel.name,
                    zh ? '要删除这个亲戚吗？' : 'Delete this relative?',
                    [
                      { text: zh ? '取消' : 'Cancel', style: 'cancel' },
                      {
                        text: zh ? '删除' : 'Delete',
                        style: 'destructive',
                        onPress: () => removeRelative(rel.id),
                      },
                    ],
                  );
                }}
              >
                {rel.photo ? (
                  <Image source={{ uri: rel.photo }} style={styles.cardAvatar} />
                ) : (
                  <View style={styles.cardAvatar}>
                    <Text style={styles.cardAvatarText}>
                      {rel.name.charAt(0)}
                    </Text>
                  </View>
                )}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{rel.name}</Text>
                  <Text style={styles.cardTerm}>{rel.term}</Text>
                  {rel.address ? (
                    <Text style={styles.cardAddr} numberOfLines={1}>📍 {rel.address}</Text>
                  ) : null}
                  {rel.notes ? (
                    <Text style={styles.cardNotes} numberOfLines={1}>📝 {rel.notes}</Text>
                  ) : null}
                </View>
                <Text style={styles.cardArrow}>›</Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.trashBtn}
          onPress={() => setShowTrash(true)}
        >
          <Text style={styles.trashBtnText}>🗑️</Text>
          {trashed.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{trashed.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowNew(true)}
        >
          <Text style={styles.addBtnText}>＋ {zh ? '新建关系' : 'New'}</Text>
        </TouchableOpacity>
      </View>

      {/* ====== NEW RELATIONSHIP MODAL ====== */}
      <Modal visible={showNew} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setShowNew(false); setSteps([]); }}>
              <Text style={styles.modalCancel}>{zh ? '取消' : 'Cancel'}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{zh ? '新建关系' : 'New Relationship'}</Text>
            <View style={{ width: 50 }} />
          </View>

          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[styles.modeBtn, calcMode === 'text' && styles.modeBtnActive]}
              onPress={() => setCalcMode('text')}
            >
              <Text style={[styles.modeBtnText, calcMode === 'text' && styles.modeBtnTextActive]}>
                {t('input_text_mode')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, calcMode === 'select' && styles.modeBtnActive]}
              onPress={() => setCalcMode('select')}
            >
              <Text style={[styles.modeBtnText, calcMode === 'select' && styles.modeBtnTextActive]}>
                {t('input_select_mode')}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} contentContainerStyle={{ padding: 16 }}>
            {calcMode === 'text' ? (
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
        </View>
      </Modal>

      {/* ====== TRASH MODAL ====== */}
      <Modal visible={showTrash} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: 60 }]}>
            <TouchableOpacity onPress={() => setShowTrash(false)} style={styles.closeBtnHit}>
              <Text style={styles.modalCancel}>{zh ? '关闭' : 'Close'}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{zh ? '回收站' : 'Trash'}</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={styles.modalBody} contentContainerStyle={{ padding: 16 }}>
            {trashed.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🗑️</Text>
                <Text style={styles.emptyText}>
                  {zh ? '回收站是空的' : 'Trash is empty'}
                </Text>
              </View>
            ) : (
              trashed.map(rel => (
                <View key={rel.id} style={styles.trashItem}>
                  <View style={styles.trashInfo}>
                    <Text style={styles.trashName}>{rel.name}</Text>
                    <Text style={styles.trashTerm}>{rel.term}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.restoreBtn}
                    onPress={() => restoreRelative(rel.id)}
                  >
                    <Text style={styles.restoreBtnText}>{zh ? '恢复' : 'Restore'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteForeverBtn}
                    onPress={() => {
                      Alert.alert(
                        zh ? '彻底删除' : 'Delete Forever',
                        zh ? `确定彻底删除 ${rel.name} 吗？此操作不可撤销。` : `Permanently delete ${rel.name}? This cannot be undone.`,
                        [
                          { text: zh ? '取消' : 'Cancel', style: 'cancel' },
                          { text: zh ? '彻底删除' : 'Delete Forever', style: 'destructive', onPress: () => permanentlyDelete(rel.id) },
                        ],
                      );
                    }}
                  >
                    <Text style={styles.deleteForeverBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    backgroundColor: '#fff', paddingTop: 8, paddingBottom: 20, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  headerSub: { fontSize: 14, color: '#999', marginTop: 4 },
  cardList: { flex: 1 },
  cardListContent: { padding: 16, paddingBottom: 80 },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 15, color: '#999', textAlign: 'center', lineHeight: 24 },
  relativeCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 12, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardAvatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#c41e3a',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnHit: { paddingVertical: 16, paddingHorizontal: 8 },
  cardAvatarText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  cardInfo: { flex: 1, marginLeft: 14 },
  cardName: { fontSize: 17, fontWeight: '600', color: '#333' },
  cardTerm: { fontSize: 13, color: '#c41e3a', marginTop: 2 },
  cardAddr: { fontSize: 12, color: '#888', marginTop: 2 },
  cardNotes: { fontSize: 12, color: '#aaa', marginTop: 1 },
  cardArrow: { fontSize: 22, color: '#ccc', marginLeft: 8 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  trashBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0f0f0',
    alignItems: 'center', justifyContent: 'center',
  },
  trashBtnText: { fontSize: 20 },
  badge: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: '#ff4444', borderRadius: 10,
    width: 20, height: 20, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 11, color: '#fff', fontWeight: 'bold' },
  addBtn: {
    flex: 1, marginLeft: 12,
    backgroundColor: '#c41e3a', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  // Modal
  modalContainer: { flex: 1, backgroundColor: '#f8f8f8' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  modalCancel: { fontSize: 16, color: '#666' },
  modalTitle: { fontSize: 17, fontWeight: '600', color: '#333' },
  modalBody: { flex: 1 },
  modeRow: { flexDirection: 'row', padding: 16, paddingBottom: 0, gap: 8 },
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
  // Trash items
  trashItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8,
  },
  trashInfo: { flex: 1 },
  trashName: { fontSize: 16, fontWeight: '600', color: '#333' },
  trashTerm: { fontSize: 13, color: '#999', marginTop: 2 },
  restoreBtn: {
    backgroundColor: '#c41e3a', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
  },
  restoreBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  deleteForeverBtn: { padding: 8 },
  deleteForeverBtnText: { fontSize: 16, color: '#ccc' },
});
