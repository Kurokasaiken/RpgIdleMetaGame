// src/core/useRecalculationEngine.ts
import { useState, useEffect } from 'react';
import { RecalculationEngine, StatState } from './RecalculationEngine';

export function useRecalculationEngine(
  stats: Record<string, StatState>
) {
  // istanzia una volta sola l’engine
  const [engine] = useState(() => new RecalculationEngine());

  // ogni volta che cambiano tutte le stats, ricostruisci il grafo
  useEffect(() => {
    engine.rebuild(stats);
  }, [engine, stats]);

  // funzione che esegue il ricalcolo a cascata sui changedKeys
  function recalcCascade(
    updatedStats: Record<string, StatState>,
    changedKeys: string[]
  ): Record<string, StatState> {
    return engine.recalcCascade(updatedStats, changedKeys);
  }

  return { recalcCascade };
}
