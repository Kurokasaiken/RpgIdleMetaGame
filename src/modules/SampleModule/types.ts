/**
 * StatAssoc – rappresenta la “stat” interna a questo modulo.
 */
export interface StatAssoc {
  id: string;             // es. "hp", "damage", "armor", ecc.
  name: string;           // etichetta leggibile
  baseValue: number;      // valore di partenza
  formula?: string;       // stringa di formula (facoltativa)
  isLocked: boolean;      // se bloccata
  isVisible: boolean;     // se mostrata
  isActive: boolean;      // se considerata nei calcoli
  metadata?: Record<string, any>;
}

/**
 * MacroModule – estende le proprietà di defaults.json
 */
export interface MacroModule {
  id: string;
  name: string;
  icon: string;           // nome dell’icona
  colorClass: string;     // es. "text-indigo-500"
  statIds: string[];
  formula?: string | null;
  isVisible: boolean;
  isActive: boolean;
  metadata?: Record<string, any>;
}
