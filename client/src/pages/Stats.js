import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Stats() {
  const { state } = useApp();
  const navigate = useNavigate();
  const profile = state.activeProfile;

  useEffect(() => {
    if (!profile) navigate('/');
  }, [profile, navigate]);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-bg-light flex flex-col pb-24" style={{ minHeight: '100dvh' }}>
      {/* Header */}
      <header className="flex items-center gap-3 p-5 pt-6 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-90 transition-all text-slate-600"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-display text-slate-800">Mi Progreso</h1>
      </header>

      <main className="flex-1 p-5 overflow-y-auto">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6 flex flex-col items-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-5xl ${profile.avatar?.bg || 'bg-orange-100'} mb-3`}>
            {profile.avatar?.emoji || '🦄'}
          </div>
          <h2 className="text-xl font-display text-slate-800">{profile.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Nivel {profile.level}</span>
            <span className="text-sm font-bold text-accent-yellow bg-accent-yellow/10 px-3 py-1 rounded-full">⭐ {profile.stars}</span>
          </div>
        </div>

        <h3 className="text-xl font-display text-slate-800 mb-4 px-1">Tus Números Mágicos</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/10 p-5 rounded-2xl flex flex-col items-center text-center">
            <span className="text-4xl mb-2">⏱️</span>
            <span className="text-2xl font-display text-primary">{profile.sessions_completed || 0}</span>
            <span className="text-xs font-bold text-primary opacity-80">SESIONES COMPLETADAS</span>
          </div>
          
          <div className="bg-accent-green/10 p-5 rounded-2xl flex flex-col items-center text-center">
            <span className="text-4xl mb-2">🔥</span>
            <span className="text-2xl font-display text-accent-green">{profile.streak || 0}</span>
            <span className="text-xs font-bold text-accent-green opacity-80">DÍAS EN RACHA</span>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-bold text-slate-700 mb-4 text-center">Progreso al siguiente nivel</h4>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent-yellow rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((profile.stars % 100), 100)}%` }}
            />
          </div>
          <p className="text-center text-sm font-bold text-slate-400 mt-2">
            ¡Te faltan {100 - (profile.stars % 100)} estrellas para subir de nivel!
          </p>
        </div>
      </main>
    </div>
  );
}
