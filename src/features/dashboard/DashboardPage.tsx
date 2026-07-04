import React, { useMemo } from 'react';
import DailySummary from './components/DailySummary';
import StepsCard from './components/StepsCard';
import HeartRateCard from './components/HeartRateCard';
import SleepCard from './components/SleepCard';
import RecentActivitiesCard from './components/RecentActivitiesCard';
import WeightCard from './components/WeightCard';
import { useDailySummary } from './useDailySummary';
import { useSleep } from '../sleep/useSleep';
import { useHeartRate } from '../heart-rate/useHeartRate';
import {
  EXERCISE_ICONS,
  DEFAULT_EXERCISE_ICON,
  toTitleCase,
  formatNsDuration,
  formatRelativeDateTime,
} from '../exercises/exerciseUtils';

const STEPS_GOAL = 6_000;

const STATIC_DATA = {
  user: { name: 'John' },
  weight: { currentKg: 74.2, targetKg: 72.0, changeKg: -0.5 },
};

const DashboardPage: React.FC = () => {
  const { selectedDate, isToday, loading, data, goToPrevDay, goToNextDay, goToToday } = useDailySummary();
  const { data: sleepData, loading: sleepLoading } = useSleep(selectedDate);
  const { data: heartRateData, loading: heartRateLoading } = useHeartRate(selectedDate);

  const goalPercent = data
    ? Math.min(100, Math.round((data.totalSteps / STEPS_GOAL) * 100))
    : 0;

  const recentActivities = useMemo(
    () =>
      (data?.activityList ?? []).map((activity, i) => {
        let actDate = selectedDate;
        let actTime = '00:00:00';
        if (activity.localdate != null) {
          const d = typeof activity.localdate === 'number'
            ? new Date(activity.localdate * 1000)
            : new Date(activity.localdate);
          const yy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          actDate = `${yy}-${mm}-${dd}`;
          actTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`;
        }
        return {
          id: `${activity.exerciseType}-${i}`,
          icon: EXERCISE_ICONS[activity.exerciseType] ?? DEFAULT_EXERCISE_ICON,
          name: toTitleCase(activity.exerciseType),
          distance: '—',
          calories: Math.round(activity.calories),
          duration: formatNsDuration(activity.duration),
          when: formatRelativeDateTime(actDate, actTime),
        };
      }),
    [data?.activityList, selectedDate]
  );

  return (
    <main className="flex-1 overflow-y-auto px-10 pb-12 pt-4">
      {/* Hero: Daily Summary */}
      <section className="grid grid-cols-12 gap-6 mb-6">
        <DailySummary
          userName={STATIC_DATA.user.name}
          goalPercent={goalPercent}
          totalSteps={data?.totalSteps ?? 0}
          stepsGoal={STEPS_GOAL}
          totalCaloriesBurned={data?.totalBurnedCalories ?? 0}
          exerciseCalories={data?.exerciseCalories ?? 0}
          activeMinutes={data?.activeTimeInMinutes ?? 0}
          selectedDate={selectedDate}
          isToday={isToday}
          loading={loading}
          hasData={data !== null}
          onPrevDay={goToPrevDay}
          onNextDay={goToNextDay}
          onGoToToday={goToToday}
        />
      </section>

      {/* Metric Cards Grid */}
      <section className="grid grid-cols-12 gap-6">
        <StepsCard steps={data?.totalSteps ?? 0} goal={STEPS_GOAL} weekSteps={data?.weekSteps} selectedDate={selectedDate} loading={loading} />
        <HeartRateCard
          data={heartRateData}
          loading={heartRateLoading}
        />
        <SleepCard
          data={sleepData}
          sleepScore={data?.sleepScore}
          loading={sleepLoading}
        />
        <RecentActivitiesCard
          activities={recentActivities}
          loading={loading}
        />
        <WeightCard
          currentKg={STATIC_DATA.weight.currentKg}
          targetKg={STATIC_DATA.weight.targetKg}
          changeKg={STATIC_DATA.weight.changeKg}
        />
      </section>
    </main>
  );
};

export default DashboardPage;
