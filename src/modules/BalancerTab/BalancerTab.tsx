import React, { useEffect } from 'react';
import { useBalancerContext } from '@/core/BalancerContext';
import { MacroCard } from '@/components/ui/MacroCard';

export default function BalancerTab() {
  const {
    cardStates,
    setCardStates,
    saveSnapshot,
    loadSnapshot,
    listSnapshotNames,
  } = useBalancerContext();

  // all mount, se non ci sono card, carica snapshot o crea Base
  useEffect(() => {
    if (Object.keys(cardStates).length === 0) {
      const last = listSnapshotNames().slice(-1)[0];
      if (last) loadSnapshot(last);
      else setCardStates({
        'base-card': {
          id: 'base-card',
          name: 'Bilanciamento Base',
          icon: '⚔️',
          collapsed: false,
          active: true,
          stats: [],
          subCards: [],
        },
      });
    }
  }, []);

  const cards = Object.keys(cardStates);

  return (
    <div className="p-4 space-y-4 bg-gray-900 text-white">
      {/* HEADER MODULO: solo Save/Load */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bilanciamento</h1>
        <div className="flex gap-2">
          <button onClick={() => saveSnapshot('snapshot')}>💾 Salva</button>
          <button onClick={() => loadSnapshot(prompt('Nome snapshot:') || '')}>📂 Carica</button>
        </div>
      </div>

      {/* MACRO-CARDS */}
      {cards.map(cardId => (
        <MacroCard key={cardId} cardId={cardId} />
      ))}
    </div>
  );
}
