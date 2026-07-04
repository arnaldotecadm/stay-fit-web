import React from 'react';
import { ExerciseSummary } from '../types';

interface StatTileProps {
  icon: string;
  label: string;
  value: string;
  colorClass: string;
}

const StatTile: React.FC<StatTileProps> = ({ icon, label, value, colorClass }) => (
  <div className="flex-1 bg-surface-container-lowest one-ui-rounded p-6 card-shadow border border-outline-variant/10 flex items-center gap-4">
    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${colorClass}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <p className="text-label-md text-on-surface-variant uppercase tracking-wide mb-1">{label}</p>
      <p className="text-headline-md text-on-surface font-bold">{value}</p>
    </div>
  </div>
);

function totalDurationMinutes(exercises: ExerciseSummary[]): string {
  const totalSeconds = exercises.reduce((acc, ex) => {
    const [timePart] = ex.duration.split('.');
    const [h, m, s] = timePart.split(':').map(Number);
    return acc + h * 3600 + m * 60 + s;
  }, 0);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

interface ExerciseStatsBarProps {
  exercises: ExerciseSummary[];
}

const ExerciseStatsBar: React.FC<ExerciseStatsBarProps> = ({ exercises }) => {
  const totalCalories = exercises.reduce((acc, ex) => acc + ex.calories, 0);
  const totalDistanceKm = exercises.reduce((acc, ex) => acc + parseFloat(ex.distance), 0);

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <StatTile
        icon="fitness_center"
        label="Sessions"
        value={String(exercises.length)}
        colorClass="bg-primary/20 text-primary"
      />
      <StatTile
        icon="local_fire_department"
        label="Calories"
        value={`${Math.round(totalCalories)} kcal`}
        colorClass="bg-error/20 text-error"
      />
      <StatTile
        icon="straighten"
        label="Distance"
        value={`${totalDistanceKm.toFixed(2)} km`}
        colorClass="bg-secondary/20 text-secondary"
      />
      <StatTile
        icon="timer"
        label="Total Time"
        value={totalDurationMinutes(exercises)}
        colorClass="bg-tertiary/20 text-tertiary"
      />
    </div>
  );
};

export default ExerciseStatsBar;
