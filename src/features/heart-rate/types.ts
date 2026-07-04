export interface HeartRateEntry {
  date: number; // Unix timestamp (seconds)
  averageHeartRate: number;
  maxHeartRate: number;
  minHeartRate: number;
}

export type HeartRateResponse = HeartRateEntry[];
