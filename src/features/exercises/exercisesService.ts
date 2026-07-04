import { ExerciseSummary } from './types';

const BASE_URL = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8080';

export async function fetchExercisesSummary(): Promise<ExerciseSummary[]> {
  const response = await fetch(`${BASE_URL}/exercises/summary`);
  if (!response.ok) {
    throw new Error(`Failed to fetch exercises: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<ExerciseSummary[]>;
}
