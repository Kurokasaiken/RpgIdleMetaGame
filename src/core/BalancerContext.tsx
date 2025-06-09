/* src/core/BalancerContext.tsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StatDefinitionService } from '@/services/StatDefinitionService';
import { BalanceStorageService, StatSnapshot } from '@/services/BalanceStorageService';
import type { MacroModule, StatState, CardState } from '@/modules/BalancerTab/types';

interface BalancerContextValue {
  stats: Record<string, StatState>;
  setStatValue: (key: string, value: number) => void;
  lockedStats: Set<string>;
  toggleLock: (key: string) => void;
  formulas: Record<string, string>;
  setFormula: (key: string, formula: string) => void;
  dirtyStats: Set<string>;
  modules: Record<string, MacroModule>;
  toggleModuleVisible: (id: string) => void;
  toggleModuleActive: (id: string) => void;
  registerStat: (key: string) => void;
  unregisterStat: (key: string) => void;
  cardStates: Record<string, CardState>;
  toggleCardCollapse: (cardId: string) => void;
  toggleCardActive: (cardId: string) => void;
  saveSnapshot: (name: string) => void;
  loadSnapshot: (name: string) => void;
  deleteSnapshot: (name: string) => void;
  listSnapshotNames: () => string[];
}

const BalancerContext = createContext<BalancerContextValue | undefined>(undefined);

export const useBalancerContext = (): BalancerContextValue => {
  const ctx = useContext(BalancerContext);
  if (!ctx) throw new Error('useBalancerContext deve essere usato dentro <BalancerProvider>');
  return ctx;
};

export const BalancerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Record<string, StatState>>({});
  const [formulas, setFormulas] = useState<Record<string, string>>({});
  const [lockedStats, setLockedStats] = useState<Set<string>>(new Set());
  const [dirtyStats, setDirtyStats] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<Record<string, MacroModule>>({});
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});

  useEffect(() => {
    // inizializza stats e formulas
    const defs = StatDefinitionService.getDefaultStats();
    const initialStats: Record<string, StatState> = {};
    const initialFormulas: Record<string, string> = {};
    Object.entries(defs).forEach(([key, value]) => {
      initialStats[key] = { id: key, name: key, value, formula: '', locked: false, visible: true };
      initialFormulas[key] = '';
    });
    setStats(initialStats);
    setFormulas(initialFormulas);

    // carica moduli
    import('@/core/ModuleRegistry').then(({ ModuleRegistry }) => {
      const all = ModuleRegistry.getAll().reduce((acc, m) => ({ ...acc, [m.id]: m }), {} as any);
      setModules(all);
    });
  }, []);

  const setStatValue = (key: string, value: number) => {
    if (!lockedStats.has(key)) {
      setStats(prev => ({ ...prev, [key]: { ...prev[key], value } }));
      setDirtyStats(ds => new Set(ds).add(key));
    }
  };

  const toggleLock = (key: string) => {
    setLockedStats(prev => {
      const next = new Set(prev);
      prev.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const setFormula = (key: string, formula: string) => {
    setFormulas(prev => ({ ...prev, [key]: formula }));
    setStats(prev => ({ ...prev, [key]: { ...prev[key], formula } }));
    setDirtyStats(ds => new Set(ds).add(key));
  };

  const registerStat = (key: string) => {
    setStats(prev => prev.hasOwnProperty(key) ? prev : { ...prev, [key]: { id: key, name: key, value: 0, formula: '', locked: false, visible: true } });
    setFormulas(prev => prev.hasOwnProperty(key) ? prev : { ...prev, [key]: '' });
  };
  const unregisterStat = (key: string) => {
    setStats(prev => { const { [key]: _, ...rest } = prev; return rest; });
    setFormulas(prev => { const { [key]: _, ...rest } = prev; return rest; });
    setLockedStats(prev => { const next = new Set(prev); next.delete(key); return next; });
  };

  const toggleModuleVisible = (id: string) => {
    setModules(prev => ({ ...prev, [id]: { ...prev[id], isVisible: !prev[id].isVisible } }));
  };
  const toggleModuleActive = (id: string) => {
    setModules(prev => ({ ...prev, [id]: { ...prev[id], isActive: !prev[id].isActive } }));
  };

  const toggleCardCollapse = (cardId: string) => {
    setCardStates(prev => ({ ...prev, [cardId]: { ...prev[cardId], collapsed: !prev[cardId].collapsed } }));
  };
  const toggleCardActive = (cardId: string) => {
    setCardStates(prev => ({ ...prev, [cardId]: { ...prev[cardId], active: !prev[cardId].active } }));
  };

  const saveSnapshot = (name: string) => {
    const payload = { stats, formulas, cardStates };
    BalanceStorageService.saveSnapshot(name, payload, new Set());
  };
  const loadSnapshot = (name: string) => {
    const snap = BalanceStorageService.loadSnapshot(name) as StatSnapshot & { formulas: Record<string,string>; cardStates: Record<string, CardState> };
    if (!snap) return;
    setStats(snap.stats);
    setFormulas(snap.formulas);
    setCardStates(snap.cardStates);
  };
  const deleteSnapshot = (name: string) => {
    BalanceStorageService.deleteSnapshot(name);
  };
  const listSnapshotNames = () => BalanceStorageService.listSnapshotNames();

  return (
    <BalancerContext.Provider value={{ stats, setStatValue, lockedStats, toggleLock, formulas, setFormula, dirtyStats, modules, toggleModuleVisible, toggleModuleActive, registerStat, unregisterStat, cardStates, toggleCardCollapse, toggleCardActive, saveSnapshot, loadSnapshot, deleteSnapshot, listSnapshotNames }}>
      {children}
    </BalancerContext.Provider>
  );
};