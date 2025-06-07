import React from 'react';

interface StatSliderProps {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (newVal: number) => void;
}

export const StatSlider: React.FC<StatSliderProps> = ({
  value,
  min = 0,
  max = 100,
  disabled,
  onChange,
}) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
  );
};