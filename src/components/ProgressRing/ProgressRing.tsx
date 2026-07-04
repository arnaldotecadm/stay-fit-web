import React, { useEffect, useRef } from 'react';

interface InnerRingConfig {
  percent: number;
  gradientStart: string;
  gradientEnd: string;
  label: string;
  value: string; // face value shown in the legend instead of %
}

interface RingGeometry {
  radius: number;
  strokeWidth: number;
  gradientId: string;
  gradientStart: string;
  gradientEnd: string;
  percent: number;
  label: string;
  value: string;
  trackColor: string;
}

interface ProgressRingProps {
  percent: number;
  label?: string;
  value?: string; // legend value for the outer ring; defaults to `${percent}%`
  innerRings?: InnerRingConfig[];
}

// Each ring's inner edge touches the next ring's outer edge
const GEOMETRIES = [
  { radius: 110, strokeWidth: 20 }, // outer  — inner edge: 100
  { radius:  92, strokeWidth: 16 }, // middle — outer edge: 100, inner edge: 84
  { radius:  77, strokeWidth: 14 }, // inner  — outer edge: 84,  inner edge: 70
];

const OUTER_GRADIENT  = { start: '#0059b9', end: '#0e71e4' };
const TRACK_COLOR     = '#e8edf2';

function buildRings(
  percent: number,
  outerLabel: string,
  outerValue: string,
  innerRings?: InnerRingConfig[]
): RingGeometry[] {
  const configs = [
    { percent, gradientStart: OUTER_GRADIENT.start, gradientEnd: OUTER_GRADIENT.end, label: outerLabel, value: outerValue },
    ...(innerRings ?? []).slice(0, 2),
  ];
  return configs.map((c, i) => ({
    ...GEOMETRIES[i],
    percent: c.percent,
    gradientId: `pg_${i}`,
    gradientStart: c.gradientStart,
    gradientEnd: c.gradientEnd,
    label: c.label,
    value: c.value,
    trackColor: TRACK_COLOR,
  }));
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  percent,
  label = 'Steps Goal',
  value,
  innerRings,
}) => {
  const rings = buildRings(percent, label, value ?? `${percent}%`, innerRings);
  const { radius: outerR, strokeWidth: outerSW } = GEOMETRIES[0];
  const size = (outerR + outerSW) * 2; // 260 px
  const cx = size / 2;
  const cy = size / 2;

  const refs = [
    useRef<SVGCircleElement>(null),
    useRef<SVGCircleElement>(null),
    useRef<SVGCircleElement>(null),
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    rings.forEach((ring, i) => {
      const el = refs[i].current;
      if (!el) return;
      const circ = ring.radius * 2 * Math.PI;
      el.style.strokeDasharray  = `${circ} ${circ}`;
      el.style.strokeDashoffset = `${circ}`;
      timers.push(
        setTimeout(() => {
          el.style.strokeDashoffset = `${circ - (ring.percent / 100) * circ}`;
        }, 100 + i * 80)
      );
    });
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percent, innerRings?.[0]?.percent, innerRings?.[1]?.percent]);

  return (
    <div className="flex flex-col items-center gap-3 flex-shrink-0">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90" aria-hidden="true">
          <defs>
            {rings.map((r) => (
              <linearGradient key={r.gradientId} id={r.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={r.gradientStart} />
                <stop offset="100%" stopColor={r.gradientEnd} />
              </linearGradient>
            ))}
          </defs>
          {rings.map((ring, i) => (
            <g key={ring.gradientId}>
              <circle cx={cx} cy={cy} r={ring.radius} fill="transparent" stroke={ring.trackColor} strokeWidth={ring.strokeWidth} />
              <circle
                ref={refs[i]}
                cx={cx} cy={cy} r={ring.radius}
                fill="transparent"
                stroke={`url(#${ring.gradientId})`}
                strokeWidth={ring.strokeWidth}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </g>
          ))}
        </svg>

        {/* Center text — main ring only */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-display-metrics font-bold text-on-surface leading-none">
            {percent}<span className="text-headline-md">%</span>
          </span>
          <span className="text-[10px] text-on-surface-variant uppercase tracking-wide mt-1">{label}</span>
        </div>
      </div>

      {/* Legend */}
      {rings.length > 1 && (
        <div className="flex flex-col gap-1">
          {rings.map((ring, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${ring.gradientStart}, ${ring.gradientEnd})` }}
              />
              <span className="text-[11px] text-on-surface-variant">{ring.label}</span>
              <span className="text-[11px] font-bold text-on-surface ml-auto pl-4">{ring.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressRing;
