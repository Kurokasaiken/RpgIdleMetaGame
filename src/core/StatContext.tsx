// core/StatContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StatDefinitionService } from '@/services/StatDefinitionService';
import { BalanceStorageService } from '@/services/BalanceStorageService';

interface StatContextValue {
  stats: Record<string, number>;
  setStat: (key: string, value: number) => void;
  locked: Set<string>;
  toggleLock: (key: string) => void;
  registerStat: (key: string) => void;
  unregisterStat: (key: string) => void;
  listSnapshotNames: () => string[];
}

const StatContext = createContext<StatContextValue | undefined>(undefined);
const listSnapshotNames = () => BalanceStorageService.listSnapshotNames();

export const useStatContext = (): StatContextValue => {
  const ctx = useContext(StatContext);
  if (!ctx) {
    throw new Error('useStatContext deve essere usato dentro <StatProvider>');
  }
  return ctx;
};

export const StatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [locked, setLocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const defaults = StatDefinitionService.getDefaultStats();
    setStats(defaults);
  }, []);

  const setStat = (key: string, value: number) => {
    if (!locked.has(key)) {
      setStats((prev) => ({ ...prev, [key]: value }));
    }
  };

function toggleLock(statId: string) {
  setLocked((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(statId)) newSet.delete(statId);
    else newSet.add(statId);
    return newSet;
  });
}

const registerStat = (key: string) => {
  setStats(prev => {
    if (prev.hasOwnProperty(key)) return prev;
    return { ...prev, [key]: 0 };
  });
};


  const unregisterStat = (key: string) => {
    setStats((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
    setLocked((prev) => {
      const updated = new Set(prev);
      updated.delete(key);
      return updated;
    });
  };

  return (
  <StatContext.Provider value={{
    stats,
    setStat,
    locked,
    toggleLock,
    registerStat,
    unregisterStat,
    listSnapshotNames
    // etc.
  }}>
    {children}
  </StatContext.Provider>
  );
};
