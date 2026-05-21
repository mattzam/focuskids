import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, AVATARS } from '../context/AppContext';

export default function ProfileSelect() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [showParentPin, setShowParentPin] = useState(false);
  const [pin, setPin] = useState('');

  const handleSelectProfile = (profile) => {
    dispatch({ type: 'SELECT_PROFILE', payload: profile });
    navigate('/dashboard');
  };

  const handleAddProfile = () => {
    if (newName.trim()) {
      dispatch({
        type: 'ADD_PROFILE',
        payload: { name: newName.trim(), avatarIndex: selectedAvatar },
      });
      setShowAddModal(false);
      setNewName('');
    }
  };

  const handleParentAccess = () => {
    if (pin === '1234') {
      navigate('/parent');
    } else {
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-bg-light flex flex-col" style={{ minHeight: '100dvh' }}>
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-3xl">rocket_launch</span>
          </div>
          <h1 className="text-2xl font-display text-primary tracking-wide">FocusKids</h1>
        </div>
        <button
          onClick={() => setShowParentPin(true)}
          className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          aria-label="Panel de padres"
        >
          <span className="material-symbols-outlined text-2xl">settings</span>
        </button>
      </header>

      <main className="flex-1 px-6 pb-28 overflow-y-auto">
        {/* Hero section */}
        <section className="mt-2 mb-8 text-center">
          <div className="float-animation inline-block text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-display mb-2 text-slate-800">¿Quién aprende hoy?</h2>
          <p className="text-slate-500 font-semibold">¡Elige tu perfil para comenzar!</p>
        </section>

        {/* Profiles grid */}
        <section className="grid grid-cols-2 gap-5 mb-10 max-w-sm mx-auto">
          {state.profiles.map((profile, i) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSelect={() => handleSelectProfile(profile)}
              delay={i * 100}
            />
          ))}
          <div className="flex flex-col items-center col-span-2 mt-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-3 bg-white border-2 border-dashed border-slate-300 px-8 py-4 rounded-full font-bold text-slate-500 hover:border-primary hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Agregar Aprendiz
            </button>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="max-w-sm mx-auto">
          <h3 className="text-xl font-display px-1 mb-4 text-slate-800">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: 'joystick', label: 'Jugar Ahora', bg: 'bg-primary/10', color: 'text-primary', action: () => state.profiles[0] && handleSelectProfile(state.profiles[0]) },
              { icon: 'emoji_events', label: 'Logros', bg: 'bg-accent-yellow/20', color: 'text-amber-600', action: () => {} },
              { icon: 'menu_book', label: 'Biblioteca', bg: 'bg-accent-green/10', color: 'text-accent-green', action: () => {} },
              { icon: 'query_stats', label: 'Progreso', bg: 'bg-indigo-100', color: 'text-indigo-600', action: () => setShowParentPin(true) },
            ].map(({ icon, label, bg, color, action }) => (
              <button
                key={label}
                onClick={action}
                className={`${bg} ${color} p-5 rounded-2xl flex flex-col items-center gap-3 hover:opacity-80 active:scale-95 transition-all`}
              >
                <span className="material-symbols-outlined text-4xl">{icon}</span>
                <span className="font-bold text-sm">{label}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <BottomNav active="home" />

      {/* Add Profile Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h3 className="text-2xl font-display text-center mb-6 text-slate-800">Nuevo Aprendiz</h3>
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {AVATARS.map((av, i) => (
              <button
                key={i}
                onClick={() => setSelectedAvatar(i)}
                className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all ${av.bg} ${selectedAvatar === i ? 'ring-4 ring-primary scale-110' : 'hover:scale-105'}`}
              >
                {av.emoji}
              </button>
            ))}
          </div>
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl ${AVATARS[selectedAvatar].bg}`}>
            {AVATARS[selectedAvatar].emoji}
          </div>
          <input
            type="text"
            placeholder="Nombre del niño..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddProfile()}
            className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-lg font-body focus:outline-none focus:border-primary text-center font-bold"
            maxLength={15}
            autoFocus
          />
          <button
            onClick={handleAddProfile}
            className="w-full mt-4 bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/30"
          >
            ¡Crear Perfil! 🎉
          </button>
        </Modal>
      )}

      {/* Parent PIN Modal */}
      {showParentPin && (
        <Modal onClose={() => { setShowParentPin(false); setPin(''); }}>
          <h3 className="text-2xl font-display text-center mb-2 text-slate-800">Panel de Padres</h3>
          <p className="text-center text-slate-500 mb-6">Ingresa el PIN (demo: 1234)</p>
          <div className="flex justify-center gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${pin.length >= i ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-300'}`}>
                {pin.length >= i ? '●' : '○'}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '←'].map((k, i) => (
              <button
                key={i}
                disabled={k === ''}
                onClick={() => {
                  if (k === '←') setPin(p => p.slice(0, -1));
                  else if (pin.length < 4) setPin(p => p + k);
                }}
                className={`h-14 rounded-2xl font-bold text-xl transition-all active:scale-95 ${k === '' ? 'invisible' : 'bg-slate-100 hover:bg-primary hover:text-white text-slate-800'}`}
              >
                {k}
              </button>
            ))}
          </div>
          <button
            onClick={handleParentAccess}
            disabled={pin.length < 4}
            className="w-full mt-4 bg-primary text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-40 hover:bg-primary/90 active:scale-95 transition-all"
          >
            Entrar
          </button>
        </Modal>
      )}
    </div>
  );
}

