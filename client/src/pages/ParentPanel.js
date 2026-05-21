import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { tasksAPI } from '../api';

export default function ParentPanel() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reports');
  const [selectedProfile, setSelectedProfile] = useState(state.profiles[0] || null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(20);
  const [newTaskEmoji, setNewTaskEmoji] = useState('📚');

  const EMOJIS = ['📚', '📖', '🎨', '🔬', '✏️', '🎵', '🧩', '💻', '🌍', '🧮'];

  // Cargar tareas del perfil seleccionado al abrir la pestaña de tareas
  React.useEffect(() => {
    if (activeTab === 'tasks' && selectedProfile) {
      tasksAPI.list(selectedProfile.id).then(tasks => {
        setSelectedProfile(prev => ({ ...prev, tasks }));
      }).catch(console.error);
    }
  }, [activeTab, selectedProfile?.id]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !selectedProfile) return;
    
    try {
      const newTask = await tasksAPI.create({
        profile_id: selectedProfile.id,
        title: newTaskTitle.trim(),
        emoji: newTaskEmoji,
        duration: newTaskDuration
      });
      
      // Actualizar tareas locales del perfil seleccionado
      setSelectedProfile(prev => ({
        ...prev,
        tasks: [...(prev.tasks || []), newTask]
      }));
      
      // Limpiar formulario
      setNewTaskTitle('');
    } catch (err) {
      console.error('Error creando tarea:', err);
      // Podrías mostrar un mensaje de error si alcanzó el límite de 3
      if (err.response?.status === 409) {
        alert('Este perfil ya tiene el máximo de 3 tareas activas.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg-light flex flex-col" style={{ minHeight: '100dvh' }}>
      {/* Header */}
      <header className="flex items-center gap-3 p-5 bg-white border-b border-slate-100 shadow-sm">
        <button
          onClick={() => navigate('/')}
          className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-display text-slate-800">Panel de Padres</h1>
          <p className="text-xs text-slate-500 font-semibold">Supervisa el progreso de tus hijos</p>
        </div>
        <div className="ml-auto bg-primary/10 px-3 py-1 rounded-full">
          <span className="text-primary text-sm font-bold">Admin</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-white border-b border-slate-100 px-4">
        {[
          { key: 'reports', icon: 'bar_chart', label: 'Reportes' },
          { key: 'tasks', icon: 'checklist', label: 'Tareas' },
          { key: 'settings', icon: 'tune', label: 'Config' },
        ].map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 border-b-2 transition-all ${activeTab === key ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}
          >
            <span className={`material-symbols-outlined ${activeTab === key ? 'fill-icon' : ''}`}>{icon}</span>
            <span className="text-xs font-bold">{label}</span>
          </button>
        ))}
      </div>

      <main className="flex-1 p-5 overflow-y-auto pb-8">
        {activeTab === 'reports' && (
          <ReportsTab profiles={state.profiles} />
        )}
        {activeTab === 'tasks' && (
          <TasksTab
            profiles={state.profiles}
            selectedProfile={selectedProfile}
            setSelectedProfile={setSelectedProfile}
            newTaskTitle={newTaskTitle}
            setNewTaskTitle={setNewTaskTitle}
            newTaskDuration={newTaskDuration}
            setNewTaskDuration={setNewTaskDuration}
            newTaskEmoji={newTaskEmoji}
            setNewTaskEmoji={setNewTaskEmoji}
            emojis={EMOJIS}
            onAddTask={handleAddTask}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab />
        )}
      </main>
    </div>
  );
}

