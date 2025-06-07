import { ReactNode } from 'react';
import { StatPanelTab } from '@/modules/StatPanel/StatPanelTab';
import { StatBalancerModule } from '../modules/StatBalancer/StatBalancerModule';
// Importa altri moduli quando esistono

export interface ModuleEntry {
  id: string;
  title: string;
  icon?: ReactNode;
  component?: React.FC;
  isEnabled?: boolean;
}

const modules: ModuleEntry[] = [
  {
    id: 'stats',
    title: 'Character Stats',
    component: StatPanelTab,
    isEnabled: true,
  },
  {
    id: 'balance',
    title: 'Bilanciamento Stat',
    component: StatBalancerModule,
    isEnabled: true,
  },
  {
    id: 'combat',
    title: 'Combat System',
    component: undefined, // placeholder
    isEnabled: false,
  },
  {
    id: 'inventory',
    title: 'Inventory',
    component: undefined,
    isEnabled: false,
  },
  // Aggiungi altri moduli
];

export const ModuleRegistry = {
  getAll: () => modules,
  getEnabled: () => modules.filter((m) => m.isEnabled),
  getById: (id: string) => modules.find((m) => m.id === id),
};
