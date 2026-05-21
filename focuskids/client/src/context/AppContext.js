import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);

const AVATARS = [
  { emoji: '🦄', bg: 'bg-pink-100', color: 'text-pink-500' },
  { emoji: '🐶', bg: 'bg-yellow-100', color: 'text-yellow-600' },
  { emoji: '🦊', bg: 'bg-orange-100', color: 'text-orange-500' },
  { emoji: '🐸', bg: 'bg-green-100', color: 'text-green-500' },
  { emoji: '🐻', bg: 'bg-amber-100', color: 'text-amber-600' },
  { emoji: '🐱', bg: 'bg-purple-100', color: 'text-purple-500' },
];

const SAMPLE_PROFILES = [
  {
    id: 1,
    name: 'Sofía',
    level: 12,
    stars: 240,
    avatar: AVATARS[0],
    sessionsCompleted: 24,
    tasksCompleted: 48,
    streak: 5,
    badges: ['🏆', '⚡', '🌟', '🎯'],
    tasks: [
      { id: 1, title: 'Tarea de Matemáticas', emoji: '📚', duration: 25, status: 'pending' },
      { id: 2, title: 'Práctica de Lectura', emoji: '📖', duration: 20, status: 'pending' },
      { id: 3, title: 'Proyecto de Arte', emoji: '🎨', duration: 15, status: 'pending' },
    ],
  },
  {
    id: 2,
    name: 'Diego',
    level: 8,
    stars: 160,
    avatar: AVATARS[1],
    sessionsCompleted: 16,
    tasksCompleted: 30,
    streak: 3,
    badges: ['🏆', '⚡'],
    tasks: [
      { id: 4, title: 'Ciencias Naturales', emoji: '🔬', duration: 20, status: 'pending' },
      { id: 5, title: 'Inglés', emoji: '✏️', duration: 25, status: 'pending' },
    ],
  },
];

const initialState = {
  profiles: SAMPLE_PROFILES,
  activeProfile: null,
  timerState: 'idle', // idle | running | paused | break | completed
  timerMinutes: 25,
  timeLeft: 25 * 60,
  activeTaskIndex: 0,
  sessionStarsEarned: 0,
  lastReward: null,
  pomodoroCount: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_PROFILE':
      return {
        ...state,
        activeProfile: action.payload,
        timerState: 'idle',
        timeLeft: action.payload.tasks[0]
          ? action.payload.tasks[0].duration * 60
          : 25 * 60,
        activeTaskIndex: 0,
      };

    case 'SET_TIMER_MINUTES':
      return {
        ...state,
        timerMinutes: action.payload,
        timeLeft: action.payload * 60,
      };

    case 'SET_TIME_LEFT':
      return { ...state, timeLeft: action.payload };

    case 'SET_TIMER_STATE':
      return { ...state, timerState: action.payload };

    case 'TICK':
      if (state.timeLeft <= 1) {
        return { ...state, timeLeft: 0, timerState: 'completed' };
      }
      return { ...state, timeLeft: state.timeLeft - 1 };

    case 'COMPLETE_SESSION': {
      const starsEarned = action.payload || 50;
      const updated = state.profiles.map((p) =>
        p.id === state.activeProfile?.id
          ? { ...p, stars: p.stars + starsEarned, sessionsCompleted: p.sessionsCompleted + 1 }
          : p
      );
      const updatedProfile = updated.find((p) => p.id === state.activeProfile?.id);
      return {
        ...state,
        profiles: updated,
        activeProfile: updatedProfile,
        sessionStarsEarned: starsEarned,
        pomodoroCount: state.pomodoroCount + 1,
        timerState: 'completed',
        lastReward: {
          stars: starsEarned,
          message: getRewardMessage(starsEarned),
          achievement: state.pomodoroCount > 0 && state.pomodoroCount % 3 === 0,
        },
      };
    }

    case 'COMPLETE_TASK': {
      if (!state.activeProfile) return state;
      const updatedTasks = state.activeProfile.tasks.map((t, i) =>
        i === state.activeTaskIndex ? { ...t, status: 'done' } : t
      );
      const nextIdx = state.activeTaskIndex + 1;
      const nextTask = updatedTasks[nextIdx];
      const updatedProfile = {
        ...state.activeProfile,
        tasks: updatedTasks,
        tasksCompleted: state.activeProfile.tasksCompleted + 1,
      };
      return {
        ...state,
        activeProfile: updatedProfile,
        profiles: state.profiles.map((p) =>
          p.id === updatedProfile.id ? updatedProfile : p
        ),
        activeTaskIndex: nextTask ? nextIdx : state.activeTaskIndex,
        timerState: 'idle',
        timeLeft: nextTask ? nextTask.duration * 60 : 25 * 60,
      };
    }

    case 'ADD_TASK': {
      if (!state.activeProfile) return state;
      const newTask = {
        id: Date.now(),
        title: action.payload.title,
        emoji: action.payload.emoji || '📝',
        duration: action.payload.duration || 25,
        status: 'pending',
      };
      const updatedProfile = {
        ...state.activeProfile,
        tasks: [...state.activeProfile.tasks, newTask].slice(-3),
      };
      return {
        ...state,
        activeProfile: updatedProfile,
        profiles: state.profiles.map((p) =>
          p.id === updatedProfile.id ? updatedProfile : p
        ),
      };
    }

    case 'START_BREAK':
      return {
        ...state,
        timerState: 'break',
        timeLeft: 5 * 60,
      };

    case 'RESET_TIMER':
      return {
        ...state,
        timerState: 'idle',
        timeLeft: state.timerMinutes * 60,
      };

    case 'ADD_PROFILE': {
      const newProfile = {
        id: Date.now(),
        name: action.payload.name,
        level: 1,
        stars: 0,
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
        sessionsCompleted: 0,
        tasksCompleted: 0,
        streak: 0,
        badges: [],
        tasks: [],
      };
      return { ...state, profiles: [...state.profiles, newProfile] };
    }

    default:
      return state;
  }
}

function getRewardMessage(stars) {
  if (stars >= 80) return '¡Increíble! ¡Eres una superestrella! 🌟';
  if (stars >= 60) return '¡Fantástico trabajo! ¡Sigue así! 🚀';
  if (stars >= 40) return '¡Muy bien hecho! ¡Eres genial! 🎉';
  return '¡Buen trabajo! ¡Lo lograste! 👏';
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('focuskids_profiles');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.forEach((p) => dispatch({ type: 'ADD_PROFILE', payload: p }));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('focuskids_profiles', JSON.stringify(state.profiles));
    } catch (e) {}
  }, [state.profiles]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export { AVATARS };
