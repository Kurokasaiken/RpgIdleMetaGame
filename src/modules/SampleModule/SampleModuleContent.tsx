import React, { useState } from 'react';
import { useBalancerContext } from '@/core/BalancerContext';
import { PlusCircle } from 'lucide-react';
import type { MacroModule, StatAssoc } from './types';

interface SampleModuleContentProps {
  module: MacroModule;
}

export const SampleModuleContent: React.FC<SampleModuleContentProps> = ({ module }) => {
  const { modules, ricalcolaModulo } = useBalancerContext();
  const [isEditingStat, setIsEditingStat] = useState<string | null>(null);

  // Stub di funzioni per demo: sostituire con logica vera
  const setStatValue = (statId: string, newValue: number) => {
    console.log(`Set stat ${statId} to ${newValue}`);
  };
  const toggleStatLock = (statId: string) => {
    console.log(`Toggle lock per ${statId}`);
  };
  const addStat = (newStat: StatAssoc, moduleId: string) => {
    console.log(`Aggiungi stat ${newStat.id} a modulo ${moduleId}`);
  };

  const stats = {}; // in una versione reale sarebbero presi dal contesto

  const handleAddStat = () => {
    const newId = `stat_${Date.now()}`;
    const newStat: StatAssoc = {
      id: newId,
      name: 'NuovaStat',
      baseValue: 0,
      isLocked: false,
      isVisible: true,
      isActive: true,
      metadata: {}
    };
    addStat(newStat, module.id);
    setIsEditingStat(newId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => ricalcolaModulo(module.id)}
          className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300"
          title="Ricalcola questo modulo"
        >
          <span className="text-xl">⚡</span>
          <span className="text-sm">Ricalcola</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {module.statIds.map((statId) => {
          const stat: any = (stats as any)[statId];
          if (!stat || !stat.isVisible) return null;
          return (
            <div
              key={statId}
              className={`
                border rounded-lg p-3 
                ${!stat.isActive ? 'bg-gray-700' : 'bg-gray-800'}
              `}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{stat.name}</h4>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleStatLock(statId)}
                    className="p-1 hover:bg-gray-600 rounded"
                    title={stat.isLocked ? 'Sblocca stat' : 'Blocca stat'}
                  >
                    {stat.isLocked ? <span>🔒</span> : <span>🔓</span>}
                  </button>
                  <button
                    onClick={() => setIsEditingStat(statId)}
                    className="p-1 hover:bg-gray-600 rounded"
                    title="Modifica stat"
                  >
                    ✏️
                  </button>
                </div>
              </div>

              {isEditingStat === statId ? (
                <div className="mt-2 space-y-2">
                  <label className="block text-sm">Valore base:</label>
                  <input
                    type="number"
                    value={stat.baseValue}
                    onChange={(e) => setStatValue(statId, parseFloat(e.target.value))}
                    className="w-full p-1 bg-gray-900 rounded"
                  />
                  <button
                    onClick={() => setIsEditingStat(null)}
                    className="mt-1 text-sm text-blue-400 hover:text-blue-300"
                  >
                    Chiudi Editor
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-sm">Base: {stat.baseValue}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleAddStat}
          className="flex items-center gap-1 text-green-400 hover:text-green-300"
          title="Aggiungi nuova stat a questo modulo"
        >
          <PlusCircle size={20} />
          <span className="text-sm">Aggiungi Stat</span>
        </button>
      </div>
    </div>
  );
};
