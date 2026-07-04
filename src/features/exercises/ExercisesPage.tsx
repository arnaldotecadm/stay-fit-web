import React, { useMemo, useState } from 'react';
import { useExercises } from './useExercises';
import ExerciseCard from './components/ExerciseCard';
import ExerciseStatsBar from './components/ExerciseStatsBar';
import ExerciseTypeFilter from './components/ExerciseTypeFilter';
import { ExerciseSummary } from './types';

function formatDateHeading(dateStr: string): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const toMidnight = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const date = new Date(`${dateStr}T00:00:00`);
  const formatted = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (toMidnight(date) === toMidnight(today)) return `Today · ${formatted}`;
  if (toMidnight(date) === toMidnight(yesterday)) return `Yesterday · ${formatted}`;
  return formatted;
}

function groupByDate(exercises: ExerciseSummary[]): [string, ExerciseSummary[]][] {
  const map = new Map<string, ExerciseSummary[]>();
  for (const ex of exercises) {
    if (!map.has(ex.date)) map.set(ex.date, []);
    map.get(ex.date)!.push(ex);
  }
  return Array.from(map.entries());
}

const ExercisesPage: React.FC = () => {
  const { data, loading, error } = useExercises();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const exerciseTypes = useMemo(
    () => Array.from(new Set(data.map((ex) => ex.exerciseType))).sort(),
    [data]
  );

  const filtered = useMemo(
    () => (selectedType ? data.filter((ex) => ex.exerciseType === selectedType) : data),
    [data, selectedType]
  );

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <main className="flex-1 overflow-y-auto px-10 pb-12 pt-4">
      <div className="mb-8">
        <h2 className="text-headline-md font-bold text-on-surface">Exercises</h2>
        <p className="text-label-md text-on-surface-variant opacity-70">Your activity history from Samsung Health</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64" role="status" aria-label="Loading exercises">
          <span className="material-symbols-outlined text-primary animate-spin text-4xl">progress_activity</span>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-error" role="alert">
          <span className="material-symbols-outlined text-4xl">error</span>
          <p className="text-label-md">{error}</p>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl">fitness_center</span>
          <p className="text-label-md">No exercise data found.</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          <ExerciseStatsBar exercises={data} />
          <ExerciseTypeFilter
            types={exerciseTypes}
            selected={selectedType}
            onChange={setSelectedType}
          />
          <section aria-label="Exercise sessions">
            {grouped.map(([date, exercises]) => (
              <div key={date} className="mb-6" data-testid="date-group">
                <div className="sticky top-0 z-10 mb-3">
                  <div className="bg-surface-container-lowest one-ui-rounded p-6 card-shadow border border-outline-variant/10 flex items-center gap-4">
                    <div className="w-14 h-14 bg-surface-variant flex items-center justify-center rounded-2xl flex-shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant">calendar_today</span>
                    </div>
                    <h3 className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">
                      {formatDateHeading(date)}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {exercises.map((exercise) => (
                    <ExerciseCard key={exercise.dataPointUid} exercise={exercise} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
};

export default ExercisesPage;
