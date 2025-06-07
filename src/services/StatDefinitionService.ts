// src/services/StatDefinitionService.ts

export interface StatDefinition {
  id: string;
  name: string;
  description?: string;
  baseValue: number;
  isActive: boolean;
  isVisible: boolean;
  isLocked: boolean;
}

// Stat definitions (copiate dal tuo array fornito)
export const statDefinitions = [
  {
    name: 'hp',
    key: 'hp',
    label: 'Punti Vita',
    description: 'La salute del personaggio, se arriva a 0 il personaggio muore.',
    type: 'number',
    icon: '❤️',
    colorClass: 'text-red-500',
    defaultValue: 100,
    modifiers: [],
    category: 'Base',
  },
  {
    name: 'damage',
    key: 'damage',
    label: 'Danno',
    description: 'Il danno base inflitto dagli attacchi.',
    type: 'number',
    defaultValue: 20,
    icon: '❤️',
    colorClass: 'text-red-500',
    modifiers: [],
    category: 'Base',
  },
  {
    name: 'hitToKo',
    key: 'hitToKo',
    label: 'Colpi per KO',
    description:
      'Numero di colpi a segno necessari per mettere KO un nemico pari livello.',
    type: 'number',
    defaultValue: 4,
    icon: '❤️',
    colorClass: 'text-red-500',
    modifiers: [],
    category: 'Base',
  },
];

// Servizio con metodi
export const StatDefinitionService = {
  getDefaultStats: (): Record<string, number> => ({
    hp: 100,
    damage: 25,
    hitToKo: 4,
  }),

  loadDefinitions: (): Record<string, number> => {
    return StatDefinitionService.getDefaultStats();
  },

  recalculate: (
    stats: Record<string, number>,
    locked: Set<string>
  ): Record<string, number> => {
    const result: Record<string, number> = {};

    Object.entries(stats).forEach(([key, value]) => {
      // Mantieni inalterate le stat bloccate
      if (locked.has(key)) {
        result[key] = value;
      } else {
        // Applica qui la logica di ricalcolo se vuoi.
        result[key] = value;
      }
    });

    return result;
  },
};
