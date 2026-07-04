export interface SleepStage {
  stage: 'AWAKE' | 'LIGHT' | 'DEEP' | 'REM' | 'UNDEFINED';
  durationInMinutes: number;
}

export interface SleepResponse {
  startTime: number;   // Unix seconds
  endTime: number;     // Unix seconds
  duration: number;    // seconds
  stages: SleepStage[];
}
