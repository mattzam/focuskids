import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProfileSelect from './pages/ProfileSelect';
import Dashboard from './pages/Dashboard';
import RewardScreen from './pages/RewardScreen';
import ParentPanel from './pages/ParentPanel';
import Stats from './pages/Stats';
import Badges from './pages/Badges';
import Library from './pages/Library';
import './index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-bg-light max-w-md mx-auto relative shadow-2xl overflow-hidden">
          <Routes>
            <Route path="/" element={<ProfileSelect />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reward" element={<RewardScreen />} />
            <Route path="/parent" element={<ParentPanel />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/badges" element={<Badges />} />
            <Route path="/library" element={<Library />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
