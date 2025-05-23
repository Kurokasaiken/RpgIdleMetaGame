import React, { useState } from 'react';
import { Sword, Zap, Plus, Wind, Mountain } from 'lucide-react';
import { Weapon, Skill } from '../gameData';

interface DatabaseTabProps {
  weapons: Weapon[];
  skills: Skill[];
  setWeapons: React.Dispatch<React.SetStateAction<Weapon[]>>;
}

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ weapons, skills, setWeapons }) => {
  const [showWeaponCreator, setShowWeaponCreator] = useState(false);
  const [newWeapon, setNewWeapon] = useState({
    name: '',
    type: 'light' as 'light' | 'medium' | 'heavy',
    damage: [10, 15] as [number, number],
    attacks: 1,
    damageMultiplier: 1.0,
    strScaling: 1.0,
    agiScaling: 0.0,
    intScaling: 0.0
  });

  const iconMap = { light: Wind, medium: Sword, heavy: Mountain };

  const createWeapon = () => {
    const weapon: Weapon = {
      ...newWeapon,
      id: Math.max(...weapons.map(w => w.id), 0) + 1,
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
            Database Armi
          </h3>
          <button
            onClick={() => setShowWeaponCreator(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Crea Arma
          </button>
        </div>

        {showWeaponCreator && (
          <div className="mb-6 p-4 border-2 border-green-200 rounded-lg bg-green-50">
            <h4 className="font-bold mb-3">Crea Nuova Arma</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  value={newWeapon.name}
                  onChange={(e) => setNewWeapon(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={newWeapon.type}
                  onChange={(e) => setNewWeapon(prev => ({ ...prev, type: e.target.value as 'light' | 'medium' | 'heavy' }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="light">Leggera</option>
                  <option value="medium">Media</option>
                  <option value="heavy">Pesante</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Danno Min-Max</label>
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
                <label className="block text-sm font-medium mb-1">Attacchi</label>
                <input
                  type="number"
                  value={newWeapon.attacks}
                  onChange={(e) => setNewWeapon(prev => ({ ...prev, attacks: parseInt(e.target.value) || 1 }))}
                  className="w-full p-2 border rounded"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Scaling STR</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeapon.strScaling}
                  onChange={(e) => setNewWeapon(prev => ({ ...prev, strScaling: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Scaling AGI</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeapon.agiScaling}
                  onChange={(e) => setNewWeapon(prev => ({ ...prev, agiScaling: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Scaling INT</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeapon.intScaling}
                  onChange={(e) => setNewWeapon(prev => ({ ...prev, intScaling: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Moltiplicatore Danno</label>
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
                Crea
              </button>
              <button
                onClick={() => setShowWeaponCreator(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Annulla
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
                    {weapon.type} - {weapon.attacks}x attacchi - {weapon.damage[0]}-{weapon.damage[1]} danno
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
          Database Abilità
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
                  {Math.floor(skill.damage * 100)}% danno - Cooldown: {skill.cooldown} turni
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