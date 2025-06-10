import React from 'react';
import { useBalancerContext } from '@/core/BalancerContext';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { IconPicker } from '../IconPicker';
import { UndoRedoControls } from '../UndoRedoControls';
import { StatCard } from './StatCard';
import { FormulaEditor } from '../FormulaEditor';

export const MacroCard: React.FC<{ cardId: string }> = ({ cardId }) => {
  const {
    cardStates,
    setCardStates,
    addCard,
    toggleCardCollapse,
    toggleCardActive,
  } = useBalancerContext();
  const card = cardStates[cardId];

  return (
    <Card className="mb-4">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={() => toggleCardCollapse(cardId)}>
            {card.collapsed ? '►' : '⌄'}
          </button>
          <IconPicker cardId={cardId} />
          <input
            value={card.name}
            onChange={e =>
              setCardStates(cs => ({
                ...cs,
                [cardId]: { ...cs[cardId], name: e.target.value },
              }))
            }
            className="bg-transparent font-semibold"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => toggleCardActive(cardId)}>⚡</button>
          <UndoRedoControls cardId={cardId} />
          <button onClick={() => addCard(cardId)}>+ Stat/Card</button>
        </div>
      </CardHeader>

      {!card.collapsed && (
        <CardContent>
          {/* Formula globale della macro-card */}
          {card.formula !== undefined && (
            <FormulaEditor statId={cardId} />
          )}
          {/* Micro-card delle stat */}
          {card.stats.map(statId => (
            <StatCard key={statId} cardId={cardId} statId={statId} />
          ))}
        </CardContent>
      )}

    <CardFooter>
        {null}
    </CardFooter>

    </Card>
  );
};
