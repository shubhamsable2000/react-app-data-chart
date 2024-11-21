// MultiSelect.tsx
import React from 'react';

interface MultiSelectProps {
  options: number[];
  selectedOptions: number[];
  onChange: (selectedOptions: number[]) => void;
}

export default function MultiSelect({
  options,
  selectedOptions,
  onChange,
}: MultiSelectProps) {
  const handleOptionToggle = (option: number) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((o) => o !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  return (
    <div className="flex flex-wrap">
      {options.map((option) => (
        <label key={option} className="mr-2 mb-2">
          <input
            type="checkbox"
            value={option}
            checked={selectedOptions.includes(option)}
            onChange={() => handleOptionToggle(option)}
          />
          <span className="ml-1 text-white">{option}</span>
        </label>
      ))}
    </div>
  );
}
