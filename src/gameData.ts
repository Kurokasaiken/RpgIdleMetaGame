import { Wind, Sword, Mountain, Zap } from 'lucide-react';
import { Character, Weapon, Skill } from './types';

export const initialWeapons: Weapon[] = [
  {
    id: 1,
    name: "Pugnale Arrugginito",
    type: "light",
    damage: [8, 12],
    attacks: 2,
    damageMultiplier: 1.0,
    strScaling: 0.5,
    agiScaling: 1.2,
    intScaling: 0.0,
    icon: Wind
  },
  {
    id: 2,
    name: "Spada di Ferro",
    type: "medium",
    damage: [12, 18],
    attacks: 1,
    damageMultiplier: 1.1,
    strScaling: 1.0,
    agiScaling: 0.3,
    intScaling: 0.0,
    icon: Sword
  },
  {
    id: 3,
    name: "Spadone d'Acciaio",
    type: "heavy",
    damage: [20, 28],
    attacks: 1,
    damageMultiplier: 1.3,
    strScaling: 1.5,
    agiScaling: 0.0,
    intScaling: 0.0,
    icon: Mountain
  },
  {
    id: 4,
    name: "Lama di Fuoco",
    type: "medium",
    damage: [15, 22],
    attacks: 1,
    damageMultiplier: 1.2,
    strScaling: 0.8,
    agiScaling: 0.2,
    intScaling: 0.7,
    icon: Sword
  },
  {
    id: 5,
    name: "Doppio Pugnale",
    type: "light",
    damage: [6, 10],
    attacks: 3,
    damageMultiplier: 0.9,
    strScaling: 0.4,
    agiScaling: 1.0,
    intScaling: 0.0,
    icon: Wind
  }
];

export const initialSkills: Skill[] = [
  {
    id: 1,
    name: "Colpo Potente",
    description: "Un colpo poderoso che infligge danno extra",
    type: "physical",
    damage: 1.5,
    cooldown: 3,
    requirements: { minStats: { strength: 15 } }
  },
  {
    id: 2,
    name: "Colpo Rapido",
    description: "Attacco veloce con danno ridotto ma cooldown inferiore",
    type: "physical",
    damage: 1.2,
    cooldown: 2,
    requirements: { minStats: { agility: 12 } }
  },
  {
    id: 3,
    name: "Palla di Fuoco",
    description: "Attacco magico di fuoco",
    type: "magical",
    damage: 1.8,
    cooldown: 4,
    requirements: { minStats: { intelligence: 20 } }
  },
  {
    id: 4,
    name: "Scheggia di Ghiaccio",
    description: "Proiettile di ghiaccio affilato",
    type: "magical",
    damage: 1.4,
    cooldown: 3,
    requirements: { minStats: { intelligence: 15 } }
  },
  {
    id: 5,
    name: "Furia Berserker",
    description: "Aumenta il danno ma riduce la difesa",
    type: "passive",
    damage: 1.3,
    cooldown: 5,
    requirements: { minStats: { strength: 18 } }
  }
];

export const getAvailableSkills = (character: Character, weapons: Weapon[], skills: Skill[]): Skill[] => {
  // Trova l'arma equipaggiata dal personaggio
  const weapon = weapons.find(w => w.id === character.weaponId);
  if (!weapon || !weapon.skillIds) return [];

  // Restituisce solo le skill correlate all'arma
  return skills.filter(skill => weapon.skillIds && weapon.skillIds.includes(skill.id));
};

export const getSkillSlots = (intelligence: [number, number]): number => {
  const maxInt = intelligence[1];
  if (maxInt >= 25) return 4;
  if (maxInt >= 20) return 3;
  if (maxInt >= 15) return 2;
  return 1;
};

export const randomFromRange = (range: [number, number]): number => {
  return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
};