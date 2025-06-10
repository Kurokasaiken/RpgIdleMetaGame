/* src/components/FormulaEditor.tsx */
import React, { useState, useEffect } from 'react';
import { parse, evaluate } from 'mathjs';
import { useBalancerContext } from '@/core/BalancerContext';

export const FormulaEditor: React.FC<{ statId: string }> = ({ statId }) => {
  const { stats, setFormula } = useBalancerContext();
  const [text, setText] = useState(stats[statId].formula || '');
  const [preview, setPreview] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        parse(text);
        const scope = Object.fromEntries(
          Object.entries(stats).map(([k, v]) => [k, v.value])
        );
        const result = evaluate(text, scope);
        setPreview(Number(result));
        setError(null);
        setFormula(statId, text);
      } catch (e: any) {
        setError(e.message);
      }
    }, 200);
    return () => clearTimeout(handler);
  }, [text, stats]);

  return (
    <div className="mt-2">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full p-2 bg-gray-800 text-white rounded"
        placeholder="hp / damage"
      />
      {error ? (
        <div className="text-red-400 text-sm">{error}</div>
      ) : (
        <div className="text-green-400 text-sm">Preview: {preview}</div>
      )}
    </div>
  );
};
