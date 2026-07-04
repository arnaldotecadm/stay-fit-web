import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { HeartRateEntry } from '../../heart-rate/types';

interface HeartRateCardProps {
  data: HeartRateEntry[] | null;
  loading?: boolean;
}

const SECS_IN_DAY = 86400;

function toHHMM(unixSecs: number): string {
  const d = new Date(unixSecs * 1000);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function secsSinceMidnight(unixSecs: number): number {
  const d = new Date(unixSecs * 1000);
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
}

interface ChartConfig {
  w: number;
  h: number;
  padding: number;
  labelH: number;
  hourTicks: number[];
}

interface ChartData {
  line: string;
  fill: string;
  peakX: number;
  peakY: number;
  peakTime: string;
  peakBpm: number;
  xLabels: Array<{ x: number; label: string }>;
  svgH: number;
}

function buildChart(entries: HeartRateEntry[], cfg: ChartConfig): ChartData | null {
  if (entries.length === 0) return null;
  const { w, h, padding, labelH, hourTicks } = cfg;

  const values = entries.map((e) => e.averageHeartRate);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;

  const toX = (e: HeartRateEntry) =>
    padding + (secsSinceMidnight(e.date) / SECS_IN_DAY) * (w - padding * 2);
  const toY = (v: number) =>
    h - padding - ((v - minV) / range) * (h - padding * 2);

  const points = entries.map((e) => `${toX(e)},${toY(e.averageHeartRate)}`);
  const line = `M${points.join(' L')}`;
  const fill = `${line} L${toX(entries[entries.length - 1])},${h} L${toX(entries[0])},${h} Z`;

  const peakIdx = values.indexOf(maxV);
  const peakX = toX(entries[peakIdx]);
  const peakY = toY(maxV);
  const peakTime = toHHMM(entries[peakIdx].date);

  const xLabels = hourTicks.map((hh) => ({
    x: padding + ((hh * 3600) / SECS_IN_DAY) * (w - padding * 2),
    label: hh === 24 ? '23:59' : `${String(hh).padStart(2, '0')}:00`,
  }));

  return { line, fill, peakX, peakY, peakTime, peakBpm: Math.round(maxV), xLabels, svgH: h + labelH };
}

const CARD_CFG: ChartConfig = { w: 400, h: 60,  padding: 4, labelH: 16, hourTicks: [0, 6, 12, 18, 24] };
const MODAL_CFG: ChartConfig = { w: 800, h: 200, padding: 8, labelH: 20, hourTicks: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24] };

// ── Shared SVG chart ──────────────────────────────────────────────────────────
interface HeartChartProps {
  chart: ChartData;
  cfg: ChartConfig;
  gradientId: string;
  strokeWidth?: number;
  peakFontSize?: number;
  tickFontSize?: number;
}

const HeartChart: React.FC<HeartChartProps> = ({
  chart, cfg, gradientId, strokeWidth = 2.5, peakFontSize = 10, tickFontSize = 9,
}) => (
  <svg viewBox={`0 0 ${cfg.w} ${chart.svgH}`} className="w-full overflow-visible" aria-hidden="true">
    <defs>
      <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#b1222a" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#b1222a" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d={chart.fill} fill={`url(#${gradientId})`} />
    <path d={chart.line} fill="none" stroke="#b1222a" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={chart.peakX} cy={chart.peakY} r={strokeWidth + 1.5} fill="#b1222a" />
    <text
      x={Math.min(Math.max(chart.peakX, 40), cfg.w - 40)}
      y={Math.max(chart.peakY - 8, peakFontSize)}
      textAnchor="middle"
      fontSize={peakFontSize}
      fontWeight="bold"
      fill="#b1222a"
    >
      {chart.peakBpm} bpm · {chart.peakTime}
    </text>
    {chart.xLabels.map(({ x, label }) => (
      <text
        key={label}
        x={Math.min(Math.max(x, 16), cfg.w - 16)}
        y={cfg.h + cfg.labelH - 2}
        textAnchor="middle"
        fontSize={tickFontSize}
        fill="#888"
      >
        {label}
      </text>
    ))}
  </svg>
);

// ── Lightbox modal ────────────────────────────────────────────────────────────
interface ModalProps {
  data: HeartRateEntry[];
  stats: { min: number; avg: number; max: number };
  onClose: () => void;
}

