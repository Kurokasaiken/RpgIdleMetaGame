import React from 'react';

interface DerivedResultProps {
  label: string;
  value: number | null;
}

/**
 * DerivedResult: mostra un valore derivato da formula.
 * Se value è null, mostra "–".
 */
export const DerivedResult: React.FC<DerivedResultProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between items-center border-t pt-2 mt-2">
      <span className="font-medium">{label}</span>
      <span className="font-semibold">{value !== null ? value.toFixed(2) : '–'}</span>
    </div>
  );
};
