import React from 'react';
import { useBalancerContext } from '@/core/BalancerContext';
import { MacroCard } from '@/components/ui/MacroCard';
import { v4 as uuidv4 } from 'uuid';

export default function BalancerTab() {
  const { 
    cardStates, 
    setCardStates, 
    saveSnapshot, 
    loadSnapshot, 
    listSnapshotNames,
    isInitialized 
  } = useBalancerContext();

  const createNewMacroCard = () => {
    const newCardId = `card-${uuidv4()}`;
    console.log('Creating new card with ID:', newCardId);
    setCardStates((prev) => ({
      ...prev,
      [newCardId]: {
        id: newCardId,
        name: 'Nuova MacroCard',
        color: 'bg-green-500',
        icon: '🌟',
        collapsed: false,
        active: true,
        visible: true,
        stats: [],
        subCards: [],
      },
    }));
  };

  const handleSaveSnapshot = () => {
    const name = prompt('Nome snapshot:');
    if (name) {
      saveSnapshot(name);
    }
  };

  const handleLoadSnapshot = () => {
    const snapshots = listSnapshotNames();
    if (snapshots.length === 0) {
      alert('Nessuno snapshot disponibile');
      return;
    }
    const name = prompt(`Snapshots disponibili: ${snapshots.join(', ')}\n\nNome snapshot da caricare:`);
    if (name && snapshots.includes(name)) {
      loadSnapshot(name);
    }
  };

  // Show loading while context is initializing
  if (!isInitialized) {
    return (
      <div className="p-4 space-y-4 bg-gray-900 text-white">
        <p className="text-white">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 bg-gray-900 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bilanciamento</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSaveSnapshot}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
          >
            💾 Salva
          </button>
          <button
            onClick={handleLoadSnapshot}
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

      <div className="space-y-4">
        {Object.values(cardStates).length === 0 ? (
          <p className="text-white">No cards available. Create a new one!</p>
        ) : (
          Object.values(cardStates).map((card) => (
            <MacroCard key={card.id} cardId={card.id} />
          ))
        )}
      </div>
    </div>
  );
}