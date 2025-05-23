import { Wind, Sword, Mountain, Zap } from 'lucide-react';

export interface Weapon {
  id: number;
  name: string;
  type: 'light' | 'medium' | 'heavy';
  damage: [number, number];
  attacks: number;
  damageMultiplier: number;
  strScaling: number;
  agiScaling: number;
  intScaling: number;
  icon: any;
}

export interface Skill {
  id: number;
  name: string;
  description: string;
  type: 'weapon' | 'magic' | 'passive';
  damage: number;
  cooldown: number;
  requirements?: {
    weaponType?: string;
    minInt?: number;
    minStr?: number;
    minAgi?: number;
  };
}

export interface Character {
  name: string;
  health: [number, number];
  strength: [number, number];
  agility: [number, number];
  intelligence: [number, number];
  luck: [number, number];
  weaponId: number;
  armor: {
    defense: [number, number];
  };
  equippedSkills: number[];
}

export interface CombatOptions {
  hitChance: boolean;
  critical: boolean;
  armor: boolean;
  skills: boolean;
}

export const initialWeapons: Weapon[] = [
  {
    id: 1,
    name: "Rusty Dagger",
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
    name: "Iron Sword",
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
    name: "Steel Greatsword",
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
    name: "Flame Blade",
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
    name: "Twin Daggers",
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
    name: "Power Strike",
    description: "A mighty blow that deals extra damage",
    type: "weapon",
    damage: 1.5,
    cooldown: 3,
    requirements: { minStr: 15 }
  },
  {
    id: 2,
    name: "Quick Strike",
    description: "Fast attack with reduced damage but lower cooldown",
    type: "weapon",
    damage: 1.2,
    cooldown: 2,
    requirements: { minAgi: 12 }
  },
  {
    id: 3,
    name: "Fireball",
    description: "Magical fire attack",
    type: "magic",
    damage: 1.8,
    cooldown: 4,
    requirements: { minInt: 20 }
  },
  {
    id: 4,
    name: "Ice Shard",
    description: "Sharp ice projectile",
    type: "magic",
    damage: 1.4,
    cooldown: 3,
    requirements: { minInt: 15 }
  },
  {
    id: 5,
    name: "Berserker Rage",
    description: "Increases damage but reduces defense",
    type: "passive",
    damage: 1.3,
    cooldown: 5,
    requirements: { minStr: 18 }
  },
  {
    id: 6,
    name: "Shadow Step",
    description: "Quick movement that increases hit chance",
    type: "weapon",
    damage: 1.1,
    cooldown: 2,
    requirements: { minAgi: 16, weaponType: "light" }
  }
];

export const getAvailableSkills = (character: Character, weapons: Weapon[], skills: Skill[]): Skill[] => {
  const weapon = weapons.find(w => w.id === character.weaponId);
  if (!weapon) return [];

  return skills.filter(skill => {
    if (!skill.requirements) return true;
    
    const { weaponType, minStr, minInt, minAgi } = skill.requirements;
    
    if (weaponType && weapon.type !== weaponType) return false;
    if (minStr && character.strength[1] < minStr) return false;
    if (minInt && character.intelligence[1] < minInt) return false;
    if (minAgi && character.agility[1] < minAgi) return false;
    
    return true;
  });
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