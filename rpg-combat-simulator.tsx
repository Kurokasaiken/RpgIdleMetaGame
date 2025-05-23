import React, { useState, useCallback } from 'react';
import { Swords, Database, BarChart3, Plus, Wind, Sword, Mountain, Zap } from 'lucide-react';
import { combatEngine } from './combat-engine';
import { initialWeapons, initialSkills, getAvailableSkills, getSkillSlots, randomFromRange } from './gameData';

// Import components
const CharacterPanel = ({ character, setCharacter, title, weapons, skills, combatOptions }) => {
  const weapon = weapons.find(w => w.id === character.weaponId);
  const availableSkills = getAvailableSkills(character, weapons, skills);
  const maxSkillSlots = getSkillSlots(character.intelligence);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Swords className="w-5 h-5" />
        {title}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={character.name}
            onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Health</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={character.health[0]}
                onChange={(e) => setCharacter(prev => ({
                  ...prev,
                  health: [parseInt(e.target.value) || 0, prev.health[1]]
                }))}
                className="w-full p-2 border rounded text-sm"
                placeholder="Min"
              />
              <input
                type="number"
                value={character.health[1]}
                onChange={(e) => setCharacter(prev => ({
                  ...prev,
                  health: [prev.health[0], parseInt(e.target.value) || 0]
                }))}
                className="w-full p-2 border rounded text-sm"
                placeholder="Max"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Strength</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={character.strength[0]}
                onChange={(e) => setCharacter(prev => ({
                  ...prev,
                  strength: [parseInt(e.target.value) || 0, prev.strength[1]]
                }))}
                className="w-full p-2 border rounded text-sm"
              />
              <input
                type="number"
                value={character.strength[1]}
                onChange={(e) => setCharacter(prev => ({
                  ...prev,
                  strength: [prev.strength[0], parseInt(e.target.value) || 0]
                }))}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {combatOptions.hitChance && (
            <div>
              <label className="block text-sm font-medium mb-1">Agility</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={character.agility[0]}
                  onChange={(e) => setCharacter(prev => ({
                    ...prev,
                    agility: [parseInt(e.target.value) || 0, prev.agility[1]]
                  }))}
                  className="w-full p-2 border rounded text-sm"
                />
                <input
                  type="number"
                  value={character.agility[1]}
                  onChange={(e) => setCharacter(prev => ({
                    ...prev,
                    agility: [prev.agility[0], parseInt(e.target.value) || 0]
                  }))}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Intelligence</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={character.intelligence[0]}
                onChange={(e) => setCharacter(prev => ({
                  ...prev,
                  intelligence: [parseInt(e.target.value) || 0, prev.intelligence[1]]
                }))}
                className="w-full p-2 border rounded text-sm"
              />
              <input
                type="number"
                value={character.intelligence[1]}
                onChange={(e) => setCharacter(prev => ({
                  ...prev,
                  intelligence: [prev.intelligence[0], parseInt(e.target.value) || 0]
                }))}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
        </div>

        {combatOptions.critical && (
          <div>
            <label className="block text-sm font-medium mb-1">Luck</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={character.luck[0]}
                onChange={(e) => setCharacter(prev => ({
                  ...prev,
                  luck: [parseInt(e.target.value) || 0, prev.luck[1]]
                }))}
                className="w-full p-2 border rounded text-sm"
              />
              <input
                type="number"
                value={character.luck[1]}
                onChange={(e) => setCharacter(prev => ({
                  ...prev,
                  luck: [prev.luck[0], parseInt(e.target.value) || 0]
                }))}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Sword className="w-4 h-4" />
            Weapon
          </h4>
          <select
            value={character.weaponId}
            onChange={(e) => setCharacter(prev => ({ ...prev, weaponId: parseInt(e.target.value) }))}
            className="w-full p-2 border rounded"
          >
            {weapons.map(weapon => (
              <option key={weapon.id} value={weapon.id}>
                {weapon.name} ({weapon.type} - {weapon.attacks}x)
              </option>
            ))}
          </select>
          {weapon && (
            <div className="mt-2 text-sm text-gray-600">
              <div>Damage: {weapon.damage[0]}-{weapon.damage[1]}</div>
              <div>Scaling: STR×{weapon.strScaling} AGI×{weapon.agiScaling} INT×{weapon.intScaling}</div>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Armor Defense</h4>
          <div className="flex gap-1">
            <input
              type="number"
              value={character.armor.defense[0]}
              onChange={(e) => setCharacter(prev => ({
                ...prev,
                armor: {
                  ...prev.armor,
                  defense: [parseInt(e.target.value) || 0, prev.armor.defense[1]]
                }
              }))}
              className="w-full p-2 border rounded text-sm"
            />
            <input
              type="number"
              value={character.armor.defense[1]}
              onChange={(e) => setCharacter(prev => ({
                ...prev,
                armor: {
                  ...prev.armor,
                  defense: [prev.armor.defense[0], parseInt(e.target.value) || 0]
                }
              }))}
              className="w-full p-2 border rounded text-sm"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Equipped Skills ({character.equippedSkills.length}/{maxSkillSlots})
          </h4>
          <div className="space-y-2">
            {availableSkills.map(skill => (
              <label key={skill.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={character.equippedSkills.includes(skill.id)}
                  onChange={(e) => {
                    if (e.target.checked && character.equippedSkills.length < maxSkillSlots) {
                      setCharacter(prev => ({
                        ...prev,
                        equippedSkills: [...prev.equippedSkills, skill.id]
                      }));
                    } else if (!e.target.checked) {
                      setCharacter(prev => ({
                        ...prev,
                        equippedSkills: prev.equippedSkills.filter(id => id !== skill.id)
                      }));
                    }
                  }}
                  disabled={!character.equippedSkills.includes(skill.id) && character.equippedSkills.length >= maxSkillSlots}
                />
                <span className="text-sm">
                  {skill.name} ({Math.floor(skill.damage * 100)}% damage, CD: {skill.cooldown})
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DatabaseTab = ({ weapons, skills, setWeapons }) => {
  const [showWeaponCreator, setShowWeaponCreator] = useState(false);
  const [newWeapon, setNewWeapon] = useState({
    name: '',
    type: 'light',
    damage: [10, 15],
    attacks: 1,
    damageMultiplier: 1.0,
    strScaling: 1.0,
    agiScaling: 0.0,
    intScaling: 0.0
  });

  const iconMap = { light: Wind, medium: Sword, heavy: Mountain };

  const createWeapon = () => {
    const weapon = {
      ...newWeapon,
      id: Math.max(...weapons.map(w => w.id)) + 1,
      icon: iconMap[newWeapon.type]
    };
    setWeapons(prev => [...prev, weapon]);
    setNewWeapon({
      name: '',
      type: 'light',
      damage: [10, 15],
      attacks: 1,
      damageMultiplier: 1.0,
      strScaling: 1.0,
      agiScaling: 0.0,
      intScaling: 0.0
    });
    setShowWeaponCreator(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sword className="w-5 h-5" />
            Weapon Database
          </h3>
          <button
            onClick={() => setShowWeaponCreator(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Weapon
          </button>
        </div>

        {showWeaponCreator && (
          <div className="mb-6 p-4 border-2 border-green-200 rounded-lg bg-green-50">
            <h4 className="font-bold mb-3">Create New Weapon</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newWeapon.name}
                  onChange={(e) => setNewWeapon(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newWeapon.type}
                  onChange={(e) => setNewWeapon(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Damage Min-Max</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={newWeapon.damage[0]}
                    onChange={(e) => setNewWeapon(prev => ({ 
                      ...prev, 
                      damage: [parseInt(e.target.value) || 0, prev.damage[1]] 
                    }))}
                    className="w-full p-2 border rounded text-sm"
                  />
                  <input
                    type="number"
                    value={newWeapon.damage[1]}
                    onChange={(e) => setNewWeapon(prev => ({ 
                      ...prev, 
                      damage: [prev.damage[0], parseInt(e.target.value) || 0] 
                    }))}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Attacks</label>
                <input
                  type="number"
                  value={newWeapon.attacks}
                  onChange={(e) => setNewWeapon(prev => ({ ...prev, attacks: parseInt(e.target.value) || 1 }))}
                  className="w-full p-2 border rounded"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">STR Scaling</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeapon.strScaling}
                  onChange={(e) => setNewWeapon(prev => ({ ...prev, strScaling: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">AGI Scaling</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeapon.agiScaling}
                  onChange={(e) => setNewWeapon(prev => ({ ...prev, agiScaling: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">INT Scaling</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeapon.intScaling}
                  onChange={(e) => setNewWeapon(prev => ({ ...prev, intScaling: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Damage Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeapon.damageMultiplier}
                  onChange={(e) => setNewWeapon(prev => ({ ...prev, damageMultiplier: parseFloat(e.target.value) || 1 }))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={createWeapon}
                disabled={!newWeapon.name.trim()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
              >
                Create
              </button>
              <button
                onClick={() => setShowWeaponCreator(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {weapons.map(weapon => {
            const IconComponent = weapon.icon;
            return (
              <div key={weapon.id} className="flex items-center gap-4 p-3 border rounded">
                <IconComponent className="w-8 h-8 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-medium">{weapon.name}</h4>
                  <p className="text-sm text-gray-600">
                    {weapon.type} - {weapon.attacks}x attacks - {weapon.damage[0]}-{weapon.damage[1]} damage
                  </p>
                  <p className="text-xs text-gray-500">
                    STR×{weapon.strScaling} AGI×{weapon.agiScaling} INT×{weapon.intScaling}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Skills Database
        </h3>
        <div className="space-y-4">
          {skills.map(skill => (
            <div key={skill.id} className="flex items-center gap-4 p-3 border rounded">
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                <Zap className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{skill.name}</h4>
                <p className="text-sm text-gray-600">{skill.description}</p>
                <p className="text-xs text-gray-500">
                  {Math.floor(skill.damage * 100)}% damage - Cooldown: {skill.cooldown} turns
                </p>
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                {skill.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SimulationTab = ({ 
  simulationResults, 
  isSimulating, 
  runMassSimulation, 
  character1, 
  character2 
}) => {
  const TurnDistributionChart = ({ turnCounts }) => {
    const buckets = {};
    turnCounts.forEach(turns => {
      const bucket = Math.floor(turns / 5) * 5;
      buckets[bucket] = (buckets[bucket] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(buckets));
    const sortedBuckets = Object.entries(buckets).sort(([a], [b]) => parseInt(a) - parseInt(b));

    return (
      <div className="space-y-1">
        {sortedBuckets.map(([bucket, count]) => {
          const percentage = (count / turnCounts.length) * 100;
          const barWidth = (count / maxCount) * 100;
          
          return (
            <div key={bucket} className="flex items-center gap-2 text-xs">
              <div className="w-12 text-right">{bucket}-{parseInt(bucket) + 4}:</div>
              <div className="flex-1 bg-gray-200 rounded h-4 relative">
                <div 
                  className="bg-blue-500 h-full rounded" 
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className="w-12 text-left">{percentage.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Mass Simulation
        </h3>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => runMassSimulation(100)}
            disabled={isSimulating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Run 100 Fights
          </button>
          <button
            onClick={() => runMassSimulation(1000)}
            disabled={isSimulating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Run 1000 Fights
          </button>
          <button
            onClick={() => runMassSimulation(10000)}
            disabled={isSimulating}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Run 10000 Fights
          </button>
        </div>

        {isSimulating && (
          <div className="bg-blue-100 border border-blue-300 rounded p-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-blue-700">Running simulation...</span>
            </div>
          </div>
        )}

        {simulationResults && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded border">
                <h4 className="font-bold text-green-800">{character1.name}</h4>
                <div className="text-2xl font-bold text-green-600">
                  {simulationResults.char1WinRate.toFixed(1)}%
                </div>
                <div className="text-sm text-green-700">
                  {simulationResults.char1Wins} wins
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded border">
                <h4 className="font-bold text-red-800">{character2.name}</h4>
                <div className="text-2xl font-bold text-red-600">
                  {simulationResults.char2WinRate.toFixed(1)}%
                </div>
                <div className="text-sm text-red-700">
                  {simulationResults.char2Wins} wins
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-bold text-gray-800">Draws</h4>
                <div className="text-2xl font-bold text-gray-600">
                  {simulationResults.drawRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-700">
                  {simulationResults.draws} draws
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-bold mb-2">Combat Statistics</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Average Combat Length:</span> {simulationResults.avgTurns.toFixed(1)} turns
                </div>
                <div>
                  <span className="font-medium">Total Simulations:</span> {simulationResults.iterations.toLocaleString()}
                </div>
              </div>
            </div>

            {simulationResults.balanceIssues.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
                <h4 className="font-bold mb-2 text-yellow-800">Balance Issues Detected</h4>
                <ul className="space-y-1">
                  {simulationResults.balanceIssues.map((issue, index) => (
                    <li key={index} className="text-sm text-yellow-700">• {issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {simulationResults.balanceIssues.length === 0 && (
              <div className="bg-green-50 border border-green-300 rounded p-4">
                <h4 className="font-bold mb-2 text-green-800">Combat Balance Looks Good!</h4>
                <p className="text-sm text-green-700">
                  No major balance issues detected. Both characters have a reasonable chance of winning.
                </p>
              </div>
            )}

            <div className="bg-white border rounded p-4">
              <h4 className="font-bold mb-2">Turn Distribution Analysis</h4>
              <div className="text-sm text-gray-600 mb-2">
                Combat length distribution (turns):
              </div>
              <TurnDistributionChart turnCounts={simulationResults.turnDistribution} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Combat Engine inline (simplified version)
const combatEngineInline = {
  calculateDamage(attacker, weapon, skillMultiplier = 1) {
    const baseDamage = Math.floor(Math.random() * (weapon.damage[1] - weapon.damage[0] + 1)) + weapon.damage[0];
    const strBonus = (Array.isArray(attacker.strength) ? 
      Math.floor(Math.random() * (attacker.strength[1] - attacker.strength[0] + 1)) + attacker.strength[0] : 
      attacker.strength) * weapon.strScaling;
    const agiBonus = (Array.isArray(attacker.agility) ? 
      Math.floor(Math.random() * (attacker.agility[1] - attacker.agility[0] + 1)) + attacker.agility[0] : 
      attacker.agility) * weapon.agiScaling;
    const intBonus = (Array.isArray(attacker.intelligence) ? 
      Math.floor(Math.random() * (attacker.intelligence[1] - attacker.intelligence[0] + 1)) + attacker.intelligence[0] : 
      attacker.intelligence) * weapon.intScaling;
    
    return Math.floor((baseDamage + strBonus + agiBonus + intBonus) * weapon.damageMultiplier * skillMultiplier);
  },

  async runMassSimulation(char1, char2, weapons, skills, combatOptions, iterations = 1000) {
    let char1Wins = 0;
    let char2Wins = 0;
    let draws = 0;
    let totalTurns = 0;
    const turnCounts = [];

    for (let i = 0; i < iterations; i++) {
      const result = this.runSingleCombat(char1, char2, weapons, skills, combatOptions);
      
      if (result.winner === char1.name) char1Wins++;
      else if (result.winner === char2.name) char2Wins++;
      else draws++;
      
      totalTurns += result.turns;
      turnCounts.push(result.turns);
      
      if (i % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }

    const avgTurns = totalTurns / iterations;
    const char1WinRate = (char1Wins / iterations) * 100;
    const char2WinRate = (char2Wins / iterations) * 100;
    const drawRate = (draws / iterations) * 100;

    const balanceIssues = [];
    if (char1WinRate > 65) balanceIssues.push(`${char1.name} too strong (${char1WinRate.toFixed(1)}% win rate)`);
    if (char2WinRate > 65) balanceIssues.push(`${char2.name} too strong (${char2WinRate.toFixed(1)}% win rate)`);
    if (avgTurns > 15) balanceIssues.push(`Combat too slow (${avgTurns.toFixed(1)} turns average)`);
    if (avgTurns < 3) balanceIssues.push(`Combat too fast (${avgTurns.toFixed(1)} turns average)`);

    return {
      iterations,
      char1Wins,
      char2Wins,
      draws,
      char1WinRate,
      char2WinRate,
      drawRate,
      avgTurns,
      balanceIssues,
      turnDistribution: turnCounts
    };
  },

  runSingleCombat(char1, char2, weapons, skills, combatOptions) {
    const weapon1 = weapons.find(w => w.id === char1.weaponId);
    const weapon2 = weapons.find(w => w.id === char2.weaponId);
    
    let fighter1 = { 
      ...char1, 
      currentHealth: Array.isArray(char1.health) ? 
        Math.floor(Math.random() * (char1.health[1] - char1.health[0] + 1)) + char1.health[0] : 
        char1.health 
    };
    let fighter2 = { 
      ...char2, 
      currentHealth: Array.isArray(char2.health) ? 
        Math.floor(Math.