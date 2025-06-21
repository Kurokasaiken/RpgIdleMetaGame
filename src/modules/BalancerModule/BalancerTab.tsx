import React, { useEffect } from 'react';
import { useBalancerContext } from '@/core/BalancerContext';
import { MacroCard } from '@/components/ui/MacroCard';
import { v4 as uuidv4 } from 'uuid';

export default function BalancerTab() {
  const { cardStates, setCardStates, saveSnapshot, loadSnapshot, listSnapshotNames } = useBalancerContext();

  useEffect(() => {
    console.log('BalancerTab mounted, initial cardStates:', cardStates);
    if (Object.keys(cardStates).length === 0) {
      const lastSnapshot = listSnapshotNames().slice(-1)[0];
      console.log('Last snapshot:', lastSnapshot);
      if (lastSnapshot) {
        console.log('Loading snapshot:', lastSnapshot);
        loadSnapshot(lastSnapshot);
      } else {
        console.log('Setting default card');
        setCardStates({
          'base-card': {
            id: 'base-card',
            name: 'Bilanciamento Base',
            color: 'bg-blue-500',
            icon: '⚔️',
            collapsed: false,
            active: true,
            stats: ['hp', 'damage', 'hitToKo'],
            subCards: [],
          },
        });
      }
    }
  }, []); // Run only once on mount

  useEffect(() => {
    console.log('cardStates updated:', cardStates);
  }, [cardStates]); // Log state changes for debugging

  const createNewMacroCard = () => {
    const newCardId = `card-${uuidv4()}`;
    console.log('Creating new card with ID:', newCardId);
    setCardStates((prev) => {
      const newState = {
        ...prev,
        [newCardId]: {
          id: newCardId,
          name: 'Nuova MacroCard',
          color: 'bg-green-500',
          icon: '🌟',
          collapsed: false,
          active: true,
          stats: [],
          subCards: [],
        },
      };
      console.log('New cardStates:', newState);
      return newState;
    });
  };

  return (
    <div className="p-4 space-y-4 bg-gray-900 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bilanciamento</h1>
        <div className="flex gap-2">
          <button
            onClick={() => saveSnapshot(prompt('Nome snapshot:') || '')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
          >
            💾 Salva
          </button>
          <button
            onClick={() => loadSnapshot(prompt('Nome snapshot:') || '')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
          >
            📂 Carica
          </button>
          <button
            onClick={createNewMacroCard}
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
          >
            ➕ Nuova MacroCard
          </button>
        </div>
      </div>

      {Object.values(cardStates).length === 0 ? (
        <p className="text-white">Loading default card...</p>
      ) : (
        Object.values(cardStates).map((card) => (
          <MacroCard key={card.id} cardId={card.id} />
        ))
      )}
    </div>
  );
}