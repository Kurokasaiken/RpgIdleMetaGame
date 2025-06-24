import React, { useState } from 'react';
import { useBalancerContext } from '@/core/BalancerContext';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { IconPicker } from '../IconPicker';
import { UndoRedoControls } from '../UndoRedoControls';
import { StatCard } from '../ui/StatCard';
import { FormulaEditor } from '../FormulaEditor';
import { Eye, EyeOff, Power, ChevronRight, ChevronDown, Plus, BarChart3 } from 'lucide-react';

export const MacroCard: React.FC<{ 
  cardId: string; 
  isSubCard?: boolean; 
}> = ({ cardId, isSubCard = false }) => {
  const {
    cardStates,
    setCardStates,
    addCard,
    toggleCardCollapse,
    toggleCardActive,
    stats,
  } = useBalancerContext();
  
  const card = cardStates[cardId];
  const [isVisible, setIsVisible] = useState(card.visible !== false);
  const [isActive, setIsActive] = useState(card.active !== false);

  const handleToggleVisible = () => {
    const newVisible = !isVisible;
    setIsVisible(newVisible);
    setCardStates(cs => ({
      ...cs,
      [cardId]: { ...cs[cardId], visible: newVisible },
    }));
  };

  const handleToggleActive = () => {
    const newActive = !isActive;
    setIsActive(newActive);
    setCardStates(cs => ({
      ...cs,
      [cardId]: { ...cs[cardId], active: newActive },
    }));
    toggleCardActive(cardId);
  };

  const handleAddSubCard = () => {
    addCard(cardId);
  };

  const handleAddStat = () => {
    // Get available stats that aren't already in this card
    const availableStats = Object.keys(stats).filter(statId => 
      !card.stats.includes(statId)
    );
    
    if (availableStats.length > 0) {
      // Add the first available stat, or you could show a selector
      const statToAdd = availableStats[0];
      setCardStates(cs => ({
        ...cs,
        [cardId]: {
          ...cs[cardId],
          stats: [...cs[cardId].stats, statToAdd],
        },
      }));
    } else {
      alert('Tutte le statistiche sono già state aggiunte a questa card');
    }
  };

  // Render collapsed card (non visible)
  if (!isVisible) {
    return (
      <div className="transition-all duration-200 opacity-50">
        <Card className="bg-gray-800 border-gray-600 shadow-lg">
          <CardHeader className="bg-gray-750 border-b border-gray-600 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <span className="text-2xl">{card.icon}</span>
                
                {/* Card Name */}
                <span className="text-white font-semibold text-lg">
                  {card.name}
                </span>
                
                <span className="text-gray-400 text-sm">(nascosta)</span>
              </div>
              
              {/* Control Buttons */}
              <div className="flex items-center gap-2">
                {/* Visibility Toggle */}
                <button
                  onClick={handleToggleVisible}
                  className="p-2 rounded transition-colors text-gray-500 hover:text-gray-400"
                  title="Show card"
                >
                  <EyeOff size={18} />
                </button>
                
                {/* Active Toggle */}
                <button
                  onClick={handleToggleActive}
                  className={`p-2 rounded transition-colors ${
                    isActive 
                      ? 'text-green-400 hover:text-green-300' 
                      : 'text-gray-500 hover:text-gray-400'
                  }`}
                  title={isActive ? 'Deactivate card' : 'Activate card'}
                >
                  <Power size={18} />
                </button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Render full card (visible)
  return (
    <div className={`transition-all duration-200 ${!isActive ? 'opacity-50' : ''}`}>
      <Card className="bg-gray-800 border-gray-600 shadow-lg transition-all duration-200 hover:shadow-xl">
        <CardHeader className="bg-gray-750 border-b border-gray-600 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Collapse Toggle */}
              <button
                onClick={() => toggleCardCollapse(cardId)}
                className="text-gray-300 hover:text-white transition-colors p-1"
              >
                {card.collapsed ? 
                  <ChevronRight size={20} /> : 
                  <ChevronDown size={20} />
                }
              </button>
              
              {/* Icon Picker */}
              <IconPicker cardId={cardId} />
              
              {/* Card Name Input */}
              <input
                value={card.name}
                onChange={e =>
                  setCardStates(cs => ({
                    ...cs,
                    [cardId]: { ...cs[cardId], name: e.target.value },
                  }))
                }
                className="bg-gray-700 text-white font-semibold text-lg px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                disabled={!isActive}
              />
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              {/* Visibility Toggle */}
              <button
                onClick={handleToggleVisible}
                className="p-2 rounded transition-colors text-blue-400 hover:text-blue-300"
                title="Hide card"
              >
                <Eye size={18} />
              </button>
              
              {/* Active Toggle */}
              <button
                onClick={handleToggleActive}
                className={`p-2 rounded transition-colors ${
                  isActive 
                    ? 'text-green-400 hover:text-green-300' 
                    : 'text-gray-500 hover:text-gray-400'
                }`}
                title={isActive ? 'Deactivate card' : 'Activate card'}
              >
                <Power size={18} />
              </button>
              
              {/* Undo/Redo */}
              <UndoRedoControls cardId={cardId} />
              
              {/* Add Stat Button */}
              <button
                onClick={handleAddStat}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isActive}
                title="Add statistic"
              >
                <BarChart3 size={16} />
                <span className="hidden sm:inline">Stat</span>
              </button>
              
              {/* Add Sub-card (only for main cards, not sub-cards) */}
              {!isSubCard && (
                <button
                  onClick={handleAddSubCard}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isActive}
                  title="Add sub-card"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Sub-card</span>
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        {!card.collapsed && (
          <CardContent className="p-4 bg-gray-800">
            {/* Global Formula Editor */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                <span>📐</span>
                Formula globale della card
              </h3>
              <FormulaEditor 
                statId={cardId} 
                isGlobalFormula={true}
                disabled={!isActive}
              />
            </div>
            
            {/* Stats Grid */}
            {card.stats && card.stats.length > 0 && (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {card.stats.map((statId: string) => (
                  <StatCard 
                    key={statId} 
                    cardId={cardId} 
                    statId={statId}
                    disabled={!isActive}
                  />
                ))}
              </div>
            )}
            
            {/* Sub-cards (only for main cards) */}
            {!isSubCard && card.subCards && card.subCards.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <span>📋</span>
                  Sub-cards
                </h3>
                <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
                  {card.subCards.map((subCardId: string) => (
                    <MacroCard 
                      key={subCardId} 
                      cardId={subCardId} 
                      isSubCard={true}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {(!card.stats || card.stats.length === 0) && 
             (!card.subCards || card.subCards.length === 0 || isSubCard) && (
              <div className="text-center py-8 text-gray-400">
                <p className="mb-4">
                  {isSubCard ? 'Questa sub-card è vuota' : 'Questa card è vuota'}
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleAddStat}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
                    disabled={!isActive}
                  >
                    Aggiungi una statistica
                  </button>
                  {!isSubCard && (
                    <button
                      onClick={handleAddSubCard}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                      disabled={!isActive}
                    >
                      Aggiungi una sub-card
                    </button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};