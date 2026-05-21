import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { usePomodoro } from '../hooks/usePomodoro';

const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function PomodoroTimer() {
  const { state, dispatch } = useApp();
  const { start, pause, reset, skip } = usePomodoro();

  const { timerState, timeLeft, timerMinutes, activeProfile, activeTaskIndex } = state;
  const activeTask = activeProfile?.tasks[activeTaskIndex];

  // Calculate SVG progress
  const totalSeconds = useMemo(() => {
    const duration = activeTask?.duration || timerMinutes;
    return duration * 60;
  }, [activeTask, timerMinutes]);

  const progress = totalSeconds > 0 ? timeLeft / totalSeconds : 1;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  // Format time
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  // State-based colors
  const stateConfig = {
    idle: { stroke: '#ff6933', bg: 'text-primary/10', glow: 'shadow-primary/20', label: 'LISTO' },
    running: { stroke: '#ff6933', bg: 'text-primary/15', glow: 'shadow-primary/40', label: 'ENFOCADO' },
    paused: { stroke: '#FFD166', bg: 'text-accent-yellow/15', glow: 'shadow-accent-yellow/40', label: 'PAUSADO' },
    break: { stroke: '#06D6A0', bg: 'text-accent-green/15', glow: 'shadow-accent-green/40', label: 'DESCANSO' },
    completed: { stroke: '#06D6A0', bg: 'text-accent-green/15', glow: 'shadow-accent-green/40', label: '¡LISTO!' },
  };

  const config = stateConfig[timerState] || stateConfig.idle;

  const isRunning = timerState === 'running';
  const isPaused = timerState === 'paused';
  const isIdle = timerState === 'idle';
  const isBreak = timerState === 'break';
  const isCompleted = timerState === 'completed';

  return (
    <div className="flex flex-col items-center">
      {/* Timer title */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-display text-slate-900">
          {isBreak ? '¡Hora de Descansar! 😴' : '¡Hora de Enfocarse! 🎯'}
        </h1>
        <div className={`inline-flex items-center gap-2 mt-2 px-4 py-1 rounded-full ${isRunning ? 'bg-primary/10' : isBreak ? 'bg-accent-green/10' : 'bg-slate-100'}`}>
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-primary animate-pulse' : isBreak ? 'bg-accent-green animate-pulse' : 'bg-slate-400'}`} />
          <span className={`text-sm font-bold uppercase tracking-wider ${isRunning ? 'text-primary' : isBreak ? 'text-accent-green' : 'text-slate-500'}`}>
            {isRunning ? 'Sesión de Estudio' : isBreak ? 'Modo Descanso' : isPaused ? 'En Pausa' : isCompleted ? '¡Completado!' : 'Listo para empezar'}
          </span>
        </div>
      </div>

      {/* The big visual timer */}
      <div className={`relative flex justify-center items-center mb-8 ${isRunning ? 'pulse-ring' : ''} rounded-full`}>
        <div className="relative w-64 h-64">
          {/* SVG Ring */}
          <svg className="w-full h-full" viewBox="0 0 256 256">
            {/* Track */}
            <circle
              cx="128" cy="128" r={RADIUS}
              fill="transparent"
              stroke={isBreak ? '#06D6A0' : isPaused ? '#FFD166' : '#ff6933'}
              strokeWidth="12"
              strokeOpacity="0.15"
            />
            {/* Progress */}
            <circle
              cx="128" cy="128" r={RADIUS}
              fill="transparent"
              stroke={isBreak ? '#06D6A0' : isPaused ? '#FFD166' : '#ff6933'}
              strokeWidth="14"
              strokeLinecap="round"
              className="timer-ring"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              style={{ filter: `drop-shadow(0 0 6px ${isBreak ? '#06D6A0' : isPaused ? '#FFD166' : '#ff6933'}80)` }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isCompleted ? (
              <div className="text-center animate-[starPop_0.4s_ease-out_forwards]">
                <div className="text-5xl mb-1">🎉</div>
                <div className="text-xl font-display text-accent-green">¡Genial!</div>
              </div>
            ) : (
              <>
                <span className={`font-display text-6xl leading-none ${isBreak ? 'text-accent-green' : isPaused ? 'text-amber-500' : 'text-slate-900'}`}>
                  {mins}:{secs}
                </span>
                <span className={`font-body text-sm font-bold mt-1 ${isBreak ? 'text-accent-green' : 'text-primary'}`}>
                  MINUTOS
                </span>
                {activeTask && !isBreak && (
                  <span className="text-xl mt-1">{activeTask.emoji}</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Duration selector (only when idle) */}
      {isIdle && (
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm font-bold text-slate-500">Duración:</span>
          {[15, 20, 25].map((m) => (
            <button
              key={m}
              onClick={() => {
                dispatch({ type: 'SET_TIMER_MINUTES', payload: m });
              }}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${timerMinutes === m ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {m}m
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-5 mb-8">
        <button
          onClick={reset}
          className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-90 transition-all"
          aria-label="Reiniciar"
        >
          <span className="material-symbols-outlined text-3xl">refresh</span>
        </button>

        {/* Main play/pause button */}
        {isRunning ? (
          <button
            onClick={pause}
            className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40 hover:bg-primary/90 active:scale-90 transition-all"
            aria-label="Pausar"
          >
            <span className="material-symbols-outlined text-4xl">pause</span>
          </button>
        ) : isCompleted ? (
          <button
            onClick={() => {
              dispatch({ type: 'COMPLETE_TASK' });
              reset();
            }}
            className="w-20 h-20 rounded-full bg-accent-green flex items-center justify-center text-white shadow-xl shadow-accent-green/40 hover:bg-accent-green/90 active:scale-90 transition-all"
            aria-label="Siguiente tarea"
          >
            <span className="material-symbols-outlined text-4xl">check</span>
          </button>
        ) : (
          <button
            onClick={start}
            className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40 hover:bg-primary/90 active:scale-90 transition-all"
            aria-label="Iniciar"
          >
            <span className="material-symbols-outlined text-4xl">play_arrow</span>
          </button>
        )}

        <button
          onClick={skip}
          className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-90 transition-all"
          aria-label="Saltar"
        >
          <span className="material-symbols-outlined text-3xl">skip_next</span>
        </button>
      </div>

      {/* Break suggestion (shown when running > 5 min) */}
      {isRunning && !isBreak && (
        <div className="w-full bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl animate-[slideUp_0.3s_ease-out]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">bedtime</span>
            <div>
              <p className="font-bold text-sm">¿Necesitas un descanso?</p>
              <p className="text-xs text-slate-400">El descanso te da 5 minutos</p>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: 'START_BREAK' })}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors active:scale-95"
          >
            Descansar
          </button>
        </div>
      )}
    </div>
  );
}
