import React from 'react';
import { WeekStepEntry } from '../types';

interface StepsCardProps {
  steps: number;
  goal: number;
  weekSteps?: WeekStepEntry[];
  selectedDate?: string;
  loading?: boolean;
}

const BAR_MAX_HEIGHT = 96; // px — chart area height

/** Normalise any date shape the API might return to a [YYYY, M, D] tuple. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normDate(raw: any): [number, number, number] {
  if (typeof raw === 'number') {
    const d = new Date(raw * 1000); // Unix seconds → ms
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
  }
  if (Array.isArray(raw) && raw.length >= 3) {
    return [Number(raw[0]), Number(raw[1]), Number(raw[2])];
  }
  if (typeof raw === 'string') {
    const parts = raw.split(/[-T ]/);
    return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
  }
  if (raw && typeof raw === 'object') {
    const y = raw.year ?? raw.Year;
    const m = raw.month ?? raw.monthValue ?? raw.Month;
    const d = raw.day ?? raw.dayOfMonth ?? raw.Day;
    if (y != null && m != null && d != null) return [Number(y), Number(m), Number(d)];
  }
  console.warn('[StepsCard] unrecognised date format:', raw);
  const today = new Date();
  return [today.getFullYear(), today.getMonth() + 1, today.getDate()];
}

function toDateString(date: [number, number, number] | string): string {
  const [y, m, d] = normDate(date);
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function weekdayLabel(date: [number, number, number] | string): string {
  const [y, m, d] = normDate(date);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'short' });
}

function monthYearLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

/** Always return exactly 7 slots (Mon–Sun) for the week containing the anchor dates in weekSteps. */
function buildWeekSlots(weekSteps: WeekStepEntry[]): Array<{ date: [number, number, number]; steps: number }> {
  if (weekSteps.length === 0) {
    // Fallback: build current week Mon–Sun
    const today = new Date();
    const dow = today.getDay(); // 0=Sun
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dow + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { date: [d.getFullYear(), d.getMonth() + 1, d.getDate()] as [number, number, number], steps: 0 };
    });
  }

  // Derive Monday of the week from the first entry
  const [y, m, d] = normDate(weekSteps[0].date);
  const anchor = new Date(y, m - 1, d);
  const dow = anchor.getDay();
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() - ((dow + 6) % 7));

  const lookup = new Map<string, number>();
  weekSteps.forEach((e) => lookup.set(toDateString(e.date), e.steps));

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const dateArr: [number, number, number] = [day.getFullYear(), day.getMonth() + 1, day.getDate()];
    const key = toDateString(dateArr);
    return { date: dateArr, steps: lookup.get(key) ?? 0 };
  });
}

const StepsCard: React.FC<StepsCardProps> = ({ steps, goal, weekSteps, selectedDate, loading = false }) => {
  const slots = weekSteps ? buildWeekSlots(weekSteps) : buildWeekSlots([]);
  const maxSteps = slots ? Math.max(...slots.map((e) => e.steps), 1) : 1;
  // Scale so the goal line always fits inside the chart
  const effectiveMax = Math.max(maxSteps, goal);

  const targetLineTop = BAR_MAX_HEIGHT - Math.round((goal / effectiveMax) * BAR_MAX_HEIGHT);

  const progressPercent = Math.min(100, Math.round((steps / goal) * 100));
  const metGoal = steps >= goal;

  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest one-ui-rounded p-8 card-shadow card-shadow-hover transition-all duration-300 border border-outline-variant/10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-label-md text-on-surface-variant uppercase tracking-wide mb-1">Steps</p>
          <h4 className="text-headline-md text-on-surface">
            {steps.toLocaleString()} <span className="text-body-md text-on-surface-variant font-normal">/ {goal.toLocaleString()}</span>
          </h4>
          {selectedDate && (
            <p className="text-[11px] text-on-surface-variant mt-1">{monthYearLabel(selectedDate)}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center rounded-2xl">
          <span className="material-symbols-outlined text-secondary">directions_walk</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="w-full mb-1 relative" style={{ height: BAR_MAX_HEIGHT }} aria-hidden="true">
        {/* Goal / target dashed line */}
        {!loading && (
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-secondary/60 z-10 flex items-center justify-end"
            style={{ top: targetLineTop }}
          >
            <span className="text-[9px] text-secondary/80 bg-surface-container-lowest px-1 -mt-2 leading-none">
              {goal.toLocaleString()}
            </span>
          </div>
        )}

        {/* Bars */}
        <div className="absolute inset-0 flex items-end gap-1">
          {loading ? (
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 rounded-t-sm bg-secondary/10 animate-pulse" style={{ height: 48 }} />
            ))
          ) : (
            slots.map((entry) => {
              const dateStr = toDateString(entry.date);
              const isSelected = dateStr === selectedDate;
              const barHeight = entry.steps > 0
                ? Math.max(4, Math.round((entry.steps / effectiveMax) * BAR_MAX_HEIGHT))
                : 4;
              return (
                <div
                  key={dateStr}
                  className={`flex-1 rounded-t-sm transition-all duration-500 ${isSelected ? 'bg-secondary' : 'bg-secondary/20'}`}
                  style={{ height: barHeight }}
                  title={`${entry.steps.toLocaleString()} steps`}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Legend: weekday + day number */}
      {!loading && (
        <div className="flex gap-1 mb-4 mt-2">
          {slots.map((entry) => {
            const dateStr = toDateString(entry.date);
            const isSelected = dateStr === selectedDate;
            return (
              <div key={dateStr} className="flex-1 flex flex-col items-center">
                <span className={`text-[9px] uppercase ${isSelected ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>
                  {weekdayLabel(entry.date)}
                </span>
                <span className={`text-[10px] font-bold ${isSelected ? 'text-secondary' : 'text-on-surface-variant'}`}>
                  {normDate(entry.date)[2]}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className={`flex items-center gap-2 ${metGoal ? 'text-secondary' : 'text-on-surface-variant'}`}>
        <span className="material-symbols-outlined text-[18px]">
          {metGoal ? 'check_circle' : 'directions_walk'}
        </span>
        <span className="text-label-sm">
          {metGoal ? 'Daily goal reached!' : `${progressPercent}% of daily goal`}
        </span>
      </div>
    </div>
  );
};

export default StepsCard;
