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

// Risultato di un singolo combattimento
export interface CombatResult {
  winner: string | null;  // Nome del vincitore o null in caso di pareggio
  turns: number;          // Numero di turni impiegati nel combattimento
  log: string[];          // Log testuale degli eventi di combattimento
  finalStats: {
    char1Health: number;  // HP finali del personaggio 1
    char2Health: number;  // HP finali del personaggio 2
  };
}

// Risultato di una simulazione massiva
export interface SimulationResults {
  iterations: number;      // Numero totale di simulazioni eseguite
  char1Wins: number;       // Vittorie del personaggio 1
  char2Wins: number;       // Vittorie del personaggio 2
  draws: number;           // Pareggi
  char1WinRate: number;    // Percentuale vittorie del personaggio 1
  char2WinRate: number;    // Percentuale vittorie del personaggio 2
  drawRate: number;        // Percentuale pareggi
  avgTurns: number;        // Numero medio di turni per combattimento
  balanceIssues: string[]; // Eventuali segnalazioni di squilibrio nel bilanciamento
  turnDistribution: number[]; // Array con la distribuzione dei turni per ogni combattimento
}