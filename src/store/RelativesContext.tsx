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
}

interface RelativesContextType {
  relatives: NamedRelative[];
  addRelative: (r: Omit<NamedRelative, 'id' | 'savedAt'>) => void;
  removeRelative: (id: string) => void;
}

const RelativesContext = createContext<RelativesContextType>({
  relatives: [],
  addRelative: () => {},
  removeRelative: () => {},
});

const STORAGE_KEY = '@kinship/named_relatives';

export function RelativesProvider({ children }: { children: React.ReactNode }) {
  const [relatives, setRelatives] = useState<NamedRelative[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data: string | null) => {
      if (data) {
        try { setRelatives(JSON.parse(data)); } catch {}
      }
    });
  }, []);

  const persist = useCallback((updated: NamedRelative[]) => {
    setRelatives(updated);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addRelative = useCallback((r: Omit<NamedRelative, 'id' | 'savedAt'>) => {
    setRelatives(prev => {
      const updated = [...prev, {
        ...r,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        savedAt: Date.now(),
      }];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeRelative = useCallback((id: string) => {
    setRelatives(prev => {
      const updated = prev.filter(r => r.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <RelativesContext.Provider value={{ relatives, addRelative, removeRelative }}>
      {children}
    </RelativesContext.Provider>
  );
}

export function useRelatives(): RelativesContextType {
  return useContext(RelativesContext);
}
