import React, { useState } from 'react';
import { CharacterPanel } from './components/CharacterPanel';
import { BalanceTab } from './components/BalanceTab';
import { BalanceProvider } from './context/BalanceContext';
import { Character, Weapon, Skill } from './types';

const initialCharacter: Character = {
  id: 1,
  name: 'Guerriero',
  health: [100, 100],
  strength: [10, 10],
  agility: [5, 5],
  intelligence: [5, 5],
  luck: [5, 5],
  weaponId: 1,
  armor: { defense: [10, 10] },
  equippedSkills: [],
};

const weapons: Weapon[] = [
  {
    id: 1,
    name: 'Spada',
    type: 'melee', // Corretto da 'Melee' a 'melee'
    attacks: 1,
    damage: [10, 20],
    strScaling: 1,
    agiScaling: 0.5,
    intScaling: 0,
  },
];

const skills: Skill[] = [
  {
    id: 1,
    name: 'Colpo Potente',
    damage: 1.5,
    cooldown: 3,
    description: 'Un potente colpo che infligge danni elevati', // Aggiunto
    type: 'attack', // Aggiunto
  },
];

export const App: React.FC = () => {
  const [character, setCharacter] = useState<Character>(initialCharacter);
  const [tab, setTab] = useState<'characters' | 'balance'>('characters');

  return (
    <BalanceProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-blue-700">Simulatore di Combattimento</h1>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setTab('characters')}
              className={`px-4 py-2 rounded-lg ${tab === 'characters' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'} hover:bg-blue-200 transition-colors duration-200`}
            >
              Personaggi
            </button>
            <button
              onClick={() => setTab('balance')}
              className={`px-4 py-2 rounded-lg ${tab === 'balance' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'} hover:bg-blue-200 transition-colors duration-200`}
            >
              Bilanciamento
            </button>
          </div>

          {tab === 'characters' && (
            <CharacterPanel
              character={character}
              setCharacter={setCharacter}
              title="Personaggio 1"
              weapons={weapons}
              skills={skills}
            />
          )}
          {tab === 'balance' && <BalanceTab />}
        </div>
      </div>
    </BalanceProvider>
  );
};