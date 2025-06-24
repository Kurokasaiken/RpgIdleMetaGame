import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { StatDefinitionService } from '@/services/StatDefinitionService';
import { BalanceStorageService, StatSnapshot } from '@/services/BalanceStorageService';
import { MacroModule, StatState, CardState } from '@/modules/BalancerModule/types';
import { RecalculationEngine } from '@/core/RecalculationEngine';
import { ModuleRegistry } from '@/core/ModuleRegistry';
import { ASTParserAdapter } from '@/utils/ASTParserAdapter';

type EnhancedStatState = StatState & {
  dirty: boolean;
  active: boolean;
  visible: boolean;
  lastRecalcTime?: number;
};

interface BalancerContextValue {
  stats: Record<string, EnhancedStatState>;
  setStat: (key: string, value: number) => void;
  updateStat: (key: string, stat: EnhancedStatState) => void;
  lockedStats: Set<string>;
  toggleLock: (key: string) => void;
  formulas: Record<string, string>;
  setFormula: (key: string, formula: string) => void;
  dirtyStats: Set<string>;
  modules: Record<string, MacroModule>;
  toggleModuleVisible: (id: string) => void;
  toggleModuleActive: (id: string) => void;
  saveSnapshot: (name: string) => void;
  loadSnapshot: (name: string) => void;
  listSnapshotNames: () => string[];
  deleteSnapshot: (name: string) => void;
  cardStates: Record<string, CardState>;
  setCardStates: React.Dispatch<React.SetStateAction<Record<string, CardState>>>;
  addCard: (parentId?: string) => void;
  toggleCardCollapse: (cardId: string) => void;
  toggleCardActive: (cardId: string) => void;
  isInitialized: boolean;
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


export const BalancerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Record<string, EnhancedStatState>>({});
  const [formulas, setFormulas] = useState<Record<string, string>>({});
  const [lockedStats, setLockedStats] = useState<Set<string>>(new Set());
  const [dirtyStats, setDirtyStats] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<Record<string, MacroModule>>({});
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  const recalcEngineRef = useRef<RecalculationEngine | null>(null);

  // init RecalculationEngine once
useEffect(() => {
  recalcEngineRef.current = new RecalculationEngine(ASTParserAdapter);
  return () => { recalcEngineRef.current = null; };
}, []);
  // bootstrap stats, modules & cards
  useEffect(() => {
    // default stats
    const defs = StatDefinitionService.getDefaultStats();
    const init: Record<string, EnhancedStatState> = {};
    Object.entries(defs).forEach(([k, v]) => {
      init[k] = { id: k, name: k, value: v, formula: '', locked: false, tooltip: undefined, constant: null, dirty: false, active: true, visible: true };
    });
    setStats(init);

    // modules
    const all = ModuleRegistry.getAll().reduce((acc, m) => ((acc[m.id] = m), acc), {} as Record<string, MacroModule>);
    setModules(all);

    // cards from last snapshot or default
    const names = BalanceStorageService.listSnapshotNames();
    if (names.length) loadSnapshot(names[names.length - 1]);
    else setCardStates({
      'base-card': {
        id: 'base-card', name: 'Bilanciamento Base', icon: '⚔️', color: 'bg-blue-500', collapsed: false, active: true, visible: true,
        stats: ['hp','damage','hitToKo'], subCards: []
      }
    });
  setIsInitialized(true);
  }, []);

  const setStat = useCallback((key: string, value: number) => {
    if (lockedStats.has(key) || !recalcEngineRef.current) return;
    setStats(prev => {
      const upd = { ...prev, [key]: { ...prev[key], value, dirty: true } };
      const { updatedStats, newDirtyStats } = recalcEngineRef.current!.recalculateAll(upd, new Set([key]), lockedStats);
      setDirtyStats(newDirtyStats);
      return updatedStats as Record<string, EnhancedStatState>;
    });
  }, [lockedStats]);

  const updateStat = useCallback((key: string, stat: EnhancedStatState) => {
    setStats(prev => ({ ...prev, [key]: stat }));
    if (stat.formula !== formulas[key]) setFormulas(f => ({ ...f, [key]: stat.formula }));
    setDirtyStats(d => new Set(d).add(key));
  }, [formulas]);

