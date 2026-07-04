import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardPage from './features/dashboard/DashboardPage';
import ExercisesPage from './features/exercises/ExercisesPage';
import HeartRatePage from './features/heart-rate/HeartRatePage';
import SleepPage from './features/sleep/SleepPage';
import SettingsPage from './features/settings/SettingsPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="bg-background text-on-background font-sans overflow-hidden flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/exercises" element={<ExercisesPage />} />
            <Route path="/heart-rate" element={<HeartRatePage />} />
            <Route path="/sleep" element={<SleepPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
