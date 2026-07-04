import { useEffect, useReducer } from 'react';
import { fetchExercisesSummary } from './exercisesService';
import { ExerciseSummary } from './types';

interface State {
  data: ExerciseSummary[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: ExerciseSummary[] }
  | { type: 'FETCH_ERROR'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { loading: false, error: null, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
  }
}

const initialState: State = { data: [], loading: false, error: null };

export function useExercises() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;

    dispatch({ type: 'FETCH_START' });
    fetchExercisesSummary()
      .then((data) => {
        if (!cancelled) {
          const sorted = [...data].sort(
            (a, b) => new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime()
          );
          dispatch({ type: 'FETCH_SUCCESS', payload: sorted });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          dispatch({ type: 'FETCH_ERROR', payload: err instanceof Error ? err.message : 'Unknown error' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