  const setFormula = useCallback((key: string, fmla: string) => {
    setFormulas(prev => ({ ...prev, [key]: fmla }));
    setStats(prev => ({ ...prev, [key]: { ...prev[key], formula: fmla, dirty: true } }));
    setDirtyStats(d => new Set(d).add(key));
    if (!recalcEngineRef.current) return;
    setStats(prev => {
      const upd = { ...prev };
      const { updatedStats, newDirtyStats } = recalcEngineRef.current!.recalculateAll(upd, new Set([key]), lockedStats);
      setDirtyStats(newDirtyStats);
      return updatedStats as Record<string, EnhancedStatState>;
    });
  }, [lockedStats]);

  const toggleLock = useCallback((key: string) => {
    setLockedStats(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const toggleModuleVisible = useCallback((id: string) => {
    setModules(m => ({ ...m, [id]: { ...m[id], isVisible: !m[id].isVisible } }));
  }, []);

  const toggleModuleActive = useCallback((id: string) => {
    setModules(m => ({ ...m, [id]: { ...m[id], isActive: !m[id].isActive } }));
    // optionally recalc module stats here
  }, []);

  const saveSnapshot = useCallback((name: string) => {
    BalanceStorageService.saveSnapshot(name, { stats, formulas, cardStates }, lockedStats);
  }, [stats, formulas, cardStates, lockedStats]);

  const loadSnapshot = useCallback((name: string) => {
    const snap = BalanceStorageService.loadSnapshot(name) as StatSnapshot & { formulas?: Record<string,string> };
    if (!snap) return;
    const loaded = snap.stats as Record<string, EnhancedStatState>;
    setStats(loaded);
    setFormulas(snap.formulas || {});
    setDirtyStats(new Set(Object.keys(loaded).filter(k => loaded[k].dirty)));
    setLockedStats(new Set(snap.locked||[]));
    if (recalcEngineRef.current) {
      recalcEngineRef.current.updateDependencyGraph(loaded);
      const { updatedStats, newDirtyStats } = recalcEngineRef.current.recalculateAll(
        loaded,
        new Set(Object.keys(loaded).filter(k => loaded[k].dirty)),
        new Set(snap.locked||[])
      );
      setStats(updatedStats as Record<string, EnhancedStatState>);
      setDirtyStats(newDirtyStats);
    }
    if (snap.cardStates) setCardStates(snap.cardStates);
  }, []);

  const listSnapshotNames = useCallback(() => BalanceStorageService.listSnapshotNames(), []);
  const deleteSnapshot = useCallback((name: string) => BalanceStorageService.deleteSnapshot(name), []);

  const addCard = useCallback((parentId?: string) => {
    const id = `card-${Date.now()}`;
    setCardStates(prev => {
      const newCard: CardState = { id, name:'Nuova Card', icon:'🧩', color:'bg-gray-500', collapsed:false, active:true, visible:true, stats:[], subCards:[] };
      const upd = { ...prev, [id]: newCard };
      if (parentId) upd[parentId] = { ...upd[parentId], subCards: [...upd[parentId].subCards, id] };
      return upd;
    });
  }, []);

  const toggleCardCollapse = useCallback((cardId: string) => {
    setCardStates(prev => ({ ...prev, [cardId]: {...prev[cardId], collapsed: !prev[cardId].collapsed} }));
  }, []);

  const toggleCardActive = useCallback((cardId: string) => {
    setCardStates(prev => ({ ...prev, [cardId]: {...prev[cardId], active: !prev[cardId].active} }));
  }, []);

  return (
    <BalancerContext.Provider value={{
      stats, setStat, updateStat,
      lockedStats, toggleLock,
      formulas, setFormula,
      dirtyStats,
      modules, toggleModuleVisible, toggleModuleActive,
      saveSnapshot, loadSnapshot, listSnapshotNames, deleteSnapshot,
      cardStates, setCardStates,
      addCard, toggleCardCollapse, toggleCardActive,
      isInitialized,
    }}>
      {children}
    </BalancerContext.Provider>
  );
};
