// src/modules/StatBalancer/StatBalancerModule.tsx
import React, { useEffect, useState } from 'react';
import { BalancerInputs } from './BalancerInputs';
import { BalanceStorageService, StatSnapshot } from '@/services/BalanceStorageService';
import { useStatContext } from '@/core/StatContext';
import { Button } from '@/components/ui/button';

export const StatBalancerModule: React.FC = () => {
  const { stats, setStat, locked, toggleLock, registerStat, unregisterStat } = useStatContext();
  const [snapshotName, setSnapshotName] = useState<string>('');
  const [snapshots, setSnapshots] = useState<string[]>([]);

  useEffect(() => {
    // registro le base stat (una tantum)
    registerStat('hp');
    registerStat('damage');
    registerStat('hitToKo');
    // carico i nomi degli snapshot
    setSnapshots(BalanceStorageService.listSnapshotNames());
  }, [registerStat]);

  const handleSave = () => {
    if (!snapshotName.trim()) {
      alert('Inserisci un nome per lo snapshot!');
      return;
    }
    // NEW: passiamo name, stats e locked separati
    BalanceStorageService.saveSnapshot(snapshotName, stats, locked);
    setSnapshots(BalanceStorageService.listSnapshotNames());
    setSnapshotName('');
  };

  const handleLoad = (name: string) => {
    const snap = BalanceStorageService.loadSnapshot(name);
    if (!snap) {
      alert('Snapshot non trovato!');
      return;
    }
    // deregistro tutte le stat correnti
    Object.keys(stats).forEach(k => unregisterStat(k));
    // registro e setto quelle salvate
    Object.entries(snap.stats).forEach(([k, v]) => {
      registerStat(k);
      setStat(k, v);
    });
    // ripristino i lock: prima sblocco tutto, poi riapplico i lock salvati
    Array.from(locked).forEach((k) => toggleLock(k));
    snap.locked.forEach((k) => toggleLock(k));
  };

  const handleDelete = (name: string) => {
    if (!confirm(`Eliminare snapshot "${name}"?`)) return;
    BalanceStorageService.deleteSnapshot(name);
    setSnapshots(BalanceStorageService.listSnapshotNames());
  };

  return (
    <div className="p-4 space-y-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">Bilanciamento Statistiche</h1>

      {/* Input + Salva */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Nome snapshot"
          value={snapshotName}
          onChange={e => setSnapshotName(e.target.value)}
          className="px-2 py-1 rounded border border-gray-700 bg-gray-800 text-white"
        />
        <Button onClick={handleSave}>Salva</Button>
      </div>

      {/* Lista snapshot */}
      <div className="flex flex-wrap gap-2">
        {snapshots.map(name => (
          <div
            key={name}
            className="flex items-center gap-1 border rounded px-2 py-1 bg-gray-800"
          >
            <span className="font-mono text-white">{name}</span>
            <button
              onClick={() => handleLoad(name)}
              className="text-blue-400 hover:text-blue-300"
            >
              ↻
            </button>
            <button
              onClick={() => handleDelete(name)}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Griglia di input/stat con slider */}
      <BalancerInputs
        stats={stats}
        lockedStats={locked}
        onChange={(k, v) => setStat(k, v)}
        onToggleLock={toggleLock}
      />
    </div>
  );
};
