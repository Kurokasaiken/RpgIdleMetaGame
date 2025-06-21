/* src/modules/StatBalancer/BalancerInputs.tsx */
import React from 'react';
import { StatInput } from '@/components/ui/StatInput';
import { StatSlider } from '@/components/ui/StatSlider';
import { Lock, Unlock } from 'lucide-react';
import { useBalancerContext } from '@/core/BalancerContext';

export const BalancerInputs: React.FC = () => {
  const { stats, setStat, lockedStats, toggleLock } = useBalancerContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(stats).map(([key, value]) => {
        const isLocked = lockedStats.has(key);
        const label = key.charAt(0).toUpperCase() + key.slice(1);

        return (
          <div key={key} className="relative border rounded p-2 shadow-sm bg-gray-800">
            <StatInput
              label={label}
              value={value}
              min={0}
              max={200}
              step={1}
              disabled={isLocked}
              onChange={val => setStat(key, val)}
            />
            <div className="mt-2">
              <StatSlider
                value={value}
                min={0}
                max={200}
                disabled={isLocked}
                onChange={val => setStat(key, val)}
              />
            </div>
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
              onClick={() => toggleLock(key)}
              title={isLocked ? 'Sblocca stat' : 'Blocca stat'}
            >
              {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
            </button>
          </div>
        );
      })}
    </div>
  );
};
