// Core game types
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
  damage: number; // multiplier (e.g., 1.5 = 150% damage)
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

export interface Armor {
  defense: StatRange;
  resistances?: {
    physical?: number;
    magical?: number;
    elemental?: number;
  };
}

// Enums
export type WeaponType = 'light' | 'medium' | 'heavy';
export type SkillType = 'physical' | 'magical' | 'utility' | 'passive';

// Combat related types
export interface CombatOptions {
  hitChance: boolean;
  critical: boolean;
  skills: boolean;
  maxTurns: number;
}

export interface CombatResult {
  winner: string | null;
  turns: number;
  log: CombatLogEntry[];
  char1FinalHealth: number;
  char2FinalHealth: number;
}

export interface CombatLogEntry {
  turn: number;
  attacker: string;
  defender: string;
  action: CombatAction;
  damage?: number;
  skill?: string;
  critical?: boolean;
  missed?: boolean;
  healingTrigger?: boolean;
}

export type CombatAction = 'attack' | 'skill' | 'miss' | 'critical' | 'heal';

// Simulation types
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
  detailedStats?: {
    avgDamagePerTurn: {
      char1: number;
      char2: number;
    };
    skillUsageStats: Record<string, number>;
    criticalHitRates: {
      char1: number;
      char2: number;
    };
  };
}

// Runtime fighter state (used during combat)
export interface Fighter extends Omit<Character, 'health' | 'strength' | 'agility' | 'intelligence' | 'luck'> {
  currentHealth: number;
  maxHealth: number;
  currentStrength: number;
  currentAgility: number;
  currentIntelligence: number;
  currentLuck: number;
  skillCooldowns: Record<number, number>;
  statusEffects?: StatusEffect[];
}

export interface StatusEffect {
  id: string;
  name: string;
  duration: number;
  effect: {
    statModifiers?: Partial<{
      strength: number;
      agility: number;
      intelligence: number;
      luck: number;
    }>;
    damageOverTime?: number;
    healingOverTime?: number;
    disableActions?: boolean;
  };
}

// Component Props Types
export interface CharacterPanelProps {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  title: string;
  weapons: Weapon[];
  skills: Skill[];
  combatOptions: CombatOptions;
}

export interface DatabaseTabProps {
  weapons: Weapon[];
  skills: Skill[];
  setWeapons: React.Dispatch<React.SetStateAction<Weapon[]>>;
  setSkills?: React.Dispatch<React.SetStateAction<Skill[]>>;
}

export interface SimulationTabProps {
  simulationResults: SimulationResults | null;
  isSimulating: boolean;
  runMassSimulation: (iterations: number) => Promise<void>;
  character1: Character;
  character2: Character;
}

export interface CombatTabProps {
  character1: Character;
  character2: Character;
  weapons: Weapon[];
  skills: Skill[];
  combatOptions: CombatOptions;
  runSingleCombat: () => CombatResult;
  combatResult: CombatResult | null;
  isRunningCombat: boolean;
}

// Game Data Types
export interface GameData {
  weapons: Weapon[];
  skills: Skill[];
  defaultCharacter: Omit<Character, 'id' | 'name'>;
}

// Form/Input Types
export interface WeaponFormData {
  name: string;
  type: WeaponType;
  damage: StatRange;
  attacks: number;
  damageMultiplier: number;
  strScaling: number;
  agiScaling: number;
  intScaling: number;
}

export interface SkillFormData {
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

// Utility Types
export type TabType = 'combat' | 'database' | 'simulation';

export interface AppState {
  activeTab: TabType;
  character1: Character;
  character2: Character;
  weapons: Weapon[];
  skills: Skill[];
  combatOptions: CombatOptions;
  simulationResults: SimulationResults | null;
  combatResult: CombatResult | null;
  isSimulating: boolean;
  isRunningCombat: boolean;
}

// Error types
export interface CombatError {
  type: 'INVALID_CHARACTER' | 'INVALID_WEAPON' | 'SIMULATION_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  details?: unknown;
}

// Constants
export const DEFAULT_COMBAT_OPTIONS: CombatOptions = {
  hitChance: true,
  critical: true,
  skills: true,
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

// Type guards
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

// Helper types for complex operations
export type CharacterStatKey = keyof Pick<Character, 'health' | 'strength' | 'agility' | 'intelligence' | 'luck'>;
export type WeaponScalingKey = 'strScaling' | 'agiScaling' | 'intScaling';

// Export all types as a namespace for organized imports
export namespace RPGTypes {
  export type Character = Character;
  export type Weapon = Weapon;
  export type Skill = Skill;
  export type CombatResult = CombatResult;
  export type SimulationResults = SimulationResults;
  export type CombatOptions = CombatOptions;
  export type WeaponType = WeaponType;
  export type SkillType = SkillType;
}