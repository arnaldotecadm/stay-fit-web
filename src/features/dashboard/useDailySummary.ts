import { useCallback, useEffect, useReducer, useState } from 'react';
import { fetchDailySummary } from './dailySummaryService';
import { DailySummaryResponse } from './types';

interface State {
  data: DailySummaryResponse | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: DailySummaryResponse }
  | { type: 'FETCH_ERROR'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { data: null, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { data: null, loading: false, error: action.payload };
  }
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function useDailySummary() {
  const [selectedDate, setSelectedDate] = useState<string>(() => toDateString(new Date()));
  const [state, dispatch] = useReducer(reducer, { data: null, loading: true, error: null });

  const todayStr = toDateString(new Date());
  const isToday = selectedDate === todayStr;

  const goToPrevDay = useCallback(() => {
    setSelectedDate((current) => {
      const d = new Date(`${current}T00:00:00`);
      d.setDate(d.getDate() - 1);
      return toDateString(d);
    });
  }, []);

  const goToNextDay = useCallback(() => {
    setSelectedDate((current) => {
      if (current >= todayStr) return current;
      const d = new Date(`${current}T00:00:00`);
      d.setDate(d.getDate() + 1);
      return toDateString(d);
    });
  }, [todayStr]);

  const goToToday = useCallback(() => {
    setSelectedDate(toDateString(new Date()));
  }, []);

  useEffect(() => {
    let cancelled = false;

    dispatch({ type: 'FETCH_START' });
    fetchDailySummary(selectedDate)
      .then((data) => {
        if (!cancelled) dispatch({ type: 'FETCH_SUCCESS', payload: data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          dispatch({ type: 'FETCH_ERROR', payload: err instanceof Error ? err.message : 'Unknown error' });
        }
      });

    return () => { cancelled = true; };
  }, [selectedDate]);

  return { ...state, selectedDate, isToday, goToPrevDay, goToNextDay, goToToday };
}
