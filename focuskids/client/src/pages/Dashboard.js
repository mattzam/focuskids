import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PomodoroTimer from '../components/PomodoroTimer';
import TaskList from '../components/TaskList';
import StarsDisplay from '../components/StarsDisplay';

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();

  // Redirect if no profile selected
  useEffect(() => {
    if (!state.activeProfile) {
      navigate('/');
    }
  }, [state.activeProfile, navigate]);

  // Navigate to reward screen when session completes
  useEffect(() => {
    if (state.timerState === 'completed' && state.lastReward) {
      const timer = setTimeout(() => navigate('/reward'), 1200);
      return () => clearTimeout(timer);
    }
  }, [state.timerState, state.lastReward, navigate]);

  if (!state.activeProfile) return null;

  const profile = state.activeProfile;

  return (
    <div className="min-h-screen bg-bg-light flex flex-col" style={{ minHeight: '100dvh' }}>
      {/* Header */}
      <header className="flex items-center justify-between p-5 pt-6">
        <button
          onClick={() => navigate('/')}
          className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-slate-50 active:scale-90 transition-all"
          aria-label="Menú"
        >
          <span className="material-symbols-outlined text-primary">menu</span>
        </button>

        <h2 className="font-display text-2xl text-primary">FocusKids</h2>

        <button
          onClick={() => navigate('/')}
          className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm overflow-hidden hover:ring-2 hover:ring-primary transition-all"
          aria-label="Perfil"
        >
          <span className={`text-2xl ${profile.avatar?.bg || 'bg-orange-100'} w-full h-full flex items-center justify-center`}>
            {profile.avatar?.emoji || '🦄'}
          </span>
        </button>
      </header>

      <main className="flex-1 px-5 pb-24 overflow-y-auto">
        {/* Stars bar */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-slate-500 text-sm font-semibold">Hola, <span className="text-primary">{profile.name}!</span></p>
            <p className="text-xs text-slate-400">Nivel {profile.level} · {profile.streak} días seguidos 🔥</p>
          </div>
          <StarsDisplay />
        </div>

        {/* Pomodoro Timer - main component */}
        <PomodoroTimer />

        {/* Task list - max 3 */}
        <TaskList />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-slate-100 px-5 py-3 z-40">
        <div className="flex justify-between items-center">
          {[
            { icon: 'timer', label: 'Timer', active: true },
            { icon: 'list_alt', label: 'Tareas', active: false },
            { icon: 'leaderboard', label: 'Estadísticas', active: false },
            { icon: 'workspace_premium', label: 'Insignias', active: false },
          ].map(({ icon, label, active }) => (
            <a
              key={label}
              href="#"
              className={`flex flex-col items-center gap-1 ${active ? 'text-primary' : 'text-slate-400'}`}
            >
              <span className={`material-symbols-outlined ${active ? 'fill-icon' : ''}`}>{icon}</span>
              <span className="text-xs font-bold">{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
