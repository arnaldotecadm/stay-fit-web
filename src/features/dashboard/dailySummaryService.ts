import { DailySummaryResponse } from './types';

const BASE_URL = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8080';

export async function fetchDailySummary(date: string): Promise<DailySummaryResponse> {
  const response = await fetch(`${BASE_URL}/daily-summary/${date}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch daily summary: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<DailySummaryResponse>;
}
