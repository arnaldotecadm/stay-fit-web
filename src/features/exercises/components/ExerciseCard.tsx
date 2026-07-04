import React from 'react';
import { ExerciseSummary } from '../types';
import {
  EXERCISE_ICONS,
  DEFAULT_EXERCISE_ICON,
  toTitleCase,
  formatDuration,
  formatRelativeDateTime,
} from '../exerciseUtils';

interface ExerciseCardProps {
  exercise: ExerciseSummary;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const icon = EXERCISE_ICONS[exercise.exerciseType] ?? DEFAULT_EXERCISE_ICON;
  const distanceKm = parseFloat(exercise.distance);

  return (
    <article className="p-6 bg-surface-container-low rounded-3xl border border-transparent hover:border-primary/20 transition-colors flex items-center gap-6 group">
      <div className="w-14 h-14 bg-primary text-on-primary flex items-center justify-center rounded-2xl group-hover:scale-105 transition-transform flex-shrink-0">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-label-md font-bold mb-1">{toTitleCase(exercise.exerciseType)}</h3>
        <p className="text-[12px] text-on-surface-variant">
          {formatRelativeDateTime(exercise.date, exercise.startTime)}
        </p>
      </div>

      <div className="hidden sm:flex gap-6 text-center flex-shrink-0">
        <div>
          <p className="text-label-sm font-bold">{formatDuration(exercise.duration)}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Duration</p>
        </div>
        {distanceKm > 0 && (
          <div>
            <p className="text-label-sm font-bold">{distanceKm.toFixed(2)} km</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Distance</p>
          </div>
        )}
        {exercise.count > 0 && (
          <div>
            <p className="text-label-sm font-bold">{exercise.count.toLocaleString()}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Steps</p>
          </div>
        )}
        <div>
          <p className="text-label-sm font-bold">{Math.round(exercise.calories)}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">kcal</p>
        </div>
      </div>
    </article>
  );
};

export default ExerciseCard;
