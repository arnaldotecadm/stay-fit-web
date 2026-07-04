export interface ExerciseSummary {
  dataPointUid: string;
  healthDataType: 'EXERCISE';
  exerciseType: string;
  date: string;        // "YYYY-MM-DD"
  startTime: string;   // "HH:mm:ss"
  endTime: string;     // "HH:mm:ss"
  distance: string;    // km, as string from API
  count: number;       // steps / reps
  duration: string;    // "HH:mm:ss.SSS"
  calories: number;
}
