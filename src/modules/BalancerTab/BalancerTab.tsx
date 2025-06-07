/* src/modules/BalancerTab/BalancerTab.tsx */
import React, { useEffect } from 'react';
import { BalanceStorageService } from '@/services/BalanceStorageService';
import { BalancerInputs } from './BalancerInputs';
import { Button } from '@/components/ui/button';
import { StatDefinitionService } from '@/services/StatDefinitionService';
import { useBalancerContext } from '@/core/BalancerContext';
import type { MacroModule } from './types';

interface Props {
  module: MacroModule;
}

export default function BalancerTab({ module }: Props) {
  const { stats, setStat, lockedStats, toggleLock, listSnapshotNames } = useBalancerContext();

  useEffect(() => {
    const last = localStorage.getItem('lastSnapshotName');
    const snap = last ? BalanceStorageService.loadSnapshot(last) : undefined;
    if (snap) {
      Object.entries(snap.stats).forEach(([k, v]) => setStat(k, v));
      snap.locked?.forEach(k => toggleLock(k));
        } else {
     // Carica i default se non c’è snapshot
       const defs = StatDefinitionService.getDefaultStats();
       Object.entries(defs).forEach(([k, v]) => setStat(k, v));
    }
  }, []);

  const saveSnapshot = () => {
    const name = prompt('Nome snapshot:');
    if (!name) return;
    BalanceStorageService.saveSnapshot(name, stats, lockedStats);
    localStorage.setItem('lastSnapshotName', name);
  };

  const loadSnapshot = () => {
    const choices = listSnapshotNames();
    const name = prompt(`Carica snapshot (scegli tra: ${choices.join(', ')})`);
    if (!name) return;
    const snap = BalanceStorageService.loadSnapshot(name);
    if (snap) {
      Object.entries(snap.stats).forEach(([k, v]) => setStat(k, v));
      snap.locked?.forEach(k => toggleLock(k));
      localStorage.setItem('lastSnapshotName', name);
    } else {
      alert('Snapshot non trovato!');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">{module.name}</h1>
      <BalancerInputs />
      <div className="flex gap-2">
        <Button onClick={saveSnapshot}>Salva Snapshot</Button>
        <Button onClick={loadSnapshot}>Carica Snapshot</Button>
      </div>
    </div>
  );
}