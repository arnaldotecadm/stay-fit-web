import { HeartRateResponse } from './types';

const API_BASE = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8080';

export async function fetchHeartRate(date: string, signal?: AbortSignal): Promise<HeartRateResponse> {
  const res = await fetch(`${API_BASE}/heart-rate/${date}`, { signal });
  if (!res.ok) throw new Error(`Heart rate fetch failed: ${res.status}`);
  return res.json() as Promise<HeartRateResponse>;
}
