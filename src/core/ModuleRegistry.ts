import type { MacroModule } from '@/modules/BalancerTab/types';

const modules: MacroModule[] = Object.values(
  import.meta.glob<true, string, { default: MacroModule }>(
    '../modules/**/index.tsx', // <- attenzione a .tsx
    { eager: true }
  )
).map((mod) => mod.default);

console.log('Moduli caricati:', modules);

export const ModuleRegistry = {
  getAll: (): MacroModule[] => modules,
  getEnabled: (): MacroModule[] => modules.filter((m) => m.isActive),
  getById: (id: string): MacroModule | undefined => modules.find((m) => m.id === id),
};
