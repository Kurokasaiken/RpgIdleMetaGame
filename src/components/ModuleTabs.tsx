/* src/components/ModuleTabs.tsx */
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useBalancerContext } from '@/core/BalancerContext';

export const ModuleTabs: React.FC = () => {
  const { modules } = useBalancerContext();
  const visible = Object.values(modules).filter(m => m.isVisible);
  const firstId = visible[0]?.id || '';

  return (
    <Tabs defaultValue={firstId} className="w-full">
      <Tabs.List>
        {visible.map(mod => (
          <Tabs.Trigger key={mod.id} value={mod.id}>
            {mod.name}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {visible.map(mod => (
        <Tabs.Content key={mod.id} value={mod.id}>
          <div className="p-4 bg-gray-800 min-h-screen">
            <mod.Card module={mod} />
          </div>
        </Tabs.Content>
      ))}
    </Tabs>
  );
};
