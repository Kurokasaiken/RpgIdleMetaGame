
import React, { useState, useEffect } from "react";
import { useStatContext } from '@/core/StatContext';
import { BalanceStorageService } from "../../services/BalanceStorageService";

// SnapshotControls.tsx
export const SnapshotControls = () => {
  const { stats, setStat, locked, toggleLock, registerStat, unregisterStat } = useStatContext();
  const [snapshots, setSnapshots] = useState<string[]>([]);
    useEffect(() => {
  setSnapshots(BalanceStorageService.listSnapshotNames());
}, []);


  const loadSnapshot = (name: string) => {
    // Implement snapshot loading logic here
    console.log(`Loading snapshot: ${name}`);
  };

  return (
    <div className="p-2 bg-gray-800">
      <h2 className="font-bold">Snapshot</h2>
      {snapshots.map((name: string) => (
        <button key={name} onClick={() => loadSnapshot(name)}>{name}</button>
      ))}
    </div>
  );
};
