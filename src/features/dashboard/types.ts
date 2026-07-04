export interface WeekStepEntry {
  date: any; // Unix timestamp (seconds), [YYYY, M, D] tuple, or "YYYY-MM-DD" string
  steps: number;
}

export interface ActivityListItem {
  exerciseType: string;
  calories: number;
  duration: number; // nanoseconds
  localdate?: number | string; // Unix timestamp (seconds) or ISO string
}

export interface DailySummaryResponse {
  totalSteps: number;
  activeTimeInMinutes: number;
  exerciseCalories: number;
  totalBurnedCalories: number;
  distanceWhileActive: number;
  date: any; // Unix timestamp (seconds), [YYYY, M, D] tuple, or "YYYY-MM-DD" string
  sleepScore: number | null;
  activityCount: number;
  activityCaloriesSum: number;
  weekSteps: WeekStepEntry[];
  activityList: ActivityListItem[];
}