function ProfileCard({ profile, onSelect, delay }) {
  const levelColors = ['text-accent-green', 'text-primary', 'text-accent-yellow', 'text-indigo-500'];
  const levelColor = levelColors[profile.id % levelColors.length];

  return (
    <button
      onClick={onSelect}
      className="flex flex-col items-center group cursor-pointer animate-[slideUp_0.4s_ease-out_forwards]"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="relative">
        <div className={`w-36 h-36 rounded-full border-4 border-primary/20 p-1 group-hover:scale-105 group-active:scale-95 transition-transform bg-white shadow-md`}>
          <div className={`w-full h-full rounded-full flex items-center justify-center text-6xl ${profile.avatar?.bg || 'bg-orange-100'}`}>
            {profile.avatar?.emoji || '🦄'}
          </div>
        </div>
        <div className="absolute bottom-0 right-0 bg-accent-green text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-bg-light shadow-sm">
          <span className="material-symbols-outlined text-lg fill-icon">star</span>
        </div>
      </div>
      <p className="mt-3 text-xl font-display text-slate-800">{profile.name}</p>
      <span className={`text-xs font-bold ${levelColor} uppercase tracking-wider`}>
        Nivel {profile.level}
      </span>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-accent-yellow text-sm">⭐</span>
        <span className="text-xs font-bold text-slate-500">{profile.stars}</span>
      </div>
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl p-6 w-full max-w-md animate-[slideUp_0.3s_ease-out_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <div className="h-6" />
      </div>
    </div>
  );
}

function BottomNav({ active }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-lg border-t border-slate-100 px-6 py-3 flex items-center justify-between z-40 shadow-lg">
      {[
        { icon: 'home', label: 'Inicio', key: 'home' },
        { icon: 'auto_stories', label: 'Aprender', key: 'learn' },
        { icon: 'play_arrow', label: '', key: 'play', isMain: true },
        { icon: 'emoji_events', label: 'Logros', key: 'awards' },
        { icon: 'person', label: 'Perfil', key: 'profile' },
      ].map(({ icon, label, key, isMain }) =>
        isMain ? (
          <div key={key} className="relative -top-5">
            <button className="w-16 h-16 rounded-full bg-primary text-white shadow-xl shadow-primary/40 flex items-center justify-center border-4 border-bg-light hover:bg-primary/90 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-4xl">{icon}</span>
            </button>
          </div>
        ) : (
          <a key={key} href="#" className={`flex flex-col items-center gap-1 ${active === key ? 'text-primary' : 'text-slate-400'}`}>
            <span className={`material-symbols-outlined text-3xl ${active === key ? 'fill-icon' : ''}`}>{icon}</span>
            <span className="text-xs font-bold uppercase">{label}</span>
          </a>
        )
      )}
    </nav>
  );
}
