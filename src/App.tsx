import React, { useState } from 'react';
import { Swords, Database, BarChart3 } from 'lucide-react';
import { CharacterPanel } from './components/CharacterPanel';
import { DatabaseTab } from './components/DatabaseTab';
import { SimulationTab } from './components/SimulationTab';
import { combatEngine } from './combat-engine';
import { initialWeapons, initialSkills, getAvailableSkills, getSkillSlots } from './gameData';
import { Character, CombatOptions, SimulationResults } from './types';

const defaultCharacter: Omit<Character, 'id' | 'name'> = {
  health: [100, 150],
  strength: [10, 15],
  agility: [10, 15],
  intelligence: [10, 15],
  luck: [5, 10],
  weaponId: 1,
  equippedSkills: [],
  armor: { defense: [5, 10] }
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'characters' | 'database' | 'simulation'>('characters');
  const [character1, setCharacter1] = useState<Character>({ id: 1, name: 'Guerriero', ...defaultCharacter });
  const [character2, setCharacter2] = useState<Character>({ id: 2, name: 'Mago', ...defaultCharacter, weaponId: 4 });
  const [weapons, setWeapons] = useState(initialWeapons);
  const [combatOptions, setCombatOptions] = useState<CombatOptions>({
    hitChance: true,
    critical: true,
    skills: true,
    armor: true,
    maxTurns: 50
  });
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runMassSimulation = async (iterations: number) => {
    setIsSimulating(true);
    try {
      const results = await combatEngine.runMassSimulation(character1, character2, weapons, initialSkills, combatOptions, iterations);
      setSimulationResults(results);
    } catch (error) {
      console.error('Errore nella simulazione:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Simulatore di Combattimento RPG</h1>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'characters' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <Swords className="w-5 h-5" />
            Personaggi
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'database' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <Database className="w-5 h-5" />
            Database
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'simulation' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <BarChart3 className="w-5 h-5" />
            Simulazione
          </button>
        </div>

        {activeTab === 'characters' && (
          <div className="grid md:grid-cols-2 gap-6">
            <CharacterPanel
              character={character1}
              setCharacter={setCharacter1}
              title="Personaggio 1"
              weapons={weapons}
              skills={initialSkills}
              combatOptions={combatOptions}
            />
            <CharacterPanel
              character={character2}
              setCharacter={setCharacter2}
              title="Personaggio 2"
              weapons={weapons}
              skills={initialSkills}
              combatOptions={combatOptions}
            />
          </div>
        )}

        {activeTab === 'database' && (
          <DatabaseTab
            weapons={weapons}
            skills={initialSkills}
            setWeapons={setWeapons}
          />
        )}

        {activeTab === 'simulation' && (
          <SimulationTab
            simulationResults={simulationResults}
            isSimulating={isSimulating}
            runMassSimulation={runMassSimulation}
            character1={character1}
            character2={character2}
          />
        )}
      </div>
    </div>
  );
};