// src/modules/BalancerTab/BalancerCard.tsx
import React from 'react';
import { EyeIcon, EyeOffIcon, PowerIcon } from 'lucide-react';
import { useBalancerContext } from '@/core/BalancerContext';
import type { MacroModule } from './types';

interface Props { module: MacroModule }

const BalancerCard: React.FC<Props> = ({ module }) => {
  const { toggleModuleVisible, toggleModuleActive } = useBalancerContext();
  const { id, name, icon, colorClass, isVisible, isActive } = module;

  return (
    <div
      className={`
        border rounded-2xl shadow-md p-4 mb-4 transition-all duration-300
        bg-gray-800 text-gray-100
        ${!isActive ? 'opacity-50' : ''}
      `}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`text-2xl ${colorClass}`}>{icon}</span>
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>

        <div className="flex gap-2">
          <button
            aria-label={isVisible ? 'Nascondi modulo' : 'Mostra modulo'}
            onClick={() => toggleModuleVisible(id)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {isVisible ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
          </button>

          <button
            aria-label={isActive ? 'Disattiva modulo' : 'Attiva modulo'}
            onClick={() => toggleModuleActive(id)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <PowerIcon
              size={20}
              className={isActive ? 'text-green-400' : 'text-red-500'}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalancerCard;
