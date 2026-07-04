import { useEffect, useReducer } from 'react';
import { HeartRateResponse } from './types';
import { fetchHeartRate } from './heartRateService';

interface State {
  data: HeartRateResponse | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: HeartRateResponse }
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

export function useHeartRate(date: string | null) {
  const [state, dispatch] = useReducer(reducer, { data: null, loading: true, error: null });

  useEffect(() => {
    if (!date) {
      dispatch({ type: 'FETCH_ERROR', error: 'No date provided' });
      return;
    }
    const controller = new AbortController();
    dispatch({ type: 'FETCH_START' });
    fetchHeartRate(date, controller.signal)
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
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
