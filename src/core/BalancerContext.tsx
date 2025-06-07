/* src/core/BalancerContext.tsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StatDefinitionService } from '@/services/StatDefinitionService';
import { BalanceStorageService } from '@/services/BalanceStorageService';
import type { MacroModule } from '@/modules/BalancerTab/types';

interface BalancerContextValue {
  stats: Record<string, number>;
  setStat: (key: string, value: number) => void;
  lockedStats: Set<string>;
  toggleLock: (key: string) => void;
  modules: Record<string, MacroModule>;
  toggleModuleVisible: (id: string) => void;
  toggleModuleActive: (id: string) => void;
  registerStat: (key: string) => void;
  unregisterStat: (key: string) => void;
  listSnapshotNames: () => string[];
}

const BalancerContext = createContext<BalancerContextValue | undefined>(undefined);

export const useBalancerContext = (): BalancerContextValue => {
  const ctx = useContext(BalancerContext);
  if (!ctx) throw new Error('useBalancerContext deve essere usato dentro <BalancerProvider>');
  return ctx;
};

export const BalancerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [lockedStats, setLockedStats] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<Record<string, MacroModule>>({});

  useEffect(() => {
    setStats(StatDefinitionService.getDefaultStats());
    // carica moduli da ModuleRegistry
    import('@/core/ModuleRegistry').then(({ ModuleRegistry }) => {
      const all = ModuleRegistry.getAll().reduce((acc, m) => ({ ...acc, [m.id]: m }), {} as any);
      setModules(all);
    });
  }, []);

  const setStat = (key: string, value: number) => {
    if (!lockedStats.has(key)) setStats(prev => ({ ...prev, [key]: value }));
  };

  const toggleLock = (key: string) => {
    setLockedStats(prev => {
      const next = new Set(prev);
      prev.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleModuleVisible = (id: string) => {
    setModules(prev => ({
      ...prev,
      [id]: { ...prev[id], isVisible: !prev[id].isVisible }
    }));
  };

  const toggleModuleActive = (id: string) => {
    setModules(prev => ({
      ...prev,
      [id]: { ...prev[id], isActive: !prev[id].isActive }
    }));
  };  const registerStat = (key: string) => { /* ... */ };


  const unregisterStat = (key: string) => { /* ... */ };
  const listSnapshotNames = () => BalanceStorageService.listSnapshotNames();

  return (
    <BalancerContext.Provider
      value={{ stats, setStat, lockedStats, toggleLock, modules, toggleModuleVisible, toggleModuleActive, registerStat, unregisterStat, listSnapshotNames }}>
      {children}
    </BalancerContext.Provider>
  );
};
