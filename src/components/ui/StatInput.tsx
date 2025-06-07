// components/StatInput.tsx
import React from 'react';

export interface StatInputProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  onChange: (newVal: number) => void;
  label?: string;
}

export const StatInput: React.FC<StatInputProps> = ({
  value,
  min,
  max,
  step = 1,
  disabled = false,
  onChange,
  label,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue)) {
      onChange(Math.max(min, Math.min(max, newValue))); // clamp tra min e max
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-semibold">{label}</label>}

      {/* Input numerico */}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={handleInputChange}
        className="w-full px-2 py-1 border rounded bg-gray-800 text-white border-gray-600"
      />
            {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
    
  );
};
