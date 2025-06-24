import React, { useState, useEffect } from 'react';
import { parse, evaluate } from 'mathjs';
import { useBalancerContext } from '@/core/BalancerContext';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const FormulaEditor: React.FC<{ 
  statId: string;
  isGlobalFormula?: boolean;
  disabled?: boolean;
}> = ({ statId, isGlobalFormula = false, disabled = false }) => {
  const { stats, setFormula, cardStates, setCardStates } = useBalancerContext();
  
  // Get formula from card if it's global, otherwise from stat
  const currentFormula = isGlobalFormula 
    ? cardStates[statId]?.formula || ''
    : stats[statId]?.formula || '';
    
  const [text, setText] = useState(currentFormula);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setText(currentFormula);
  }, [currentFormula]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!text.trim()) {
        setError(null);
        setIsValid(false);
        return;
      }

      try {
        // Validate formula syntax
        parse(text);
        
        // Test evaluation with current stats
        const scope = Object.fromEntries(
          Object.entries(stats).map(([k, v]) => [k, v.value])
        );
        evaluate(text, scope);
        
        setError(null);
        setIsValid(true);
        
        // Save formula
        if (isGlobalFormula) {
          setCardStates(cs => ({
            ...cs,
            [statId]: { ...cs[statId], formula: text }
          }));
        } else {
          setFormula(statId, text);
        }
        
      } catch (e: any) {
        setError(e.message);
        setIsValid(false);
      }
    }, 300);
    
    return () => clearTimeout(handler);
  }, [text, stats, statId, isGlobalFormula, setFormula, setCardStates]);

  const handleFormulaChange = (value: string) => {
    if (!disabled) {
      setText(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          value={text}
          onChange={e => handleFormulaChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full p-3 rounded-lg border transition-all duration-200 font-mono text-sm
            ${disabled 
              ? 'bg-gray-900 border-gray-700 text-gray-500 cursor-not-allowed' 
              : error 
                ? 'bg-gray-800 border-red-500 text-white focus:border-red-400' 
                : isValid && text.trim()
                  ? 'bg-gray-800 border-green-500 text-white focus:border-green-400'
                  : 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
            }
            focus:outline-none resize-none
          `}
          placeholder={isGlobalFormula 
            ? "es: hp = base * 10 + level * 5, damage = base * 2, hitToKo = hp / damage" 
            : "es: hp * 0.8 + damage"
          }
          rows={isGlobalFormula ? 3 : 2}
        />
        
        {/* Status Icon */}
        {text.trim() && (
          <div className="absolute top-2 right-2">
            {error ? (
              <AlertCircle size={16} className="text-red-400" />
            ) : isValid ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : null}
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-500/30">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
      
      {/* Help Text */}
      {!error && !disabled && (
        <div className="text-gray-400 text-xs">
          {isGlobalFormula ? (
            <>
              <strong>Formula globale:</strong> definisce come calcolare tutte le statistiche della card.
              <br />
              Esempio: <code>hp = base * 10, damage = base * 2, hitToKo = hp / damage</code>
            </>
          ) : (
            <>
              Usa nomi delle altre statistiche per creare dipendenze.
              <br />
              Esempio: <code>hp / damage</code> o <code>base * multiplier + bonus</code>
            </>
          )}
        </div>
      )}
    </div>
  );
};