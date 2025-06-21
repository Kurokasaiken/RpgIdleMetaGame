import type { MacroModule } from '@/modules/BalancerModule/types';

// importa automaticamente tutti i file index.tsx dei moduli
const modules: MacroModule[] = Object.values(
  import.meta.glob<true, string, { default: MacroModule }>(
    '../modules/**/index.tsx',
    { eager: true }
  )
).map(mod => mod.default);

export const ModuleRegistry = {
  getAll: (): MacroModule[] => modules,
  getEnabled: (): MacroModule[] => modules.filter(m => m.isActive),
  getById: (id: string): MacroModule | undefined => modules.find(m => m.id === id),
};
