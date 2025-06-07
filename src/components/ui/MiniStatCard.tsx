// src/components/MiniStatCard.tsx
import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import type { Stat } from '../../shared/types/Stat';

interface MiniStatCardProps {
  stat: Stat;
  onChangeBase: (id: string, newVal: number) => void;
  onToggleLock: (id: string) => void;
  onToggleVisible: (id: string) => void;
  onRemove: (id: string) => void;
}

export const MiniStatCard: React.FC<MiniStatCardProps> = ({
  stat,
  onChangeBase,
  onToggleLock,
  onToggleVisible,
  onRemove,
}) => {
  if (!stat.isVisible) return null;

  return (
    <div
      className={`
        border rounded-lg p-3 
        ${!stat.isActive ? 'opacity-50 bg-gray-700' : 'bg-gray-800'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-white">{stat.name}</h4>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onToggleLock(stat.id)}
            className="p-1 hover:bg-gray-600 rounded"
            title={stat.isLocked ? 'Sblocca stat' : 'Blocca stat'}
          >
            {stat.isLocked ? <Lock size={20} /> : <Unlock size={20} />}
          </button>
          <button
            type="button"
            onClick={() => onToggleVisible(stat.id)}
            className="p-1 hover:bg-gray-600 rounded"
            title={stat.isVisible ? 'Nascondi stat' : 'Mostra stat'}
          >
            {/* usa un'icona “occhio”/“occhio barrato” se le hai */}
            {stat.isVisible ? <span>👁️</span> : <span>🚫</span>}
          </button>
          <button
            type="button"
            onClick={() => onRemove(stat.id)}
            className="p-1 hover:bg-red-600 rounded"
            title="Rimuovi stat"
          >
            ❌
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-1">Base:</div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={stat.baseValue}
          disabled={stat.isLocked}
          onChange={(e) => onChangeBase(stat.id, parseFloat(e.target.value))}
          className="bg-gray-100 text-gray-800 border border-gray-300 p-1 rounded w-20 disabled:opacity-50"
        />
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={200}
            value={stat.baseValue}
            disabled={stat.isLocked}
            onChange={(e) => onChangeBase(stat.id, Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          />
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-200">
        Corrente: {stat.currentValue}
      </div>
    </div>
  );
};
