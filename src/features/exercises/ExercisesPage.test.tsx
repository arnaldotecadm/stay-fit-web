import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExercisesPage from './ExercisesPage';
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

const MULTI_DAY_FIXTURES: ExerciseSummary[] = [
  ...FIXTURES,
  {
    dataPointUid: 'uid-3',
    healthDataType: 'EXERCISE',
    exerciseType: 'WALKING',
    date: '2026-06-06',
    startTime: '08:00:00',
    endTime: '08:20:00',
    distance: '1.2',
    count: 1500,
    duration: '00:20:00.000',
    calories: 90,
  },
];

describe('ExercisesPage', () => {
  afterEach(() => jest.resetAllMocks());

  it('shows a loading spinner while fetching', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    render(<ExercisesPage />);
    expect(screen.getByRole('status', { name: /loading exercises/i })).toBeInTheDocument();
  });

  it('shows an error message when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Server unavailable'));
    render(<ExercisesPage />);

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByText(/server unavailable/i)).toBeInTheDocument();
  });

  it('shows empty state when API returns no data', async () => {
    mockFetch.mockResolvedValue([]);
    render(<ExercisesPage />);

    await waitFor(() => expect(screen.getByText(/no exercise data found/i)).toBeInTheDocument());
  });

  it('renders stats bar and exercise cards on success', async () => {
    mockFetch.mockResolvedValue(FIXTURES);
    render(<ExercisesPage />);

    await waitFor(() => expect(screen.getByText('Sessions')).toBeInTheDocument());

    expect(screen.getByText('2')).toBeInTheDocument(); // sessions count
    const section = screen.getByRole('region', { name: /exercise sessions/i });
    expect(section).toHaveTextContent('Walking');
    expect(section).toHaveTextContent('Running');
  });

  it('groups exercises under separate sticky date headings', async () => {
    mockFetch.mockResolvedValue(MULTI_DAY_FIXTURES);
    render(<ExercisesPage />);

    const section = await waitFor(() => screen.getByRole('region', { name: /exercise sessions/i }));

    // Each date group wrapper has a data-testid we can count
    const dateGroups = section.querySelectorAll('[data-testid="date-group"]');
    expect(dateGroups.length).toBe(2); // two unique dates in MULTI_DAY_FIXTURES
  });

  it('filters exercises by type when a filter chip is clicked', async () => {
    mockFetch.mockResolvedValue(FIXTURES);
    render(<ExercisesPage />);

    await waitFor(() => screen.getByRole('group', { name: /filter by exercise type/i }));

    await userEvent.click(screen.getByRole('button', { name: /^walking$/i }));

    const section = screen.getByRole('region', { name: /exercise sessions/i });
    expect(section).toHaveTextContent('Walking');
    expect(section).not.toHaveTextContent('Running');
  });
});
