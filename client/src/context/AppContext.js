import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext(null);

const AVATARS = [
  { emoji: '🦄', bg: 'bg-pink-100', color: 'text-pink-500' },
  { emoji: '🐶', bg: 'bg-yellow-100', color: 'text-yellow-600' },
  { emoji: '🦊', bg: 'bg-orange-100', color: 'text-orange-500' },
  { emoji: '🐸', bg: 'bg-green-100', color: 'text-green-500' },
  { emoji: '🐻', bg: 'bg-amber-100', color: 'text-amber-600' },
  { emoji: '🐱', bg: 'bg-purple-100', color: 'text-purple-500' },
];

const initialState = {
  profiles: [],
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
    case 'SET_PROFILES':
      // Aseguramos que cada perfil tenga tasks como array vacío por defecto
      const profiles = action.payload.map(p => ({ ...p, tasks: p.tasks || [] }));
      
      // Update activeProfile if it exists in the new data
      const updatedActive = state.activeProfile 
        ? profiles.find(p => p.id === state.activeProfile.id) || state.activeProfile
        : null;
        
      return { ...state, profiles, activeProfile: updatedActive };

    case 'SELECT_PROFILE':
      return {
        ...state,
        activeProfile: { ...action.payload, tasks: action.payload.tasks || [] },
        timerState: 'idle',
        activeTaskIndex: 0,
      };

    case 'SET_TASKS': {
      if (!state.activeProfile) return state;
      const tasks = action.payload;
      const updatedProfile = { ...state.activeProfile, tasks };
      
      return {
        ...state,
        activeProfile: updatedProfile,
        profiles: state.profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p),
        timerState: 'idle',
        timeLeft: tasks[0] ? tasks[0].duration * 60 : state.timerMinutes * 60,
        activeTaskIndex: 0,
      };
    }

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
      const starsEarned = action.payload?.stars || 50;
      const newBadge = action.payload?.newBadge;
      const profileUpdate = action.payload?.profileUpdate;
      
      let updatedProfile = state.activeProfile;
      if (profileUpdate && state.activeProfile) {
         updatedProfile = { ...state.activeProfile, ...profileUpdate };
      } else if (state.activeProfile) {
         updatedProfile = {
           ...state.activeProfile, 
           stars: state.activeProfile.stars + starsEarned,
           sessions_completed: (state.activeProfile.sessions_completed || 0) + 1
         };
      }

      const updatedProfiles = state.profiles.map((p) =>
        p.id === updatedProfile?.id ? updatedProfile : p
      );
      
      return {
        ...state,
        profiles: updatedProfiles,
        activeProfile: updatedProfile,
        sessionStarsEarned: starsEarned,
        pomodoroCount: state.pomodoroCount + 1,
        timerState: 'completed',
        lastReward: {
          stars: starsEarned,
          message: getRewardMessage(starsEarned),
          badge: newBadge
        },
      };
    }

    case 'COMPLETE_TASK': {
      if (!state.activeProfile || !state.activeProfile.tasks) return state;
      const updatedTasks = state.activeProfile.tasks.map((t, i) =>
        i === state.activeTaskIndex ? { ...t, status: 'done' } : t
      );
      const nextIdx = state.activeTaskIndex + 1;
      const nextTask = updatedTasks[nextIdx];
      const updatedProfile = {
        ...state.activeProfile,
        tasks: updatedTasks,
      };
      return {
        ...state,
        activeProfile: updatedProfile,
        profiles: state.profiles.map((p) =>
          p.id === updatedProfile.id ? updatedProfile : p
        ),
        activeTaskIndex: nextTask ? nextIdx : state.activeTaskIndex,
        timerState: 'idle',
        timeLeft: nextTask ? nextTask.duration * 60 : state.timerMinutes * 60,
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
