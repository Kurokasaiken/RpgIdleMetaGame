// src/components/ui/StatCard.tsx
import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { StatInput } from '@/components/ui/StatInput';
import { Tooltip } from '@/components/ui/Tooltip'; // se non ce l’hai, puoi sfruttare title=""
import { useStatContext } from '@/core/StatContext';

interface StatDefinition {
  key: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string; // es. 'text-red-500'
  category: string; // es. 'Base', 'Advanced'
}

interface StatCardProps {
  definition: StatDefinition;
  value: number;
  onChange: (key: string, newVal: number) => void;
  isLocked: boolean;
  toggleLock: (key: string) => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  definition,
  value,
  onChange,
  isLocked,
  toggleLock,
}) => {
  return (
    <div
      className={
        `flex items-center gap-2 border p-2 rounded-lg ` +
        (isLocked ? 'border-red-500 bg-red-100' : '')
      }
    >
      <div className={`text-xl ${definition.colorClass}`}>{definition.icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
            <Tooltip content={definition.description}>
              <label className="font-medium cursor-help">{definition.name}</label>
            </Tooltip>
            <button onClick={() => toggleLock(definition.key)}>
              {isLocked ? <Lock /> : <Unlock />}
            </button>
        </div>
<StatInput
  label="Damage"
  value={30}
  min={0}
  max={100}
  step={5}
  onChange={(val) => console.log('Nuovo valore:', val)}
/>

      </div>
    </div>
  );
};
