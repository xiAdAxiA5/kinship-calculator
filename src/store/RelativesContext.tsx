import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BasicRelation } from '../engine/types';

export interface NamedRelative {
  id: string;
  name: string;
  term: string;
  path: BasicRelation[];
  photo?: string;
  address?: string;
  notes?: string;
  savedAt: number;
  deletedAt?: number; // soft delete: when deleted (timestamp), null means active
}

interface RelativesContextType {
  relatives: NamedRelative[];
  trashed: NamedRelative[];
  addRelative: (r: Omit<NamedRelative, 'id' | 'savedAt' | 'deletedAt'>) => void;
  removeRelative: (id: string) => void;
  restoreRelative: (id: string) => void;
  permanentlyDelete: (id: string) => void;
}

const RelativesContext = createContext<RelativesContextType>({
  relatives: [],
  trashed: [],
  addRelative: () => {},
  removeRelative: () => {},
  restoreRelative: () => {},
  permanentlyDelete: () => {},
});

const STORAGE_KEY = '@kinship/named_relatives';

export function RelativesProvider({ children }: { children: React.ReactNode }) {
  const [allItems, setAllItems] = useState<NamedRelative[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data: string | null) => {
      if (data) {
        try { setAllItems(JSON.parse(data)); } catch {}
      }
    });
  }, []);

  const save = useCallback((items: NamedRelative[]) => {
    setAllItems(items);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const relatives = allItems.filter(r => !r.deletedAt);
  const trashed = allItems.filter(r => r.deletedAt).sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));

  const addRelative = useCallback((r: Omit<NamedRelative, 'id' | 'savedAt' | 'deletedAt'>) => {
    const item: NamedRelative = {
      ...r,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      savedAt: Date.now(),
    };
    setAllItems(prev => {
      const updated = [...prev, item];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeRelative = useCallback((id: string) => {
    setAllItems(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, deletedAt: Date.now() } : r);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const restoreRelative = useCallback((id: string) => {
    setAllItems(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, deletedAt: undefined } : r);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const permanentlyDelete = useCallback((id: string) => {
    setAllItems(prev => {
      const updated = prev.filter(r => r.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <RelativesContext.Provider value={{ relatives, trashed, addRelative, removeRelative, restoreRelative, permanentlyDelete }}>
      {children}
    </RelativesContext.Provider>
  );
}

export function useRelatives(): RelativesContextType {
  return useContext(RelativesContext);
}
