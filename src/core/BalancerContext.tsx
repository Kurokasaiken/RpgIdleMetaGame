import React, { createContext, useContext, useState } from 'react';
import type { MacroModule } from '@/modules/SampleModule/types';

// 1. Autodiscovery di ogni "index.tsx" sotto src/modules/…
const modulesFiles = import.meta.glob('../modules/**/index.tsx', { eager: true });

type LoadedModule = MacroModule & { Card: React.FC<any>; Content: React.FC<any> };
type AllModulesMap = Record<string, LoadedModule>;

const allModules: AllModulesMap = {};
for (const path in modulesFiles) {
  const mod = (modulesFiles[path] as any).default as LoadedModule;
  allModules[mod.id] = mod;
}

interface BalancerContextType {
  modules: AllModulesMap;
  toggleModuleVisible: (moduleId: string) => void;
  toggleModuleActive: (moduleId: string) => void;
  ricalcolaModulo: (moduleId: string) => void;
}

export const BalancerContext = createContext<BalancerContextType | undefined>(undefined);

export const BalancerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<AllModulesMap>(() => {
    const cloned: AllModulesMap = {};
    for (const id in allModules) {
      cloned[id] = { ...allModules[id] };
      cloned[id].statIds = [...allModules[id].statIds];
    }
    return cloned;
  });

  const toggleModuleVisible = (moduleId: string) => {
    setModules(prev => {
      const m = prev[moduleId];
      if (!m) return prev;
      return {
        ...prev,
        [moduleId]: { ...m, isVisible: !m.isVisible }
      };
    });
  };

  const toggleModuleActive = (moduleId: string) => {
    setModules(prev => {
      const m = prev[moduleId];
      if (!m) return prev;
      return {
        ...prev,
        [moduleId]: { ...m, isActive: !m.isActive }
      };
    });
  };

  const ricalcolaModulo = (moduleId: string) => {
    const m = modules[moduleId];
    if (!m || !m.isActive) return;
    m.statIds.forEach((statId) => {
      console.log(`[Balancer] Ricalcolando stat "\${statId}" del modulo "\${moduleId}"`);
    });
  };

  return (
    <BalancerContext.Provider
      value={{
        modules,
        toggleModuleVisible,
        toggleModuleActive,
        ricalcolaModulo
      }}
    >
      {children}
    </BalancerContext.Provider>
  );
};

export function useBalancerContext(): BalancerContextType {
  const ctx = useContext(BalancerContext);
  if (!ctx) {
    throw new Error('useBalancerContext deve essere usato all’interno di <BalancerProvider>');
  }
  return ctx;
}
