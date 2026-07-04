import React from 'react';
import { SleepResponse, SleepStage } from '../../sleep/types';

interface SleepCardProps {
  data: SleepResponse | null;
  sleepScore?: number | null;
  loading?: boolean;
}

const STAGE_META: Record<SleepStage['stage'], { label: string; color: string; bg: string }> = {
  DEEP:      { label: 'Deep',      color: 'bg-primary',        bg: 'bg-primary' },
  REM:       { label: 'REM',       color: 'bg-tertiary',        bg: 'bg-tertiary' },
  LIGHT:     { label: 'Light',     color: 'bg-secondary',       bg: 'bg-secondary' },
  AWAKE:     { label: 'Awake',     color: 'bg-outline-variant', bg: 'bg-outline-variant' },
  UNDEFINED: { label: 'Unknown',   color: 'bg-surface-variant', bg: 'bg-surface-variant' },
};

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function formatDurationSecs(secs: number): string {
  return formatMinutes(secs / 60);
}

const SleepCard: React.FC<SleepCardProps> = ({ data, sleepScore, loading }) => {
  const aggregatedStages = data
    ? Object.values(
        data.stages.reduce<Record<string, { stage: SleepStage['stage']; durationInMinutes: number }>>(
          (acc, s) => {
            if (acc[s.stage]) {
              acc[s.stage].durationInMinutes += s.durationInMinutes;
            } else {
              acc[s.stage] = { stage: s.stage, durationInMinutes: s.durationInMinutes };
            }
            return acc;
          },
          {}
        )
      )
    : [];

  const totalMins = data ? data.duration / 60 : 0;
  const sleepMins = aggregatedStages
    .filter((s) => s.stage !== 'AWAKE')
    .reduce((sum, s) => sum + s.durationInMinutes, 0);
  const totalStageMins = aggregatedStages.reduce((sum, s) => sum + s.durationInMinutes, 0);

  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest one-ui-rounded p-8 card-shadow card-shadow-hover transition-all duration-300 border border-outline-variant/10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-label-md text-on-surface-variant uppercase tracking-wide mb-1">Sleep</p>
          <h4 className="text-headline-md text-on-surface">
            {loading ? (
              <span className="inline-block w-20 h-6 bg-surface-container animate-pulse rounded" />
            ) : data ? (
              formatDurationSecs(data.duration)
            ) : '—'}
          </h4>
          {!loading && data && sleepMins !== totalMins && (
            <p className="text-[11px] text-on-surface-variant mt-1">
              {formatMinutes(sleepMins)} asleep
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-2xl">
          <span className="material-symbols-outlined text-primary">bedtime</span>
        </div>
      </div>

      {/* Sleep score */}
      {sleepScore != null && (
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-label-sm">Sleep Score</span>
            <span className="text-label-sm font-bold">{sleepScore}/100</span>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${sleepScore}%` }} />
          </div>
        </div>
      )}

      {/* Stacked bar */}
      {loading ? (
        <div className="w-full h-3 rounded-full bg-surface-container animate-pulse mb-5" />
      ) : data && totalStageMins > 0 ? (
        <div className="w-full h-3 rounded-full overflow-hidden flex mb-5">
          {aggregatedStages.map((s) => (
            <div
              key={s.stage}
              className={`${STAGE_META[s.stage].bg} h-full transition-all duration-500`}
              style={{ width: `${(s.durationInMinutes / totalStageMins) * 100}%` }}
              title={`${STAGE_META[s.stage].label}: ${formatMinutes(s.durationInMinutes)}`}
            />
          ))}
        </div>
      ) : null}

      {/* Stage breakdown */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-surface-container animate-pulse" />
              <div className="flex-1 h-3 bg-surface-container animate-pulse rounded" />
              <div className="w-10 h-3 bg-surface-container animate-pulse rounded" />
            </div>
          ))
        ) : data ? (
          aggregatedStages.map((s) => (
            <div key={s.stage} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${STAGE_META[s.stage].color}`} />
              <p className="text-label-sm flex-1">{STAGE_META[s.stage].label}</p>
              <p className="text-label-sm text-on-surface-variant">{formatMinutes(s.durationInMinutes)}</p>
            </div>
          ))
        ) : (
          <p className="text-label-sm text-on-surface-variant">No sleep data available</p>
        )}
      </div>
    </div>
  );
};

export default SleepCard;
