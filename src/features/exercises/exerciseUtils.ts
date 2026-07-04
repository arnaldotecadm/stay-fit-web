export function formatNsDuration(nanoseconds: number): string {
  const totalSeconds = Math.floor(nanoseconds / 1_000_000_000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export const EXERCISE_ICONS: Record<string, string> = {
  WALKING: 'directions_walk',
  RUNNING: 'directions_run',
  CYCLING: 'pedal_bike',
  SWIMMING: 'pool',
  HIKING: 'hiking',
  YOGA: 'self_improvement',
  STRENGTH_TRAINING: 'fitness_center',
  ELLIPTICAL: 'sports_gymnastics',
};

export const DEFAULT_EXERCISE_ICON = 'sports';

export function toTitleCase(str: string): string {
  return str.replace(/_/g, ' ').replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

export function formatDuration(duration: string): string {
  const [timePart] = duration.split('.');
  const [h, m, s] = timePart.split(':').map(Number);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatRelativeDateTime(date: string, startTime: string): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const toMidnight = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const itemDate = new Date(`${date}T00:00:00`);
  const [h, m] = startTime.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  const timeLabel = `${hour}:${String(m).padStart(2, '0')} ${period}`;

  if (toMidnight(itemDate) === toMidnight(today)) return `Today, ${timeLabel}`;
  if (toMidnight(itemDate) === toMidnight(yesterday)) return `Yesterday, ${timeLabel}`;

  return itemDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + `, ${timeLabel}`;
}
