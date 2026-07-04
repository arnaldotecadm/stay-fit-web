import React from 'react';

interface ExerciseTypeFilterProps {
  types: string[];
  selected: string | null;
  onChange: (type: string | null) => void;
}

function toLabel(type: string): string {
  return type.replace(/_/g, ' ').replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

const ExerciseTypeFilter: React.FC<ExerciseTypeFilterProps> = ({ types, selected, onChange }) => {
  if (types.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter by exercise type">
      <button
        onClick={() => onChange(null)}
        aria-pressed={selected === null}
        className={`px-4 py-2 rounded-full text-label-sm transition-colors ${
          selected === null
            ? 'bg-primary text-on-primary'
            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
        }`}
      >
        All
      </button>
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onChange(selected === type ? null : type)}
          aria-pressed={selected === type}
          className={`px-4 py-2 rounded-full text-label-sm transition-colors ${
            selected === type
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          {toLabel(type)}
        </button>
      ))}
    </div>
  );
};

export default ExerciseTypeFilter;
