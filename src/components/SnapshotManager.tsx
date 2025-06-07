// src/components/SnapshotManager.tsx
import React, { useState, useRef } from 'react';
import { useBalancerContext } from '@/core/BalancerContext';
import { Button } from '@/components/ui/button';

export const SnapshotManager: React.FC = () => {
  const { saveSnapshot, loadSnapshot, deleteSnapshot, listSnapshotNames } =
    useBalancerContext();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!name.trim()) return alert('Devi inserire un nome');
    saveSnapshot(name.trim());
    setName('');
  };

  const handleLoad = () => {
    if (!selected) return;
    loadSnapshot(selected);
  };

  const handleDelete = () => {
    if (!selected) return;
    if (confirm(`Eliminare lo snapshot "${selected}"?`)) {
      deleteSnapshot(selected);
      setSelected('');
    }
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <input
        type="text"
        placeholder="Nome snapshot"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-gray-100 text-gray-800 border border-gray-300 p-1 rounded w-40"
      />
      <Button onClick={handleSave}>💾 Salva</Button>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="bg-gray-100 text-gray-800 border border-gray-300 p-1 rounded"
      >
        <option value="">Carica snapshot…</option>
        {listSnapshotNames().map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <Button onClick={handleLoad} disabled={!selected}>
        📂 Carica
      </Button>
      <Button variant="destructive" onClick={handleDelete} disabled={!selected}>
        🗑️ Elimina
      </Button>
    </div>
  );
};
