import { SleepResponse } from './types';

const API_BASE = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8080';

export async function fetchSleep(date: string, signal?: AbortSignal): Promise<SleepResponse> {
  const res = await fetch(`${API_BASE}/sleeps/${date}`, { signal });
  if (!res.ok) throw new Error(`Sleep fetch failed: ${res.status}`);
  return res.json() as Promise<SleepResponse>;
}
