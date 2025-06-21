import React, { createContext, useContext, useState, useEffect } from 'react';
import { StatDefinitionService } from '@/services/StatDefinitionService';
import { BalanceStorageService, StatSnapshot } from '@/services/BalanceStorageService';
import type { MacroModule, StatState, CardState } from '@/modules/BalancerModule/types';

interface BalancerContextValue {
  stats: Record<string, StatState>;
  setStat: (key: string, value: number) => void;
  lockedStats: Set<string>;
  toggleLock: (key: string) => void;
  formulas: Record<string, string>;
  setFormula: (key: string, formula: string) => void;
  dirtyStats: Set<string>;
  modules: Record<string, MacroModule>;
  toggleModuleVisible: (moduleId: string) => void; // Added
  toggleModuleActive: (moduleId: string) => void;  // Added
  saveSnapshot: (name: string) => void;
  loadSnapshot: (name: string) => void;
  deleteSnapshot: (name: string) => void;
  listSnapshotNames: () => string[];
  cardStates: Record<string, CardState>;
  setCardStates: React.Dispatch<React.SetStateAction<Record<string, CardState>>>;
  addCard: (parentId?: string) => void;
  toggleCardCollapse: (cardId: string) => void;
  toggleCardActive: (cardId: string) => void;
}

const BalancerContext = createContext<BalancerContextValue | undefined>(undefined);
export const useBalancerContext = () => {
  const ctx = useContext(BalancerContext);
  if (!ctx) throw new Error('useBalancerContext must be used within BalancerProvider');
  return ctx;
};

export const useRegisteredModules = () => {
  const { modules } = useBalancerContext();
  return Object.values(modules);
};

export const BalancerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Record<string, StatState>>({});
  const [formulas, setFormulas] = useState<Record<string, string>>({});
  const [lockedStats, setLockedStats] = useState<Set<string>>(new Set());
  const [dirtyStats, setDirtyStats] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<Record<string, MacroModule>>({});
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});

  useEffect(() => {
    const defs = StatDefinitionService.getDefaultStats();
    const initStats: Record<string, StatState> = {};
    Object.entries(defs).forEach(([key, value]) => {
      initStats[key] = { id: key, name: key, value, formula: '', locked: false, visible: true, constant: null };
    });
    setStats(initStats);
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

const toggleModuleVisible = (moduleId: string) => {
  setModules(prev => {
    const m = prev[moduleId];
    if (!m) return prev;
    return {
      ...prev,
      [moduleId]: { ...m, isVisible: !m.isVisible },
    };
  });
};

const toggleModuleActive = (moduleId: string) => {
  setModules(prev => {
    const m = prev[moduleId];
    if (!m) return prev;
    return {
      ...prev,
      [moduleId]: { ...m, isActive: !m.isActive },
    };
  });
};

  const saveSnapshot = (name: string) => {
    BalanceStorageService.saveSnapshot(name, {
      stats,
      formulas,
      cardStates,
    }, lockedStats);
  };

  const loadSnapshot = (name: string) => {
    const snap = BalanceStorageService.loadSnapshot(name);
    if (snap) {
      setStats(snap.stats);
      setFormulas(snap.formulas || {});
      setCardStates(snap.cardStates || {});
      setLockedStats(new Set(snap.locked || []));
    }
  };

  const deleteSnapshot = (name: string) => {
    BalanceStorageService.deleteSnapshot(name);
  };

  const listSnapshotNames = () => BalanceStorageService.listSnapshotNames();

  const addCard = (parentId?: string) => {
    const id = `card-${Date.now()}`;
    setCardStates(prev => {
      const newCard: CardState = {
        id,
        name: 'Nuova Card',
        icon: '🧩',
        collapsed: false,
        active: true,
        stats: [],
        color: 'bg-gray-500',
        subCards: [],
      };
      const updated = { ...prev, [id]: newCard };
      if (parentId && prev[parentId]) {
        updated[parentId] = {
          ...prev[parentId],
          subCards: [...prev[parentId].subCards, id],
        };
      }
      return updated;
    });
  };

  const toggleCardCollapse = (cardId: string) => {
    setCardStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        collapsed: !prev[cardId].collapsed,
      },
    }));
  };

  const toggleCardActive = (cardId: string) => {
    setCardStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        active: !prev[cardId].active,
      },
    }));
  };

  return (
    <BalancerContext.Provider
      value={{
        stats,
        setStat,
        lockedStats,
        toggleLock,
        formulas,
        setFormula,
        dirtyStats,
        modules,
        toggleModuleVisible, // Added
        toggleModuleActive,  // Added
        saveSnapshot,
        loadSnapshot,
        deleteSnapshot,
        listSnapshotNames,
        cardStates,
        setCardStates,
        addCard,
        toggleCardCollapse,
        toggleCardActive,
      }}
    >
      {children}
    </BalancerContext.Provider>
  );
};