import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Modifier {
  id: string;
  label: string;
  value: number;
  type: 'flat' | 'percent';
}

interface ModifierListProps {
  modifiers: Modifier[];
  onChange: (updated: Modifier[]) => void;
}

/**
 * ModifierList: mostra una lista di bonus/debuff che modificano le stat.
 * Permette di aggiungere, rimuovere e modificare i singoli modifier.
 */
export const ModifierList: React.FC<ModifierListProps> = ({ modifiers, onChange }) => {
  const [localMods, setLocalMods] = useState<Modifier[]>(modifiers);

  const updateModifier = (id: string, field: keyof Modifier, newVal: any) => {
    const updated = localMods.map((m) =>
      m.id === id ? { ...m, [field]: newVal } : m
    );
    setLocalMods(updated);
    onChange(updated);
  };

  const addModifier = () => {
    const newMod: Modifier = {
      id: crypto.randomUUID(),
      label: 'Nuovo Mod',
      value: 0,
      type: 'flat',
    };
    setLocalMods((prev) => [...prev, newMod]);
    onChange([...localMods, newMod]);
  };

  const removeModifier = (id: string) => {
    const updated = localMods.filter((m) => m.id !== id);
    setLocalMods(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Modificatori</span>
        <Button size="sm" variant="ghost" onClick={addModifier}>
          + Aggiungi
        </Button>
      </div>
      {localMods.map((mod) => (
        <div key={mod.id} className="flex gap-2 items-center">
          <input
            type="text"
            value={mod.label}
            onChange={(e) => updateModifier(mod.id, 'label', e.target.value)}
            className="border p-1 rounded flex-1"
          />
          <input
            type="number"
            value={mod.value}
            onChange={(e) => updateModifier(mod.id, 'value', parseFloat(e.target.value))}
            className="border p-1 rounded w-20"
          />
          <select
            value={mod.type}
            onChange={(e) => updateModifier(mod.id, 'type', e.target.value)}
            className="border p-1 rounded"
          >
            <option value="flat">Flat</option>
            <option value="percent">%</option>
          </select>
          <Button size="sm" variant="destructive" onClick={() => removeModifier(mod.id)}>
            Elimina
          </Button>
        </div>
      ))}
    </div>
  );
};
