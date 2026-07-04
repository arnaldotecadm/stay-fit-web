import React from 'react';
import ProgressRing from '../../../components/ProgressRing';

const ACTIVE_MINUTES_GOAL = 90;    // minutes/day
const EXERCISE_CALORIES_GOAL = 320; // kcal/day

interface DailySummaryProps {
  userName: string;
  goalPercent: number;
  totalSteps: number;
  stepsGoal: number;
  totalCaloriesBurned: number;
  exerciseCalories: number;
  activeMinutes: number;
  selectedDate: string;
  isToday: boolean;
  loading: boolean;
  hasData: boolean;
  onPrevDay: () => void;
  onNextDay: () => void;
  onGoToToday: () => void;
}

function formatDateLabel(dateStr: string, isToday: boolean): string {
  if (isToday) return 'Today';
  const d = new Date(`${dateStr}T00:00:00`);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

const DailySummary: React.FC<DailySummaryProps> = ({
  userName,
  goalPercent,
  totalSteps,
  stepsGoal,
  totalCaloriesBurned,
  exerciseCalories,
  activeMinutes,
  selectedDate,
  isToday,
  loading,
  hasData,
  onPrevDay,
  onNextDay,
  onGoToToday,
}) => {
  const activeMinutesPercent = Math.min(100, Math.round((activeMinutes / ACTIVE_MINUTES_GOAL) * 100));
  const exerciseCaloriesPercent = Math.min(100, Math.round((exerciseCalories / EXERCISE_CALORIES_GOAL) * 100));

  return (
    <section className="col-span-12 bg-surface-container-lowest one-ui-rounded p-10 card-shadow flex flex-col gap-6 border border-outline-variant/10">
      {/* Date navigator */}
      <div className="flex items-center justify-between">
        <h3 className="text-headline-lg font-semibold text-on-surface">Daily Summary</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevDay}
            aria-label="Previous day"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span className="text-label-md font-bold text-on-surface min-w-[110px] text-center">
            {formatDateLabel(selectedDate, isToday)}
          </span>
          <button
            onClick={onNextDay}
            disabled={isToday}
            aria-label="Next day"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
          {!isToday && (
            <button
              onClick={onGoToToday}
              aria-label="Go to today"
              className="ml-1 px-3 h-9 text-label-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-between flex-wrap gap-8">
        <div className="max-w-md">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-surface-variant rounded w-3/4" />
              <div className="h-4 bg-surface-variant rounded w-1/2" />
              <div className="flex gap-3 mt-6">
                <div className="h-8 bg-surface-variant rounded-full w-32" />
                <div className="h-8 bg-surface-variant rounded-full w-28" />
              </div>
            </div>
          ) : !hasData ? (
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined">event_busy</span>
              <p className="text-body-lg">No data available for this day.</p>
            </div>
          ) : (
            <>
              <p className="text-body-lg text-on-surface-variant mb-8">
                You're doing great, {userName}! You've reached {goalPercent}% of your daily movement goal.
                Keep it up!
              </p>
              <div className="flex gap-4 flex-wrap">
                <div className="bg-secondary/10 px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">bolt</span>
                  <span className="text-label-md text-secondary">{totalCaloriesBurned.toLocaleString()} kcal total</span>
                </div>
                <div className="bg-error/10 px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="material-symbols-outlined text-error">local_fire_department</span>
                  <span className="text-label-md text-error">{exerciseCalories.toLocaleString()} kcal active</span>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">timer</span>
                  <span className="text-label-md text-primary">{activeMinutes} min active</span>
                </div>
              </div>
            </>
          )}
        </div>

        <ProgressRing
          percent={loading || !hasData ? 0 : goalPercent}
          label="Steps Goal"
          value={hasData && !loading ? `${totalSteps.toLocaleString()} / ${stepsGoal.toLocaleString()}` : undefined}
          innerRings={hasData && !loading ? [
            {
              percent: activeMinutesPercent,
              gradientStart: '#10b981',
              gradientEnd: '#34d399',
              label: 'Active time',
              value: `${activeMinutes} / ${ACTIVE_MINUTES_GOAL} min`,
            },
            {
              percent: exerciseCaloriesPercent,
              gradientStart: '#ef4444',
              gradientEnd: '#f97316',
              label: 'Active kcal',
              value: `${exerciseCalories.toLocaleString()} / ${EXERCISE_CALORIES_GOAL} kcal`,
            },
          ] : undefined}
        />
      </div>
    </section>
  );
};

export default DailySummary;
