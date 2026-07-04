import React from 'react';
import { Link } from 'react-router-dom';

interface Activity {
  id: string;
  icon: string;
  name: string;
  distance: string;
  calories: number;
  duration: string;
  when: string;
}

interface RecentActivitiesCardProps {
  activities: Activity[];
  loading?: boolean;
}

const SkeletonRow: React.FC = () => (
  <div className="p-6 bg-surface-container-low rounded-3xl flex items-center gap-6 animate-pulse">
    <div className="w-14 h-14 bg-surface-variant rounded-2xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-surface-variant rounded w-1/3" />
      <div className="h-2 bg-surface-variant rounded w-1/2" />
    </div>
    <div className="w-12 h-3 bg-surface-variant rounded" />
  </div>
);

const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({ activities, loading = false }) => {
  return (
    <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest one-ui-rounded p-8 card-shadow border border-outline-variant/10">
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-headline-md text-on-surface">Exercises</h4>
        <Link
          to="/exercises"
          className="text-primary text-label-md hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}

        {!loading && activities.length === 0 && (
          <p className="col-span-2 text-label-md text-on-surface-variant text-center py-8">
            No recent activities.
          </p>
        )}

        {!loading && activities.map((activity) => (
          <div
            key={activity.id}
            className="p-6 bg-surface-container-low rounded-3xl border border-transparent hover:border-primary/20 transition-colors flex items-center gap-6 group"
          >
            <div className="w-14 h-14 bg-primary text-on-primary flex items-center justify-center rounded-2xl group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">{activity.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-label-md font-bold mb-1">{activity.name}</h5>
              <div className="flex gap-4">
                <p className="text-[12px] text-on-surface-variant">{activity.distance}</p>
                <p className="text-[12px] text-on-surface-variant">{activity.calories} kcal</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-label-sm font-bold">{activity.duration}</p>
              <p className="text-[10px] text-on-surface-variant">{activity.when}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivitiesCard;
