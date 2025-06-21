import React from 'react';
import { useRegisteredModules } from '@/core/BalancerContext';
import { Tabs } from '@/components/ui/tabs';
import type { MacroModule } from '@/modules/BalancerModule/types';

export function ModuleTabs() {
  const modules = useRegisteredModules().filter((m) => m.isVisible);

  if (modules.length === 0) return <p>Nessun modulo visibile</p>;

  return (
    <Tabs defaultValue={modules[0]?.id}>
      <Tabs.List>
        {modules.map((mod: MacroModule) => (
          <Tabs.Trigger key={mod.id} value={mod.id}>
            {mod.name}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {modules.map((mod: MacroModule) => (
        <Tabs.Content key={mod.id} value={mod.id}>
          {/* Contenuto dinamico del modulo */}
          <mod.Content module={mod} />
        </Tabs.Content>
      ))}
    </Tabs>
  );
}

export default ModuleTabs;
