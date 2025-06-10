/* src/components/StatCard.tsx */
import React from 'react';
import { useBalancerContext } from '@/core/BalancerContext';
import { StatSlider } from '@/components/ui/StatSlider';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { FormulaEditor } from '@/components/FormulaEditor';

export const StatCard: React.FC<{ cardId: string; statId: string }> = ({ cardId, statId }) => {
  const { stats, lockedStats, toggleLock, setStat } = useBalancerContext();
  const stat = stats[statId];
  const isLocked = lockedStats.has(statId);

  return (
    <div className="relative border rounded p-4 bg-gray-800">
      <div className="flex justify-between items-center mb-2">
        <input
          value={stat.name}
          onChange={e => {/* implement rename */}}
          className="bg-transparent text-white font-bold text-lg"
        />
        <div className="flex gap-2">
          <button onClick={() => toggleLock(statId)}>
            {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
          <button onClick={() => {/* toggle visibility */}}>
            {stat.visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>
      <FormulaEditor statId={statId} />
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          value={stat.value}
          disabled={isLocked}
          onChange={e => setStat(statId, Number(e.target.value))}
          className="w-16 p-1 bg-gray-700 text-white rounded disabled:opacity-50"
        />
        <StatSlider
          value={stat.value}
          min={0}
          max={999}
          disabled={isLocked}
          onChange={v => setStat(statId, v)}
        />
      </div>
    </div>
  );
};