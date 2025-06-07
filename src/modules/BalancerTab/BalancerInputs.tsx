import React from 'react';
import { StatInput } from '@/components/ui/StatInput';
import { Tooltip } from '@/components/ui/Tooltip';
import { Lock, Unlock } from 'lucide-react';

interface Props {
  stats: Record<string, number>;
  onChange: (key: string, value: number) => void;
  lockedStats: Set<string>;
  onToggleLock: (key: string) => void;
}

export function BalancerInputs({ stats, onChange, lockedStats, onToggleLock }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(stats).map(([key, value]) => {
        const isLocked = lockedStats.has(key);

        return (
          <div
            key={key}
            className="relative border rounded p-2 shadow-sm bg-gray-800"
          >
            {/* Tooltip semplice */}
            <Tooltip content={`Descrizione della stat "${key}" (TODO)`}>
              <div className="font-semibold cursor-help capitalize text-white">
                {key}
              </div>
            </Tooltip>

            {/* Input combinato slider + numero */}
            <StatInput
              label={''} 
              value={value}
              min={0}
              max={100}
              step={1}
              disabled={isLocked}
              onChange={(newVal) => onChange(key, newVal)}
            />

            {/* Pulsante lock/unlock */}
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              onClick={() => onToggleLock(key)}
            >
              {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
            </button>
          </div>
        );
      })}
    </div>
  );
}
