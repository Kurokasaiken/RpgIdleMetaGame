/* src/core/BalancerContext.tsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StatDefinitionService } from '@/services/StatDefinitionService';
import { BalanceStorageService, StatSnapshot } from '@/services/BalanceStorageService';
import type { MacroModule, StatState, CardState } from '@/modules/BalancerTab/types';

interface BalancerContextValue {
  stats: Record<string, StatState>;
  setStat: (key: string, value: number) => void;
  lockedStats: Set<string>;
  toggleLock: (key: string) => void;
  formulas: Record<string, string>;
  setFormula: (key: string, formula: string) => void;
  dirtyStats: Set<string>;
  modules: Record<string, MacroModule>;
  saveSnapshot: (name: string) => void;
  loadSnapshot: (name: string) => void;
  deleteSnapshot: (name: string) => void;
  listSnapshotNames: () => string[];
  cardStates: Record<string, CardState>;
  setCardStates: React.Dispatch<React.SetStateAction<Record<string, CardState>>>;
  addCard: (parentId?: string) => void;
  toggleCardCollapse: (cardId: string) => void;
  toggleCardActive: (cardId: string) => void;
  undoCard: (cardId: string) => void;
  redoCard: (cardId: string) => void;
}

const BalancerContext = createContext<BalancerContextValue | undefined>(undefined);
export const useBalancerContext = () => {
  const ctx = useContext(BalancerContext);
  if (!ctx) throw new Error('useBalancerContext must be used within BalancerProvider');
  return ctx;
};

export const BalancerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Record<string, StatState>>({});
  const [formulas, setFormulas] = useState<Record<string, string>>({});
  const [lockedStats, setLockedStats] = useState<Set<string>>(new Set());
  const [dirtyStats, setDirtyStats] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<Record<string, MacroModule>>({});
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [history, setHistory] = useState<Record<string, { past: CardState[]; future: CardState[] }>>({});

  useEffect(() => {
    const defs = StatDefinitionService.getDefaultStats();
    const initStats: Record<string, StatState> = {};
    const initFormulas: Record<string, string> = {};
    Object.entries(defs).forEach(([key, value]) => {
      initStats[key] = { id: key, name: key, value, formula: '', locked: false, visible: true };
      initFormulas[key] = '';
    });
    setStats(initStats);
    setFormulas(initFormulas);
    import('@/core/ModuleRegistry').then(({ ModuleRegistry }) => {
      const all = ModuleRegistry.getAll().reduce((acc, m) => ({ ...acc, [m.id]: m }), {} as any);
      setModules(all);
    });
  }, []);

  const setStat = (key: string, value: number) => {
    if (!lockedStats.has(key)) {
      setStats(prev => ({ ...prev, [key]: { ...prev[key], value } }));
      setDirtyStats(prev => new Set(prev).add(key));
    }
  };
  const toggleLock = (key: string) => {
    setLockedStats(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };
  const setFormula = (key: string, formula: string) => {
    setFormulas(prev => ({ ...prev, [key]: formula }));
    setStats(prev => ({ ...prev, [key]: { ...prev[key], formula } }));
    setDirtyStats(prev => new Set(prev).add(key));
  };

  const saveSnapshot = (name: string) => {
    BalanceStorageService.saveSnapshot(name, { stats, formulas, cardStates }, lockedStats);
  };
  const loadSnapshot = (name: string) => {
    const snap = BalanceStorageService.loadSnapshot(name) as StatSnapshot & {
      formulas: Record<string, string>;
      cardStates: Record<string, CardState>;
    };
    if (snap) {
      setStats(snap.stats);
      setFormulas(snap.formulas || {});
      setCardStates(snap.cardStates || {});
    }
  };
  const deleteSnapshot = (name: string) => {
    BalanceStorageService.deleteSnapshot(name);
  };
  const listSnapshotNames = () => BalanceStorageService.listSnapshotNames();

  const addCard = (parentId?: string) => {
    const id = `card-${Date.now()}`;
    setCardStates(prev => ({
      ...prev,
      [id]: { id, name: 'New Card', icon: '⚔️', collapsed: false, active: true, stats: [], subCards: [] },
      ...(parentId ? { [parentId]: { ...prev[parentId], subCards: [...prev[parentId].subCards, id] } } : {})
    }));
    setHistory(prev => ({ ...prev, [id]: { past: [], future: [] } }));
  };
  const toggleCardCollapse = (cardId: string) => {
    setCardStates(prev => ({ ...prev, [cardId]: { ...prev[cardId], collapsed: !prev[cardId].collapsed } }));
  };
  const toggleCardActive = (cardId: string) => {
    setCardStates(prev => ({ ...prev, [cardId]: { ...prev[cardId], active: !prev[cardId].active } }));
  };
  const undoCard = (cardId: string) => {
    const record = history[cardId] || { past: [], future: [] };
    if (record.past.length > 0) {
      const prevState = record.past[record.past.length - 1];
      setHistory(h => ({ ...h, [cardId]: { past: record.past.slice(0, -1), future: [cardStates[cardId], ...record.future] } }));
      setCardStates(cs => ({ ...cs, [cardId]: prevState }));
    }
  };
  const redoCard = (cardId: string) => {
    const record = history[cardId] || { past: [], future: [] };
    if (record.future.length > 0) {
      const nextState = record.future[0];
      setHistory(h => ({ ...h, [cardId]: { past: [...record.past, cardStates[cardId]], future: record.future.slice(1) } }));
      setCardStates(cs => ({ ...cs, [cardId]: nextState }));
    }
  };

const setStatValue = (key: string, value: number) => {
  if (!lockedStats.has(key)) {
    setStats(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
    setDirtyStats(prev => new Set(prev).add(key));
  }
};

  return (
    <BalancerContext.Provider
      value={{
        stats,
        setStat: setStatValue,
        lockedStats,
        toggleLock,
        formulas,
        setFormula,
        dirtyStats,
        modules,
        saveSnapshot,
        loadSnapshot,
        deleteSnapshot,
        listSnapshotNames,
        cardStates,
        setCardStates,
        addCard,
        toggleCardCollapse,
        toggleCardActive,
        undoCard,
        redoCard
      }}
    >
      {children}
    </BalancerContext.Provider>
  );
};
