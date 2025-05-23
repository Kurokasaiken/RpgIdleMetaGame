import React from 'react';
import { CombatOptions } from '../types';

interface CombatOptionsProps {
  options: CombatOptions;
  onOptionsChange: (options: CombatOptions) => void;
}

const CombatOptionsComponent: React.FC<CombatOptionsProps> = ({ options, onOptionsChange }) => {
  const handleToggle = (key: keyof Omit<CombatOptions, 'maxTurns'>) => {
    onOptionsChange({
      ...options,
      [key]: !options[key]
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-white mb-4">Opzioni di Combattimento</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={options.hitChance}
              onChange={() => handleToggle('hitChance')}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <span>Probabilità di Colpire</span>
          </label>

          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={options.critical}
              onChange={() => handleToggle('critical')}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <span>Colpi Critici</span>
          </label>

          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={options.armor}
              onChange={() => handleToggle('armor')}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <span>Sistema Armature</span>
          </label>

          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={options.skills}
              onChange={() => handleToggle('skills')}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <span>Abilità Speciali</span>
          </label>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-700 rounded text-sm text-gray-300">
        <p><strong>Probabilità di Colpire:</strong> Gli attacchi possono mancare basandosi su Agilità</p>
        <p><strong>Colpi Critici:</strong> Possibilità di infliggere danno extra basata su Fortuna</p>
        <p><strong>Sistema Armature:</strong> Le armature riducono il danno ricevuto</p>
        <p><strong>Abilità Speciali:</strong> I personaggi possono usare le loro skill equipaggiate</p>
      </div>
    </div>
  );
};

export default CombatOptionsComponent;