import React from 'react';
import { StatInput } from '@/components/ui/StatInput';
import { StatSlider } from '@/components/ui/StatSlider';
import { Lock, Unlock } from 'lucide-react';

interface Props {
  stats: Record<string, number>;
  onChange: (key: string, value: number) => void;
  lockedStats: Set<string>;
  onToggleLock: (key: string) => void;
}

export const BalancerInputs: React.FC<Props> = ({
  stats,
  onChange,
  lockedStats,
  onToggleLock,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(stats).map(([key, value]) => {
        const isLocked = lockedStats.has(key);
        const label = key.charAt(0).toUpperCase() + key.slice(1);

        return (
          <div
            key={key}
            className="relative border rounded p-2 shadow-sm bg-gray-800"
          >
            {/* StatInput per inserimento numerico */}
            <StatInput
              label={label}
              value={value}
              min={0}
              max={200}
              step={1}
              disabled={isLocked}
              onChange={(val) => onChange(key, val)}
            />

            {/* StatSlider sincronizzato */}
            <div className="mt-2">
              <StatSlider
                value={value}
                min={0}
                max={200}
                disabled={isLocked}
                onChange={(val) => onChange(key, val)}
              />
            </div>

            {/* Toggle Lock */}
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
              onClick={() => onToggleLock(key)}
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
