// src/modules/BalancerTab/BalancerTab.tsx
import React, { useEffect, useState } from 'react';
import { StatDefinitionService } from '@/services/StatDefinitionService';
import { BalanceStorageService, StatSnapshot } from '@/services/BalanceStorageService';
import { BalancerInputs } from './BalancerInputs';
import { Button } from '@/components/ui/button';
import type { MacroModule } from './types';

interface Props {
  module: MacroModule;
}

export default function BalancerTab({ module }: Props) {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [locked, setLocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const snap = BalanceStorageService.loadLastSnapshot();
    if (snap) {
      setStats(snap.stats);
      setLocked(new Set(snap.locked ?? []));
    } else {
      setStats(StatDefinitionService.loadDefinitions());
    }
  }, []);

  const handleStatChange = (key: string, value: number) => {
    if (locked.has(key)) return;
    setStats(prev => {
      const updated = { ...prev, [key]: value };
      return StatDefinitionService.recalculate(updated, locked);
    });
  };

  const toggleLock = (key: string) => {
    setLocked(prev => {
      const s = new Set(prev);
      if (s.has(key)) s.delete(key);
      else s.add(key);
      return s;
    });
  };

  const saveSnapshot = () => {
    const name = prompt('Nome snapshot:');
    if (!name) return;
    // <-- qui passiamo name, stats e locked direttamente
    BalanceStorageService.saveSnapshot(name, stats, locked);
  };

  const loadSnapshot = () => {
    const name = prompt('Nome snapshot da caricare:');
    if (!name) return;
    const snap = BalanceStorageService.loadSnapshot(name);
    if (snap) {
      setStats(snap.stats);
      setLocked(new Set(snap.locked ?? []));
    } else {
      alert('Snapshot non trovato!');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Modulo di Bilanciamento Stat</h1>

      <BalancerInputs
        stats={stats}
        lockedStats={locked}
        onChange={handleStatChange}
        onToggleLock={toggleLock}
      />

      <div className="flex gap-2">
        <Button onClick={saveSnapshot}>Salva Snapshot</Button>
        <Button onClick={loadSnapshot}>Carica Snapshot</Button>
      </div>
    </div>
  );
}
