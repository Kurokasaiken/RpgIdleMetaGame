/* src/App.tsx */
import React from 'react';
import { BalancerProvider } from '@/core/BalancerContext';
import { ModuleTabs } from '@/components/ModuleTabs';

export default function App() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-3xl font-bold">RPG Idle Meta Game</h1>
      </header>

      {/* Avvolgi ModuleTabs dentro il provider */}
      <BalancerProvider>
        <main className="p-4">
          <ModuleTabs />
        </main>
      </BalancerProvider>
    </div>
  );
}
