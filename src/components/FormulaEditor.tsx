/* src/components/FormulaEditor.tsx */
import React, { useState, useEffect } from 'react';
import { parse, evaluate } from 'mathjs';
import { useBalancerContext } from '@/core/BalancerContext';

interface Props { statId: string; }
export const FormulaEditor: React.FC<Props> = ({ statId }) => {
  const { stats, setFormula } = useBalancerContext();
  const formula = stats[statId]?.formula || '';
  const variables = Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, v.value]));

  const [text, setText] = useState(formula);
  const [preview, setPreview] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        parse(text);
        const result = evaluate(text, variables);
        setPreview(result);
        setError(null);
        setFormula(statId, text);
      } catch (e: any) {
        setError(e.message);
        setPreview(null);
      }
    }, 200);
    return () => clearTimeout(handler);
  }, [text]);

  return (
    <div className="mt-2">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Inserisci formula: hp / damage"
        className="w-full p-2 bg-gray-800 text-white rounded"
      />
      {error
        ? <div className="text-red-400 text-sm">{error}</div>
        : <div className="text-green-400 text-sm">Preview: {preview}</div>
      }
    </div>
  );
};