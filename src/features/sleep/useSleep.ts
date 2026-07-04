import { useEffect, useReducer } from 'react';
import { SleepResponse } from './types';
import { fetchSleep } from './sleepService';

interface State {
  data: SleepResponse | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: SleepResponse }
  | { type: 'FETCH_ERROR'; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { data: null, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { data: null, loading: false, error: action.error };
    default:
      return state;
  }
}

export function useSleep(date: string | null) {
  const [state, dispatch] = useReducer(reducer, { data: null, loading: true, error: null });

  useEffect(() => {
    if (!date) {
      dispatch({ type: 'FETCH_ERROR', error: 'No date provided' });
      return;
    }
    const controller = new AbortController();
    dispatch({ type: 'FETCH_START' });
    fetchSleep(date, controller.signal)
      .then((data) => {
        // API returns all-null fields when no data exists for that day
        if (data.duration == null) {
          dispatch({ type: 'FETCH_ERROR', error: 'no data' });
        } else {
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          dispatch({ type: 'FETCH_ERROR', error: String(err) });
        }
      });
    return () => controller.abort();
  }, [date]);

  return state;
}
