/* src/components/ModuleTabs.tsx */
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useBalancerContext } from '@/core/BalancerContext';

export const ModuleTabs: React.FC = () => {
  const { modules } = useBalancerContext();
  const ordered = Object.values(modules).filter(m => m.isVisible).sort((a, b) => a.name.localeCompare(b.name));
  const firstId = ordered[0]?.id ?? '';
console.log('modules from context:', modules);
  return (
    
    <Tabs defaultValue={firstId} className="w-full">
      <Tabs.List>
        {ordered.map(mod => (
          <Tabs.Trigger key={mod.id} value={mod.id}>
            {mod.name}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {ordered.map(mod => (
        <Tabs.Content key={mod.id} value={mod.id}>
          <div className="p-4 bg-gray-800 min-h-screen">
            <mod.Card module={mod} />
          </div>
        </Tabs.Content>
      ))}
    </Tabs>
  );
};
