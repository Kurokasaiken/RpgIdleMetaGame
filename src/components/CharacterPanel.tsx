import React from 'react';
import { Swords, Sword, Zap } from 'lucide-react';
import { Character, Weapon, Skill } from '../types';
import { getAvailableSkills, getSkillSlots } from '../gameData';
import { useBalance } from '../context/BalanceContext'; // Importa useBalance

interface CharacterPanelProps {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  title: string;
  weapons: Weapon[];
  skills: Skill[];
}

export const CharacterPanel: React.FC<CharacterPanelProps> = ({
  character,
  setCharacter,
  title,
  weapons,
  skills,
}) => {
  const { balanceParams } = useBalance(); // Accedi a balanceParams
  const weapon = weapons.find((w) => w.id === character.weaponId);
  const availableSkills = getAvailableSkills(character, weapons, skills);
  const maxSkillSlots = 4; // getSkillSlots(character.intelligence);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Swords className="w-5 h-5" />
        {title}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            type="text"
            value={character.name}
            onChange={(e) => setCharacter((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Salute</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={character.health[0]}
                onChange={(e) =>
                  setCharacter((prev) => ({
                    ...prev,
                    health: [parseInt(e.target.value) || 0, prev.health[1]],
                  }))
                }
                className="w-full p-2 border rounded text-sm"
                placeholder="Min"
              />
              <input
                type="number"
                value={character.health[1]}
                onChange={(e) =>
                  setCharacter((prev) => ({
                    ...prev,
                    health: [prev.health[0], parseInt(e.target.value) || 0],
                  }))
                }
                className="w-full p-2 border rounded text-sm"
                placeholder="Max"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Forza</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={character.strength[0]}
                onChange={(e) =>
                  setCharacter((prev) => ({
                    ...prev,
                    strength: [parseInt(e.target.value) || 0, prev.strength[1]],
                  }))
                }
                className="w-full p-2 border rounded text-sm"
              />
              <input
                type="number"
                value={character.strength[1]}
                onChange={(e) =>
                  setCharacter((prev) => ({
                    ...prev,
                    strength: [prev.strength[0], parseInt(e.target.value) || 0],
                  }))
                }
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {balanceParams.modules.hitChance && (
            <div>
              <label className="block text-sm font-medium mb-1">Agilità</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={character.agility[0]}
                  onChange={(e) =>
                    setCharacter((prev) => ({
                      ...prev,
                      agility: [parseInt(e.target.value) || 0, prev.agility[1]],
                    }))
                  }
                  className="w-full p-2 border rounded text-sm"
                />
                <input
                  type="number"
                  value={character.agility[1]}
                  onChange={(e) =>
                    setCharacter((prev) => ({
                      ...prev,
                      agility: [prev.agility[0], parseInt(e.target.value) || 0],
                    }))
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Intelligenza</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={character.intelligence[0]}
                onChange={(e) =>
                  setCharacter((prev) => ({
                    ...prev,
                    intelligence: [parseInt(e.target.value) || 0, prev.intelligence[1]],
                  }))
                }
                className="w-full p-2 border rounded text-sm"
              />
              <input
                type="number"
                value={character.intelligence[1]}
                onChange={(e) =>
                  setCharacter((prev) => ({
                    ...prev,
                    intelligence: [prev.intelligence[0], parseInt(e.target.value) || 0],
                  }))
                }
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
        </div>

        {balanceParams.modules.critical && (
          <div>
            <label className="block text-sm font-medium mb-1">Fortuna</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={character.luck[0]}
                onChange={(e) =>
                  setCharacter((prev) => ({
                    ...prev,
                    luck: [parseInt(e.target.value) || 0, prev.luck[1]],
                  }))
                }
                className="w-full p-2 border rounded text-sm"
              />
              <input
                type="number"
                value={character.luck[1]}
                onChange={(e) =>
                  setCharacter((prev) => ({
                    ...prev,
                    luck: [prev.luck[0], parseInt(e.target.value) || 0],
                  }))
                }
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Sword className="w-4 h-4" />
            Arma
          </h4>
          <select
            value={character.weaponId}
            onChange={(e) =>
              setCharacter((prev) => ({ ...prev, weaponId: parseInt(e.target.value) }))
            }
            className="w-full p-2 border rounded"
          >
            {weapons.map((weapon) => (
              <option key={weapon.id} value={weapon.id}>
                {weapon.name} ({weapon.type} - {weapon.attacks}x)
              </option>
            ))}
          </select>
          {weapon && (
            <div className="mt-2 text-sm text-gray-600">
              <div>
                Danno: {weapon.damage[0]}-{weapon.damage[1]}
              </div>
              <div>
                Scaling: STR×{weapon.strScaling} AGI×{weapon.agiScaling} INT×
                {weapon.intScaling}
              </div>
            </div>
          )}
        </div>

        {balanceParams.modules.armor && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Difesa Armatura</h4>
            <div className="flex gap-1">
              <input
                type="number"
                value={character.armor.defense[0]}
                onChange={(e) =>
                  setCharacter((prev) => ({
                    ...prev,
                    armor: {
                      ...prev.armor,
                      defense: [parseInt(e.target.value) || 0, prev.armor.defense[1]],
                    },
                  }))
                }
                className="w-full p-2 border rounded text-sm"
              />
              <input
                type="number"
                value={character.armor.defense[1]}
                onChange={(e) =>
                  setCharacter((prev) => ({
                    ...prev,
                    armor: {
                      ...prev.armor,
                      defense: [prev.armor.defense[0], parseInt(e.target.value) || 0],
                    },
                  }))
                }
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
        )}

        {balanceParams.modules.cooldowns && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Abilità Equipaggiate ({character.equippedSkills.length}/{maxSkillSlots})
            </h4>
            <div className="space-y-2">
              {availableSkills.map((skill) => (
                <label key={skill.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={character.equippedSkills.includes(skill.id)}
                    onChange={(e) => {
                      if (
                        e.target.checked &&
                        character.equippedSkills.length < maxSkillSlots
                      ) {
                        setCharacter((prev) => ({
                          ...prev,
                          equippedSkills: [...prev.equippedSkills, skill.id],
                        }));
                      } else if (!e.target.checked) {
                        setCharacter((prev) => ({
                          ...prev,
                          equippedSkills: prev.equippedSkills.filter(
                            (id) => id !== skill.id,
                          ),
                        }));
                      }
                    }}
                    disabled={
                      !character.equippedSkills.includes(skill.id) &&
                      character.equippedSkills.length >= maxSkillSlots
                    }
                  />
                  <span className="text-sm">
                    {skill.name} ({Math.floor(skill.damage * 100)}% danno, CD:{' '}
                    {skill.cooldown})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};