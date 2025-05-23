import { Wind, Sword, Mountain } from 'lucide-react';

export interface StatRange {
  0: number; // min value
  1: number; // max value
}

export interface Character {
  id: number;
  name: string;
  health: StatRange;
  strength: StatRange;
  agility: StatRange;
  intelligence: StatRange;
  luck: StatRange;
  weaponId: number;
  equippedSkills: number[];
  armor: {
    defense: StatRange;
  };
}

export interface Weapon {
  id: number;
  name: string;
  type: WeaponType;
  damage: StatRange;
  attacks: number;
  damageMultiplier: number;
  strScaling: number;
  agiScaling: number;
  intScaling: number;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Skill {
  id: number;
  name: string;
  description: string;
  type: SkillType;
  damage: number;
  cooldown: number;
  requirements?: {
    weaponTypes?: WeaponType[];
    minStats?: Partial<{
      strength: number;
      agility: number;
      intelligence: number;
    }>;
  };
}

export interface CombatOptions {
  hitChance: boolean;
  critical: boolean;
  skills: boolean;
  armor: boolean;
  maxTurns: number;
}

export interface CombatResult {
  winner: string | null;
  turns: number;
  log: string[];
  finalStats: {
    char1Health: number;
    char2Health: number;
  };
}

export interface SimulationResults {
  iterations: number;
  char1Wins: number;
  char2Wins: number;
  draws: number;
  char1WinRate: number;
  char2WinRate: number;
  drawRate: number;
  avgTurns: number;
  balanceIssues: string[];
  turnDistribution: number[];
}

export type WeaponType = 'light' | 'medium' | 'heavy';
export type SkillType = 'physical' | 'magical' | 'utility' | 'passive';

export const DEFAULT_COMBAT_OPTIONS: CombatOptions = {
  hitChance: true,
  critical: true,
  skills: true,
  armor: true,
  maxTurns: 50
};

export const STAT_LIMITS = {
  min: 1,
  max: 100,
  health: {
    min: 10,
    max: 500
  },
  damage: {
    min: 1,
    max: 100
  }
} as const;

export const isValidStatRange = (stat: StatRange): boolean => {
  return stat[0] >= STAT_LIMITS.min && 
         stat[1] >= stat[0] && 
         stat[1] <= STAT_LIMITS.max;
};

export const isValidHealthRange = (health: StatRange): boolean => {
  return health[0] >= STAT_LIMITS.health.min && 
         health[1] >= health[0] && 
         health[1] <= STAT_LIMITS.health.max;
};

export const isValidCharacter = (character: Character): boolean => {
  return character.name.trim().length > 0 &&
         isValidHealthRange(character.health) &&
         isValidStatRange(character.strength) &&
         isValidStatRange(character.agility) &&
         isValidStatRange(character.intelligence) &&
         isValidStatRange(character.luck) &&
         character.weaponId > 0;
};