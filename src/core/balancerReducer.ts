import { evaluate, parse, isAssignmentNode, isSymbolNode } from 'mathjs';
import type { StatState, CardState, MacroModule } from '@/modules/BalancerModule/types';
import type { MathNode } from 'mathjs';
import { defaultBalancerConfig } from '../modules/BalancerModule/defaultBalancerConfig';

export interface AppState {
  modules: Record<string, MacroModule>;
  stats: Record<string, StatState>;
  cardStates: Record<string, CardState>;
  history: Record<string, { past: CardState[]; future: CardState[] }>;
  dirtyStats: Record<string, Set<string>>;
}

export const MAX_HISTORY = 5;

export type Action =
  | { type: 'SET_MODULES'; modules: Record<string, MacroModule> }
  | { type: 'SET_STATS'; stats: Record<string, StatState> }
  | { type: 'SET_CARD_STATES'; cardStates: Record<string, CardState> }
  | { type: 'ADD_CARD'; parentId?: string }
  | { type: 'ADD_STAT'; cardId: string }
  | { type: 'REMOVE_STAT'; cardId: string; statId: string }
  | { type: 'TOGGLE_CARD_COLLAPSE'; cardId: string }
  | { type: 'TOGGLE_CARD_ACTIVE'; cardId: string }
  | { type: 'UPDATE_CARD_NAME'; cardId: string; name: string }
  | { type: 'SET_CARD_FORMULA'; cardId: string; formula: string }
  | { type: 'SET_CARD_COLOR'; cardId: string; color: string }
  | { type: 'SET_CARD_ICON'; cardId: string; icon: string }
  | { type: 'DUPLICATE_CARD'; cardId: string }
  | { type: 'REMOVE_CARD'; cardId: string }
  | { type: 'UNDO_CARD'; cardId: string }
  | { type: 'REDO_CARD'; cardId: string }
  | { type: 'SET_STAT'; statId: string; value: number }
  | { type: 'UPDATE_STAT'; cardId: string; statId: string; value: number }
  | { type: 'TOGGLE_LOCK'; statId: string }
  | { type: 'SET_FORMULA'; statId: string; formula: string }
  | { type: 'UPDATE_STAT_NAME'; statId: string; name: string }
  | { type: 'TOGGLE_STAT_ACTIVE'; statId: string }
  | { type: 'SET_STAT_CONSTANT'; statId: string; constant: number | null }
  | { type: 'TOGGLE_MODULE_VISIBLE'; moduleId: string }
  | { type: 'TOGGLE_MODULE_ACTIVE'; moduleId: string }
  | { type: 'RESET_STATE' };

// Helper function to get the active entry from defaultBalancerConfig
const getActiveEntry = () => {
  const active = defaultBalancerConfig.entries.find(entry => entry.id === defaultBalancerConfig.activeEntry);
  return active || defaultBalancerConfig.entries[0] || { id: 'default', name: 'Default', hp: 100, damage: 25, description: '' };
};

