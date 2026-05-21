import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { rewardsAPI } from '../api';

export default function Badges() {
  const { state } = useApp();
  const navigate = useNavigate();
  const profile = state.activeProfile;
  const [earnedBadges, setEarnedBadges] = useState([]);
  
  // Catálogo completo de insignias mock o desde api si tuviéramos un endpoint
  const CATALOG = [
    { emoji: '⭐', name: 'Primera Estrella', desc: 'Completaste tu primera sesión.' },
    { emoji: '🏆', name: 'Campeón del Foco', desc: 'Completaste 10 sesiones.' },
    { emoji: '🌟', name: 'Superestrella', desc: 'Completaste 25 sesiones.' },
    { emoji: '🔥', name: 'En Racha', desc: 'Jugaste 3 días seguidos.' },
    { emoji: '🚀', name: 'Despegue', desc: 'Alcanzaste el Nivel 5.' },
  ];

  useEffect(() => {
    if (!profile) {
      navigate('/');
      return;
    }
    
    // Buscar los badges en la tabla rewards
    rewardsAPI.list(profile.id)
      .then(data => {
        // filtrar solos los que son de type "badge"
        const badges = data.filter(r => r.type === 'badge');
        setEarnedBadges(badges);
      })
      .catch(err => console.error("Error loading badges:", err));
  }, [profile, navigate]);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-bg-light flex flex-col pb-24" style={{ minHeight: '100dvh' }}>
      <header className="flex items-center gap-3 p-5 pt-6 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-90 transition-all text-slate-600"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-display text-slate-800">Mis Insignias</h1>
      </header>

      <main className="flex-1 p-5 overflow-y-auto">
        <div className="text-center mb-6">
          <span className="text-6xl inline-block mb-2">🏅</span>
          <h2 className="text-xl font-bold text-slate-500">Colección de {profile.name}</h2>
          <p className="text-primary font-bold text-lg mt-1">¡Tienes {earnedBadges.length} insignias!</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {CATALOG.map((item, idx) => {
            const hasBadge = earnedBadges.some(eb => eb.badge_emoji === item.emoji || eb.badge_name === item.name);
            
            return (
              <div 
                key={idx} 
                className={`p-4 rounded-3xl flex flex-col items-center text-center border-2 transition-all ${hasBadge ? 'bg-white border-accent-yellow/30 shadow-md shadow-accent-yellow/10' : 'bg-slate-50 border-slate-100 opacity-60 grayscale'}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl mb-3 ${hasBadge ? 'bg-accent-yellow/20' : 'bg-slate-200'}`}>
                  {item.emoji}
                </div>
                <h3 className={`font-bold text-sm mb-1 ${hasBadge ? 'text-slate-800' : 'text-slate-500'}`}>{item.name}</h3>
                <p className="text-xs text-slate-400 font-semibold leading-tight">{item.desc}</p>
                
                {!hasBadge && (
                  <div className="mt-3 text-xs font-bold text-slate-400 bg-slate-200 px-3 py-1 rounded-full">
                    Bloqueado 🔒
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
