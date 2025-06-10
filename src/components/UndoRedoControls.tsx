/* src/components/UndoRedoControls.tsx */
import React from 'react';
import { useBalancerContext } from '@/core/BalancerContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const UndoRedoControls: React.FC<{ cardId: string }> = ({ cardId }) => {
  const { undoCard, redoCard } = useBalancerContext();
  return (
    <div className="flex gap-1">
      <button onClick={() => undoCard(cardId)} title="Undo" className="p-1">
        <ArrowLeft size={16} />
      </button>
      <button onClick={() => redoCard(cardId)} title="Redo" className="p-1">
        <ArrowRight size={16} />
      </button>
    </div>
  );
};