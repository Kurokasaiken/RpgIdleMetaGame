import React, { useState, useEffect } from 'react';
import { useBalancerContext } from '@/core/BalancerContext';
import { StatSlider } from '@/components/ui/StatSlider';
import { Lock, Unlock, Trash2, Info, X } from 'lucide-react';

// Tooltip Component
const Tooltip: React.FC<{
  content?: string;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ content, children, disabled = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (disabled || !content) return <>{children}</>;

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 border border-gray-600 rounded-lg shadow-lg whitespace-nowrap">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export const StatCard: React.FC<{
  cardId: string;
  statId: string;
  disabled?: boolean;
  isInCard?: boolean;
  onRemoveCard?: () => void;
  showCardControls?: boolean;
}> = ({ cardId, statId, disabled = false, isInCard = false, onRemoveCard, showCardControls = false }) => {
  const {
    stats,
    lockedStats,
    toggleLock,
    setStat,
    updateStat, // Now provided by BalancerContext
    cardStates,
    setCardStates,
    dirtyStats,
  } = useBalancerContext();

  const stat = stats[statId];
  const isLocked = lockedStats.has(statId);
  const isDirty = dirtyStats.has(statId);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [showTooltipEditor, setShowTooltipEditor] = useState(false);
  const [tooltipText, setTooltipText] = useState(stat?.tooltip || '');

  useEffect(() => {
    if (isDirty && !isLocked) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isDirty, isLocked]);

  const handleRemoveStat = () => {
    if (confirm(`Rimuovere la statistica "${stat.name}"?`)) {
      setCardStates((cs) => ({
        ...cs,
        [cardId]: {
          ...cs[cardId],
          stats: cs[cardId].stats.filter((id: string) => id !== statId),
        },
      }));
    }
  };

  const handleRemoveCard = () => {
    if (onRemoveCard) {
      const cardType = isInCard ? 'card' : 'subcard';
      if (confirm(`Rimuovere questa ${cardType}?`)) {
        onRemoveCard();
      }
    }
  };

  const handleStatChange = (newValue: number) => {
    if (!isLocked && !disabled) {
      setStat(statId, newValue);
    }
  };

  const handleTooltipSave = () => {
    if (stat) {
      updateStat(statId, { ...stat, tooltip: tooltipText });
      setShowTooltipEditor(false);
    }
  };

  if (!stat) return null;

  const isInteractive = !isLocked && !disabled;
  const cardBgClass = isHighlighted
    ? 'bg-blue-800 border-blue-500'
    : 'bg-gray-700 border-gray-600';

  return (
    <div
      className={`
        relative border rounded-xl p-4 transition-all duration-300 
        ${cardBgClass}
        ${!isInteractive ? 'opacity-60' : ''}
        ${isHighlighted ? 'shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/30' : 'shadow-md'}
      `}
    >
      {showCardControls && onRemoveCard && (
        <button
          onClick={handleRemoveCard}
          className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors z-10 shadow-lg"
          title={`Rimuovi ${isInCard ? 'card' : 'subcard'}`}
        >
          <X size={14} />
        </button>
      )}

      <div className="flex justify-between items-center mb-3">
        <Tooltip content={stat.tooltip} disabled={!stat.tooltip}>
          <input
            value={stat.name}
            onChange={(e) => {
              updateStat(statId, { ...stat, name: e.target.value });
            }}
            className="bg-gray-800 text-white font-semibold text-sm px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors flex-1 mr-2"
            disabled={disabled}
            placeholder="Nome statistica"
          />
        </Tooltip>

        <div className="flex gap-1">
          <button
            onClick={() => setShowTooltipEditor(!showTooltipEditor)}
            className={`p-1.5 rounded transition-colors ${
              stat.tooltip
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            title="Modifica tooltip"
            disabled={disabled}
          >
            <Info size={14} />
          </button>

          <button
            onClick={() => toggleLock(statId)}
            className={`p-1.5 rounded transition-colors ${
              isLocked
                ? 'text-yellow-400 hover:text-yellow-300'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            title={isLocked ? 'Unlock statistic' : 'Lock statistic'}
            disabled={disabled}
          >
            {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>

          <button
            onClick={handleRemoveStat}
            className="p-1.5 rounded transition-colors text-red-400 hover:text-red-300"
            title="Remove statistic"
            disabled={disabled}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {showTooltipEditor && (
        <div className="mb-3 p-3 bg-gray-800 rounded-lg border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-blue-400" />
            <span className="text-sm text-gray-300">Tooltip</span>
          </div>
          <textarea
            value={tooltipText}
            onChange={(e) => setTooltipText(e.target.value)}
            placeholder="Inserisci una descrizione per questa statistica..."
            className="w-full p-2 text-sm bg-gray-900 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none resize-none"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleTooltipSave}
              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Salva
            </button>
            <button
              onClick={() => {
                setShowTooltipEditor(false);
                setTooltipText(stat?.tooltip || '');
              }}
              className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-xs">Valore corrente:</span>
          <Tooltip content={stat.tooltip} disabled={!stat.tooltip}>
            <span
              className={`font-mono text-sm ${
                isHighlighted ? 'text-blue-300' : 'text-white'
              }`}
            >
              {stat.value.toFixed(1)}
            </span>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={stat.value}
            disabled={!isInteractive}
            onChange={(e) => handleStatChange(Number(e.target.value))}
            className={`
              w-20 p-2 text-sm rounded border transition-all duration-200
              ${
                isInteractive
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:outline-none'
                  : 'bg-gray-900 border-gray-700 text-gray-400 cursor-not-allowed'
              }
              ${isHighlighted ? 'ring-1 ring-blue-500/50' : ''}
            `}
            step="0.1"
          />

          <div className={`flex-1 ${isHighlighted ? 'opacity-100' : ''}`}>
            <StatSlider
              value={stat.value}
              min={0}
              max={999}
              disabled={!isInteractive}
              onChange={handleStatChange}
            />
          </div>
        </div>

        {stat.formula && (
          <Tooltip content={stat.tooltip} disabled={!stat.tooltip}>
            <div className="text-xs text-gray-400 font-mono bg-gray-800 p-2 rounded">
              {stat.formula}
            </div>
          </Tooltip>
        )}

        {stat.constant !== null && (
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-xs">Constant:</span>
            <input
              type="number"
              value={stat.constant}
              disabled={!isInteractive}
              onChange={(e) => {
                updateStat(statId, { ...stat, constant: Number(e.target.value) });
              }}
              className={`
                w-20 p-2 text-sm rounded border transition-all duration-200
                ${
                  isInteractive
                    ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:outline-none'
                    : 'bg-gray-900 border-gray-700 text-gray-400 cursor-not-allowed'
                }
              `}
            />
          </div>
        )}

        {isLocked && (
          <div className="flex items-center gap-1 text-yellow-400 text-xs">
            <Lock size={12} />
            <span>Bloccata</span>
          </div>
        )}
      </div>
    </div>
  );
};