const HeartRateModal: React.FC<ModalProps> = ({ data, stats, onClose }) => {
  const chart = useMemo(() => buildChart(data, MODAL_CFG), [data]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Heart Rate details"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 bg-surface-container-lowest one-ui-rounded p-8 card-shadow w-full max-w-3xl border border-outline-variant/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-tertiary/10 flex items-center justify-center rounded-2xl">
              <span className="material-symbols-outlined text-tertiary">favorite</span>
            </div>
            <div>
              <p className="text-label-md text-on-surface-variant uppercase tracking-wide">Heart Rate</p>
              <h3 className="text-headline-md text-on-surface">
                {stats.avg} <span className="text-body-md text-on-surface-variant font-normal">bpm avg</span>
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Expanded chart */}
        <div className="mb-6">
          {chart && <HeartChart chart={chart} cfg={MODAL_CFG} gradientId="heartGradientModal" strokeWidth={2} peakFontSize={13} tickFontSize={10} />}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 border-t border-surface-container pt-5">
          {([
            { label: 'Min', value: stats.min, color: 'text-on-surface' },
            { label: 'Avg', value: stats.avg, color: 'text-tertiary' },
            { label: 'Max', value: stats.max, color: 'text-error' },
          ] as const).map(({ label, value, color }) => (
            <div key={label} className="text-center bg-surface-container rounded-2xl py-4">
              <p className="text-[10px] uppercase text-on-surface-variant font-bold mb-1">{label}</p>
              <p className={`text-headline-sm font-bold ${color}`}>{value}</p>
              <p className="text-[11px] text-on-surface-variant">bpm</p>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};

// ── Card ──────────────────────────────────────────────────────────────────────
const HeartRateCard: React.FC<HeartRateCardProps> = ({ data, loading = false }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => { if (data && data.length > 0) setModalOpen(true); }, [data]);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    const avg = Math.round(data.reduce((s, e) => s + e.averageHeartRate, 0) / data.length);
    const max = Math.round(Math.max(...data.map((e) => e.maxHeartRate)));
    const min = Math.round(Math.min(...data.map((e) => e.minHeartRate)));
    return { avg, max, min };
  }, [data]);

  const chart = useMemo(() => (data && data.length > 0 ? buildChart(data, CARD_CFG) : null), [data]);

  return (
    <>
      <div
        onClick={openModal}
        className={`col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest one-ui-rounded p-8 card-shadow card-shadow-hover transition-all duration-300 border border-outline-variant/10 ${data && data.length > 0 ? 'cursor-pointer' : ''}`}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-label-md text-on-surface-variant uppercase tracking-wide mb-1">Heart Rate</p>
            <h4 className="text-headline-md text-on-surface">
              {loading ? (
                <span className="inline-block w-20 h-6 bg-surface-container animate-pulse rounded" />
              ) : stats ? (
                <>{stats.avg} <span className="text-body-md text-on-surface-variant font-normal">bpm avg</span></>
              ) : (
                '—'
              )}
            </h4>
          </div>
          <div className="w-12 h-12 bg-tertiary/10 flex items-center justify-center rounded-2xl">
            <span className="material-symbols-outlined text-tertiary">favorite</span>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-6">
          {loading ? (
            <div className="w-full h-12 bg-surface-container animate-pulse rounded" />
          ) : chart ? (
            <HeartChart chart={chart} cfg={CARD_CFG} gradientId="heartGradientCard" />
          ) : (
            <p className="text-label-sm text-on-surface-variant w-full text-center py-4">No data available</p>
          )}
        </div>

        {/* Stats footer */}
        <div className="flex justify-between border-t border-surface-container pt-4">
          {(['Min', 'Avg', 'Max'] as const).map((label) => (
            <div key={label} className="text-center">
              <p className="text-[10px] uppercase text-on-surface-variant font-bold">{label}</p>
              {loading ? (
                <div className="w-12 h-4 bg-surface-container animate-pulse rounded mx-auto mt-1" />
              ) : (
                <p className={`text-label-md ${label === 'Avg' ? 'text-tertiary' : ''}`}>
                  {stats ? `${stats[label.toLowerCase() as 'min' | 'avg' | 'max']} bpm` : '—'}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {modalOpen && stats && data && (
        <HeartRateModal data={data} stats={stats} onClose={closeModal} />
      )}
    </>
  );
};

export default HeartRateCard;
