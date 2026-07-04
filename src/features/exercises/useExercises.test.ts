import { renderHook, waitFor } from '@testing-library/react';
import { useExercises } from './useExercises';
import { fetchExercisesSummary } from './exercisesService';
import { ExerciseSummary } from './types';

jest.mock('./exercisesService');
const mockFetch = fetchExercisesSummary as jest.MockedFunction<typeof fetchExercisesSummary>;

const FIXTURES: ExerciseSummary[] = [
  {
    dataPointUid: 'uid-1',
    healthDataType: 'EXERCISE',
    exerciseType: 'WALKING',
    date: '2026-06-06',
    startTime: '17:27:24',
    endTime: '17:39:28',
    distance: '0.597',
    count: 776,
    duration: '00:11:50.823',
    calories: 70.712,
  },
  {
    dataPointUid: 'uid-2',
    healthDataType: 'EXERCISE',
    exerciseType: 'RUNNING',
    date: '2026-06-05',
    startTime: '07:00:00',
    endTime: '07:30:00',
    distance: '5.1',
    count: 0,
    duration: '00:30:00.000',
    calories: 320,
  },
];

describe('useExercises', () => {
  afterEach(() => jest.resetAllMocks());

  it('returns loading=true initially', () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useExercises());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('returns sorted data on success (most recent first)', async () => {
    mockFetch.mockResolvedValue(FIXTURES);
    const { result } = renderHook(() => useExercises());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.data[0].dataPointUid).toBe('uid-1'); // 2026-06-06 > 2026-06-05
    expect(result.current.data[1].dataPointUid).toBe('uid-2');
  });

  it('sets error message on fetch failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useExercises());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Network error');
    expect(result.current.data).toEqual([]);
  });
});
