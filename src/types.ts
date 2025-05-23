export interface Character {
  id: number;
  name: string;
  health: [number, number];
  strength: [number, number];
  agility: [number, number];
  intelligence: [number, number];
  luck: [number, number];
  weaponId: number;
  armor: { defense: [number, number] };
  equippedSkills: number[];
}

export interface Weapon {
  id: number;
  name: string;
  type: string;
  attacks: number;
  damage: [number, number];
  strScaling: number;
  agiScaling: number;
  intScaling: number;
  damageMultiplier: number;
  icon?: string; // Aggiunto per l'icona
  skillIds?: number[]; // Array di ID delle skill correlate all'arma
}

export interface Skill {
  id: number;
  name: string;
  damage: number;
  cooldown: number;
  description: string;
  type: string;
  requirements: {
    minStats: {
      strength?: number;
      agility?: number;
      intelligence?: number;
    };
  };
}

export interface CombatOptions {
  hitChance: boolean;
  critical: boolean;
  armor: boolean;
  skills: boolean;
}

export type StatRange = [number, number];