export const balancerReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_MODULES':
      return { ...state, modules: action.modules };
    case 'SET_STATS':
      return { ...state, stats: action.stats };
    case 'SET_CARD_STATES':
      return { ...state, cardStates: action.cardStates };
    case 'ADD_CARD': {
      const id = `card_${Date.now()}`;
      const activeEntry = getActiveEntry();
      const newCard: CardState = {
        id,
        name: activeEntry.name || 'Default Card',
        icon: '🧩', // Default icon
        color: '#ffffff', // Default color
        collapsed: false,
        active: true,
        formula: '', // Default formula
        stats: ['hp', 'damage'], // Based on defaultBalancerEntries properties
        subCards: [],
      };
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [id]: newCard,
          ...(action.parentId
            ? {
                [action.parentId]: {
                  ...state.cardStates[action.parentId],
                  subCards: [...state.cardStates[action.parentId].subCards, id],
                },
              }
            : {}),
        },
        history: {
          ...state.history,
          [id]: { past: [], future: [] },
          ...(action.parentId
            ? {
                [action.parentId]: {
                  ...state.history[action.parentId],
                  past: [...(state.history[action.parentId]?.past || []), state.cardStates[action.parentId]].slice(-MAX_HISTORY),
                  future: [],
                },
              }
            : {}),
        },
      };
    }
    case 'ADD_STAT': {
      const { cardId } = action;
      const id = `stat_${Date.now()}`;
      const newStat: StatState = {
        id,
        name: 'Nuova Stat',
        value: 0,
        visible: true,
        locked: false,
        formula: '',
        constant: null,
      };
      return {
        ...state,
        stats: { ...state.stats, [id]: newStat },
        cardStates: {
          ...state.cardStates,
          [cardId]: {
            ...state.cardStates[cardId],
            stats: [...state.cardStates[cardId].stats, id],
          },
        },
        history: {
          ...state.history,
          [cardId]: {
            ...state.history[cardId],
            past: [...(state.history[cardId]?.past || []), state.cardStates[cardId]].slice(-MAX_HISTORY),
            future: [],
          },
        },
      };
    }
    case 'REMOVE_STAT': {
      const { cardId, statId } = action;
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [cardId]: {
            ...state.cardStates[cardId],
            stats: state.cardStates[cardId].stats.filter(id => id !== statId),
          },
        },
        history: {
          ...state.history,
          [cardId]: {
            ...state.history[cardId],
            past: [...(state.history[cardId]?.past || []), state.cardStates[cardId]].slice(-MAX_HISTORY),
            future: [],
          },
        },
      };
    }
    case 'TOGGLE_CARD_COLLAPSE': {
      const { cardId } = action;
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [cardId]: {
            ...state.cardStates[cardId],
            collapsed: !state.cardStates[cardId].collapsed,
          },
        },
        history: {
          ...state.history,
          [cardId]: {
            ...state.history[cardId],
            past: [...(state.history[cardId]?.past || []), state.cardStates[cardId]].slice(-MAX_HISTORY),
            future: [],
          },
        },
      };
    }
    case 'TOGGLE_CARD_ACTIVE': {
      const { cardId } = action;
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [cardId]: {
            ...state.cardStates[cardId],
            active: !state.cardStates[cardId].active,
          },
        },
        history: {
          ...state.history,
          [cardId]: {
            ...state.history[cardId],
            past: [...(state.history[cardId]?.past || []), state.cardStates[cardId]].slice(-MAX_HISTORY),
            future: [],
          },
        },
      };
    }
    case 'UPDATE_CARD_NAME': {
      const { cardId, name } = action;
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [cardId]: {
            ...state.cardStates[cardId],
            name,
          },
        },
        history: {
          ...state.history,
          [cardId]: {
            ...state.history[cardId],
            past: [...(state.history[cardId]?.past || []), state.cardStates[cardId]].slice(-MAX_HISTORY),
            future: [],
          },
        },
      };
    }
    case 'SET_CARD_FORMULA': {
      const { cardId, formula } = action;
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [cardId]: {
            ...state.cardStates[cardId],
            formula,
          },
        },
        history: {
          ...state.history,
          [cardId]: {
            ...state.history[cardId],
            past: [...(state.history[cardId]?.past || []), state.cardStates[cardId]].slice(-MAX_HISTORY),
            future: [],
          },
        },
      };
    }
    case 'SET_CARD_COLOR': {
      const { cardId, color } = action;
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [cardId]: {
            ...state.cardStates[cardId],
            color,
          },
        },
        history: {
          ...state.history,
          [cardId]: {
            ...state.history[cardId],
            past: [...(state.history[cardId]?.past || []), state.cardStates[cardId]].slice(-MAX_HISTORY),
            future: [],
          },
        },
      };
    }
    case 'SET_CARD_ICON': {
      const { cardId, icon } = action;
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [cardId]: {
            ...state.cardStates[cardId],
            icon,
          },
        },
        history: {
          ...state.history,
          [cardId]: {
            ...state.history[cardId],
            past: [...(state.history[cardId]?.past || []), state.cardStates[cardId]].slice(-MAX_HISTORY),
            future: [],
          },
        },
      };
    }
    case 'DUPLICATE_CARD': {
      const { cardId } = action;
      const src = state.cardStates[cardId];
      const nid = `card_${Date.now()}`;
      return {
        ...state,
        cardStates: {
          ...state.cardStates,
          [nid]: { ...src, id: nid, name: src.name + ' (copy)' },
        },
        history: {
          ...state.history,
          [nid]: { past: [], future: [] },
          [cardId]: {
            ...state.history[cardId],
            past: [...(state.history[cardId]?.past || []), state.cardStates[cardId]].slice(-MAX_HISTORY),
            future: [],
          },
        },
      };
    }
    case 'REMOVE_CARD': {
      const { cardId } = action;
      const newCardStates = { ...state.cardStates };
      delete newCardStates[cardId];
      return {
        ...state,
        cardStates: newCardStates,
        history: {
          ...state.history,
          [cardId]: {
            ...state.history[cardId],
            past: [...(state.history[cardId]?.past || []), state.cardStates[cardId]].slice(-MAX_HISTORY),
            future: [],
          },
        },
      };
    }
    case 'UNDO_CARD': {
      const { cardId } = action;
      const rec = state.history[cardId];
      if (!rec || rec.past.length === 0) return state;
      const newPast = [...rec.past];
      const prev = newPast.pop()!;
      const newFuture = [state.cardStates[cardId], ...rec.future].slice(0, MAX_HISTORY);
      return {
        ...state,
        cardStates: { ...state.cardStates, [cardId]: prev },
        history: {
          ...state.history,
          [cardId]: { past: newPast, future: newFuture },
        },
      };
    }
    case 'REDO_CARD': {
      const { cardId } = action;
      const rec = state.history[cardId];
      if (!rec || rec.future.length === 0) return state;
      const newFuture = [...rec.future];
      const next = newFuture.shift()!;
      const newPast = [...rec.past, state.cardStates[cardId]].slice(-MAX_HISTORY);
      return {
        ...state,
        cardStates: { ...state.cardStates, [cardId]: next },
        history: {
          ...state.history,
          [cardId]: { past: newPast, future: newFuture },
        },
      };
    }
    case 'SET_STAT': {
      const { statId, value } = action;
      return {
        ...state,
        stats: {
          ...state.stats,
          [statId]: { ...state.stats[statId], value },
        },
      };
    }
    case 'UPDATE_STAT': {
      const { cardId, statId, value } = action;
      const card = state.cardStates[cardId];
      if (!card || !card.formula || !state.stats[statId]) return state;

      let newStats = { ...state.stats, [statId]: { ...state.stats[statId], value } };
      let newDirtyStats = { ...state.dirtyStats, [cardId]: new Set(state.dirtyStats[cardId] || []) };
      const formula = card.formula;

      if (!formula) return { ...state, stats: newStats };

      let lhsStatId: string | null = null;
      let formulaStats = new Set<string>();
      try {
        const parsed = parse(formula);
        if (isAssignmentNode(parsed)) {
          const leftNode = parsed.object;
          if (isSymbolNode(leftNode)) {
            lhsStatId = leftNode.name;
          }
        }

        parsed.traverse(node => {
          if (isSymbolNode(node) && node.name && state.stats[node.name]) {
            formulaStats.add(node.name);
          }
        });
      } catch {
        return { ...state, stats: newStats };
      }

      formulaStats.forEach(stat => {
        if (stat !== statId) newDirtyStats[cardId].add(stat);
      });

      if (statId === lhsStatId && lhsStatId) {
        const targetStatId = Array.from(formulaStats).find(
          id => id !== statId && !newStats[id]?.locked && newStats[id]?.visible && state.stats[id]
        );
        if (!targetStatId) return { ...state, stats: newStats, dirtyStats: newDirtyStats };

        try {
          const scope = Object.fromEntries(
            Object.keys(state.stats).map(id => [
              id,
              newStats[id]?.constant !== null ? newStats[id].constant! : id === statId ? value : newStats[id]?.value || 0,
            ])
          );
          const result = evaluate(formula, scope);
          if (typeof result === 'number' && !isNaN(result)) {
            newStats[targetStatId] = { ...newStats[targetStatId], value: result };
          }
        } catch {
          return { ...state, stats: newStats, dirtyStats: newDirtyStats };
        }
      } else {
        if (lhsStatId && newStats[lhsStatId]?.locked) {
          const targetStatId = Array.from(formulaStats).find(
            id => id !== statId && id !== lhsStatId && !newStats[id]?.locked && newStats[id]?.visible && state.stats[id]
          );
          if (!targetStatId) return { ...state, stats: newStats, dirtyStats: newDirtyStats };

          try {
            const scope = Object.fromEntries(
              Object.keys(state.stats).map(id => [
                id,
                newStats[id]?.constant !== null ? newStats[id].constant! : id === statId ? value : newStats[id]?.value || 0,
              ])
            );
            const result = evaluate(formula, scope);
            if (typeof result === 'number' && !isNaN(result)) {
              newStats[targetStatId] = { ...newStats[targetStatId], value: result };
            }
          } catch {
            return { ...state, stats: newStats, dirtyStats: newDirtyStats };
          }
        } else if (lhsStatId) {
          try {
            const scope = Object.fromEntries(
              Object.keys(state.stats).map(id => [
                id,
                newStats[id]?.constant !== null ? newStats[id].constant! : id === statId ? value : newStats[id]?.value || 0,
              ])
            );
            const result = evaluate(formula, scope);
            if (typeof result === 'number' && !isNaN(result)) {
              newStats[lhsStatId] = { ...newStats[lhsStatId], value: result };
            }
          } catch {
            return { ...state, stats: newStats, dirtyStats: newDirtyStats };
          }
        }
      }

      return { ...state, stats: newStats, dirtyStats: newDirtyStats };
    }
    case 'TOGGLE_LOCK': {
      const { statId } = action;
      return {
        ...state,
        stats: {
          ...state.stats,
          [statId]: { ...state.stats[statId], locked: !state.stats[statId].locked },
        },
      };
    }
    case 'SET_FORMULA': {
      const { statId, formula } = action;
      return {
        ...state,
        stats: {
          ...state.stats,
          [statId]: { ...state.stats[statId], formula },
        },
      };
    }
    case 'UPDATE_STAT_NAME': {
      const { statId, name } = action;
      return {
        ...state,
        stats: {
          ...state.stats,
          [statId]: { ...state.stats[statId], name },
        },
      };
    }
    case 'TOGGLE_STAT_ACTIVE': {
      const { statId } = action;
      return {
        ...state,
        stats: {
          ...state.stats,
          [statId]: {
            ...state.stats[statId],
            visible: !state.stats[statId].visible,
            constant: !state.stats[statId].visible ? state.stats[statId].value : null,
          },
        },
      };
    }
    case 'SET_STAT_CONSTANT': {
      const { statId, constant } = action;
      return {
        ...state,
        stats: {
          ...state.stats,
          [statId]: { ...state.stats[statId], constant },
        },
      };
    }
    case 'TOGGLE_MODULE_VISIBLE': {
      const { moduleId } = action;
      return {
        ...state,
        modules: {
          ...state.modules,
          [moduleId]: {
            ...state.modules[moduleId],
            isVisible: true, // Set to true as per your request
          },
        },
      };
    }
    case 'TOGGLE_MODULE_ACTIVE': {
      const { moduleId } = action;
      return {
        ...state,
        modules: {
          ...state.modules,
          [moduleId]: {
            ...state.modules[moduleId],
            isActive: true, // Set to true as per your request
          },
        },
      };
    }
    case 'RESET_STATE': {
      const cardId = `card_${Date.now()}`;
      const activeEntry = getActiveEntry();
      const statIds = ['hp', 'damage']; // Based on defaultBalancerEntries properties
      const stats: Record<string, StatState> = {
        hp: {
          id: 'hp',
          name: 'Punti Vita',
          value: activeEntry.hp || 100,
          visible: true,
          locked: false,
          formula: '',
          constant: null,
        },
        damage: {
          id: 'damage',
          name: 'Danno',
          value: activeEntry.damage || 25,
          visible: true,
          locked: false,
          formula: '',
          constant: null,
        },
      };
      const cardStates: Record<string, CardState> = {
        [cardId]: {
          id: cardId,
          name: activeEntry.name || 'Default Card',
          icon: '🧩', // Default icon
          color: '#ffffff', // Default color
          collapsed: false,
          active: true,
          formula: '',
          stats: statIds,
          subCards: [],
        },
      };
      return {
        ...state,
        stats,
        cardStates,
        history: { [cardId]: { past: [], future: [] } },
        dirtyStats: {},
      };
    }
    default:
      return state;
  }
};