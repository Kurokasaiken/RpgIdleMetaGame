/* src/components/IconPicker.tsx */
import React, { useState } from 'react';
import { useBalancerContext } from '@/core/BalancerContext';

const ICONS = ['⚔️', '🛡️', '❤️', '⚡', '🌀', '🔥', '❄️', '🌟'];

export const IconPicker: React.FC<{ cardId: string }> = ({ cardId }) => {
  const { cardStates, setCardStates } = useBalancerContext();
  const [open, setOpen] = useState(false);
  const current = cardStates[cardId]?.icon || ICONS[0];

  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(o => !o)}>{current}</button>
      {open && (
        <div className="absolute bg-white border rounded shadow max-h-40 overflow-y-auto z-10">
          {ICONS.map(i => (
            <button
              key={i}
              onClick={() => {
                setCardStates(c => ({ ...c, [cardId]: { ...c[cardId], icon: i } }));
                setOpen(false);
              }}
              className="p-2 hover:bg-gray-200"
            >
              {i}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};