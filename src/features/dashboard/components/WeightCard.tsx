import React from 'react';

interface WeightCardProps {
  currentKg: number;
  targetKg: number;
  changeKg: number;
}

const WeightCard: React.FC<WeightCardProps> = ({ currentKg, targetKg, changeKg }) => {
  const progressPercent = Math.min(100, Math.round((currentKg / targetKg) * 100));
  const isLoss = changeKg < 0;

  return (
    <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest one-ui-rounded p-8 card-shadow border border-outline-variant/10">
      <h4 className="text-headline-md text-on-surface mb-6">Weight</h4>

      <div className="flex items-end gap-2 mb-8">
        <span className="text-display-metrics font-bold leading-none">{currentKg}</span>
        <span className="text-headline-md text-on-surface-variant mb-1">kg</span>
        <div className="mb-2 ml-4 flex items-center text-secondary">
          <span className="material-symbols-outlined text-[18px]">
            {isLoss ? 'trending_down' : 'trending_up'}
          </span>
          <span className="text-label-sm font-bold">
            {isLoss ? '' : '+'}
            {changeKg} kg
          </span>
        </div>
      </div>

      <div className="relative h-32 w-full flex items-end">
        <div className="relative z-10 w-full p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white">
          <p className="text-label-sm text-on-surface-variant">Target Weight: {targetKg} kg</p>
          <div className="w-full bg-surface-container h-1 rounded-full mt-2">
            <div className="bg-primary h-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightCard;