function ReportsTab({ profiles }) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-display text-slate-800">Progreso General</h2>
      {profiles.map((p) => (
        <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-2xl text-3xl flex items-center justify-center ${p.avatar?.bg || 'bg-orange-100'}`}>
              {p.avatar?.emoji || '🦄'}
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl text-slate-800">{p.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Nivel {p.level}</span>
                <span className="text-xs text-slate-400">🔥 {p.streak} días</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-display text-accent-yellow">⭐ {p.stars}</div>
              <div className="text-xs text-slate-400">estrellas</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Sesiones', value: p.sessionsCompleted, icon: '⏱️', color: 'bg-primary/10 text-primary' },
              { label: 'Tareas', value: p.tasksCompleted, icon: '✅', color: 'bg-accent-green/10 text-accent-green' },
              { label: 'Logros', value: p.badges?.length || 0, icon: '🏆', color: 'bg-accent-yellow/20 text-amber-600' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className={`${color} rounded-xl p-3 text-center`}>
                <div className="text-xl">{icon}</div>
                <div className="font-display text-xl">{value}</div>
                <div className="text-xs font-bold opacity-70">{label}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold">
              <span>Progreso al Nivel {p.level + 1}</span>
              <span>{Math.min((p.stars % 100), 100)}/100 ⭐</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent-yellow rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((p.stars % 100), 100)}%` }}
              />
            </div>
          </div>

          {/* Badges */}
          {p.badges?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-400 mb-2">INSIGNIAS</p>
              <div className="flex gap-2">
                {p.badges.map((b, i) => (
                  <span key={i} className="text-2xl">{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {profiles.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">👨‍👩‍👧</div>
          <p className="text-slate-500 font-semibold">No hay perfiles creados</p>
          <p className="text-slate-400 text-sm">Agrega un aprendiz desde la pantalla de inicio</p>
        </div>
      )}
    </div>
  );
}

function TasksTab({ profiles, selectedProfile, setSelectedProfile, newTaskTitle, setNewTaskTitle, newTaskDuration, setNewTaskDuration, newTaskEmoji, setNewTaskEmoji, emojis, onAddTask }) {
  return (
    <div className="space-y-5">
      {/* Profile selector */}
      <div>
        <h2 className="text-xl font-display text-slate-800 mb-3">Seleccionar Perfil</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProfile(p)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${selectedProfile?.id === p.id ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'}`}
            >
              <span className="text-3xl">{p.avatar?.emoji || '🦄'}</span>
              <span className="text-sm font-bold text-slate-700">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current tasks */}
      {selectedProfile && (
        <div>
          <h3 className="font-display text-lg text-slate-700 mb-3">
            Tareas de {selectedProfile.name}
          </h3>
          {selectedProfile.tasks?.length === 0 ? (
            <p className="text-slate-400 text-center py-6">Sin tareas asignadas</p>
          ) : (
            <div className="space-y-2">
              {selectedProfile.tasks.map((t) => (
                <div key={t.id} className="bg-white border border-slate-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                  <span className="text-2xl">{t.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{t.title}</p>
                    <p className="text-xs text-slate-400">{t.duration} minutos · {t.status === 'done' ? '✅ Completada' : '⏳ Pendiente'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add new task */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <h3 className="font-display text-lg text-slate-800 mb-4">Agregar Nueva Tarea</h3>

        {/* Emoji picker */}
        <div className="flex gap-2 flex-wrap mb-4">
          {emojis.map(em => (
            <button
              key={em}
              onClick={() => setNewTaskEmoji(em)}
              className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${newTaskEmoji === em ? 'bg-primary/20 ring-2 ring-primary' : 'bg-slate-100 hover:scale-105'}`}
            >
              {em}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Nombre de la tarea..."
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-body focus:outline-none focus:border-primary mb-3"
          maxLength={30}
        />

        <div className="flex gap-2 mb-4">
          <span className="text-sm font-bold text-slate-500 self-center">Tiempo:</span>
          {[15, 20, 25].map(d => (
            <button
              key={d}
              onClick={() => setNewTaskDuration(d)}
              className={`px-3 py-2 rounded-full font-bold text-sm transition-all ${newTaskDuration === d ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {d}m
            </button>
          ))}
        </div>

        <button
          onClick={onAddTask}
          disabled={!newTaskTitle.trim() || !selectedProfile}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-40"
        >
          Agregar Tarea
        </button>
      </div>
    </div>
  );
}

function SettingsTab() {
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-display text-slate-800">Configuración</h2>

      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-5">
        {/* Focus duration */}
        <div>
          <label className="text-sm font-bold text-slate-600 block mb-2">⏱️ Duración de Enfoque</label>
          <div className="flex gap-2">
            {[15, 20, 25, 30].map(m => (
              <button
                key={m}
                onClick={() => setFocusDuration(m)}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${focusDuration === m ? 'bg-primary text-white shadow' : 'bg-slate-100 text-slate-600'}`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* Break duration */}
        <div>
          <label className="text-sm font-bold text-slate-600 block mb-2">😴 Duración de Descanso</label>
          <div className="flex gap-2">
            {[3, 5, 10].map(m => (
              <button
                key={m}
                onClick={() => setBreakDuration(m)}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${breakDuration === m ? 'bg-accent-green text-white shadow' : 'bg-slate-100 text-slate-600'}`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        {[
          { label: '🔔 Sonidos', value: soundEnabled, set: setSoundEnabled },
          { label: '📱 Notificaciones', value: notificationsEnabled, set: setNotificationsEnabled },
        ].map(({ label, value, set }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="font-bold text-slate-700">{label}</span>
            <button
              onClick={() => set(!value)}
              className={`w-14 h-7 rounded-full transition-all relative ${value ? 'bg-primary' : 'bg-slate-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow ${value ? 'left-8' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <h3 className="font-display text-lg text-slate-800 mb-2">PIN de Acceso</h3>
        <p className="text-sm text-slate-500 mb-3">PIN actual de demostración: <span className="font-bold text-primary">1234</span></p>
        <button className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
          Cambiar PIN
        </button>
      </div>
    </div>
  );
}
