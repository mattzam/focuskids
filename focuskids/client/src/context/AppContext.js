import React, { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext(null);

const AVATARS = [
  { emoji: "🦄", bg: "bg-pink-100", color: "text-pink-500" },
  { emoji: "🐶", bg: "bg-yellow-100", color: "text-yellow-600" },
  { emoji: "🦊", bg: "bg-orange-100", color: "text-orange-500" },
  { emoji: "🐸", bg: "bg-green-100", color: "text-green-500" },
  { emoji: "🐻", bg: "bg-amber-100", color: "text-amber-600" },
  { emoji: "🐱", bg: "bg-purple-100", color: "text-purple-500" },
];

const SAMPLE_PROFILES = [
  {
    id: 1,
    name: "Sofía",
    level: 12,
    stars: 240,
    avatar: AVATARS[0],
    sessionsCompleted: 24,
    tasksCompleted: 48,
    streak: 5,
    badges: ["🏆", "⚡", "🌟", "🎯"],
    tasks: [
      {
        id: 1,
        title: "Tarea de Matemáticas",
        emoji: "📚",
        duration: 25,
        status: "pending",
      },
      {
        id: 2,
        title: "Práctica de Lectura",
        emoji: "📖",
        duration: 20,
        status: "pending",
      },
      {
        id: 3,
        title: "Proyecto de Arte",
        emoji: "🎨",
        duration: 15,
        status: "pending",
      },
    ],
  },
  {
    id: 2,
    name: "Diego",
    level: 8,
    stars: 160,
    avatar: AVATARS[1],
    sessionsCompleted: 16,
    tasksCompleted: 30,
    streak: 3,
    badges: ["🏆", "⚡"],
    tasks: [
      {
        id: 4,
        title: "Ciencias Naturales",
        emoji: "🔬",
        duration: 20,
        status: "pending",
      },
      { id: 5, title: "Inglés", emoji: "✏️", duration: 25, status: "pending" },
    ],
  },
];

const initialState = {
  profiles: SAMPLE_PROFILES,
  activeProfile: null,
  timerState: "idle", // idle | running | paused | break | completed
  timerMinutes: 25,
  timeLeft: 25 * 60,
  activeTaskIndex: 0,
  sessionStarsEarned: 0,
  lastReward: null,
  pomodoroCount: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "SELECT_PROFILE": {
      const profile = action.payload;
      const firstTask = profile?.tasks?.[0];
      return {
        ...state,
        activeProfile: profile,
        timerState: "idle",
        timeLeft: firstTask ? firstTask.duration * 60 : 25 * 60,
        timerMinutes: firstTask ? firstTask.duration : 25,
        activeTaskIndex: 0,
        lastReward: null,
        pomodoroCount: 0,
      };
    }

    case "SET_TIMER_MINUTES":
      return {
        ...state,
        timerMinutes: action.payload,
        timeLeft: action.payload * 60,
      };

    case "SET_TIME_LEFT":
      return { ...state, timeLeft: action.payload };

    case "SET_TIMER_STATE":
      return { ...state, timerState: action.payload };

    case "TICK":
      if (state.timeLeft <= 0) return state; // no-op once at zero
      if (state.timeLeft === 1) {
        return { ...state, timeLeft: 0 }; // let usePomodoro fire COMPLETE_SESSION
      }
      return { ...state, timeLeft: state.timeLeft - 1 };

    case "COMPLETE_SESSION": {
      const starsEarned = action.payload || 50;
      const newStars = (state.activeProfile?.stars || 0) + starsEarned;
      const newSessions = (state.activeProfile?.sessionsCompleted || 0) + 1;
      const newLevel = Math.max(1, Math.floor(newStars / 100) + 1);
      const updatedProfile = {
        ...state.activeProfile,
        stars: newStars,
        sessionsCompleted: newSessions,
        level: newLevel,
      };
      // Auto-award any newly earned badges
      const newBadges = checkNewBadges(updatedProfile, state.timerMinutes);
      if (newBadges.length > 0) {
        updatedProfile.badges = [
          ...new Set([...(updatedProfile.badges || []), ...newBadges]),
        ];
      }
      const updatedProfiles = state.profiles.map((p) =>
        p.id === updatedProfile.id ? updatedProfile : p,
      );
      return {
        ...state,
        profiles: updatedProfiles,
        activeProfile: updatedProfile,
        sessionStarsEarned: starsEarned,
        pomodoroCount: state.pomodoroCount + 1,
        timerState: "completed",
        lastReward: {
          stars: starsEarned,
          message: getRewardMessage(starsEarned),
          achievement: newBadges.length > 0 ? newBadges[0] : null,
        },
      };
    }

    case "COMPLETE_TASK": {
      if (!state.activeProfile) return state;
      const updatedTasks = state.activeProfile.tasks.map((t, i) =>
        i === state.activeTaskIndex ? { ...t, status: "done" } : t,
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
          p.id === updatedProfile.id ? updatedProfile : p,
        ),
        activeTaskIndex: nextTask ? nextIdx : state.activeTaskIndex,
        timerState: "idle",
        timerMinutes: nextTask ? nextTask.duration : 25,
        timeLeft: nextTask ? nextTask.duration * 60 : 25 * 60,
        lastReward: null,
      };
    }

    case "ADD_TASK": {
      if (!state.activeProfile) return state;
      const newTask = {
        id: Date.now(),
        title: action.payload.title,
        emoji: action.payload.emoji || "📝",
        duration: action.payload.duration || 25,
        status: "pending",
      };
      const updatedProfile = {
        ...state.activeProfile,
        tasks: [...state.activeProfile.tasks, newTask].slice(-3),
      };
      return {
        ...state,
        activeProfile: updatedProfile,
        profiles: state.profiles.map((p) =>
          p.id === updatedProfile.id ? updatedProfile : p,
        ),
      };
    }

    case "START_BREAK":
      return {
        ...state,
        timerState: "break",
        timeLeft: 5 * 60,
      };

    case "RESET_TIMER":
      return {
        ...state,
        timerState: "idle",
        timeLeft: state.timerMinutes * 60,
      };

    case "ADD_PROFILE": {
      const avatarIndex =
        action.payload.avatarIndex ??
        Math.floor(Math.random() * AVATARS.length);
      const newProfile = {
        id: Date.now(),
        name: action.payload.name,
        level: 1,
        stars: 0,
        avatar: AVATARS[avatarIndex],
        sessionsCompleted: 0,
        tasksCompleted: 0,
        streak: 0,
        badges: [],
        tasks: [],
      };
      return { ...state, profiles: [...state.profiles, newProfile] };
    }

    case "SET_PROFILES":
      return { ...state, profiles: action.payload };

    case "ADD_TASK_TO_PROFILE": {
      const { profileId, task } = action.payload;
      const newTask = {
        id: Date.now(),
        title: task.title,
        emoji: task.emoji || "📝",
        duration: task.duration || 25,
        status: "pending",
      };
      const updatedProfiles = state.profiles.map((p) =>
        p.id === profileId
          ? { ...p, tasks: [...p.tasks, newTask].slice(-3) }
          : p,
      );
      const updatedActive =
        state.activeProfile?.id === profileId
          ? {
              ...state.activeProfile,
              tasks: [...state.activeProfile.tasks, newTask].slice(-3),
            }
          : state.activeProfile;
      return {
        ...state,
        profiles: updatedProfiles,
        activeProfile: updatedActive,
      };
    }

    case "UPDATE_AVATAR": {
      const { profileId, avatarIndex } = action.payload;
      const updatedProfiles = state.profiles.map((p) =>
        p.id === profileId ? { ...p, avatar: AVATARS[avatarIndex] } : p,
      );
      const updatedActive =
        state.activeProfile?.id === profileId
          ? { ...state.activeProfile, avatar: AVATARS[avatarIndex] }
          : state.activeProfile;
      return {
        ...state,
        profiles: updatedProfiles,
        activeProfile: updatedActive,
      };
    }

    case "RENAME_PROFILE": {
      const { profileId, name } = action.payload;
      const updatedProfiles = state.profiles.map((p) =>
        p.id === profileId ? { ...p, name } : p,
      );
      const updatedActive =
        state.activeProfile?.id === profileId
          ? { ...state.activeProfile, name }
          : state.activeProfile;
      return {
        ...state,
        profiles: updatedProfiles,
        activeProfile: updatedActive,
      };
    }

    default:
      return state;
  }
}

function checkNewBadges(profile, timerMinutes) {
  const existing = profile.badges || [];
  const award = [];
  if (profile.sessionsCompleted >= 1 && !existing.includes("⭐"))
    award.push("⭐");
  if (profile.sessionsCompleted >= 10 && !existing.includes("🏆"))
    award.push("🏆");
  if (profile.sessionsCompleted >= 25 && !existing.includes("🌟"))
    award.push("🌟");
  if (profile.streak >= 3 && !existing.includes("🔥")) award.push("🔥");
  if (profile.level >= 5 && !existing.includes("🚀")) award.push("🚀");
  if (profile.stars >= 500 && !existing.includes("💎")) award.push("💎");
  if (profile.tasksCompleted >= 5 && !existing.includes("🎯")) award.push("🎯");
  if ((timerMinutes || 0) >= 25 && !existing.includes("⚡")) award.push("⚡");
  return award;
}

function getRewardMessage(stars) {
  if (stars >= 80) return "¡Increíble! ¡Eres una superestrella! 🌟";
  if (stars >= 60) return "¡Fantástico trabajo! ¡Sigue así! 🚀";
  if (stars >= 40) return "¡Muy bien hecho! ¡Eres genial! 🎉";
  return "¡Buen trabajo! ¡Lo lograste! 👏";
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("focuskids_profiles");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: "SET_PROFILES", payload: parsed });
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "focuskids_profiles",
        JSON.stringify(state.profiles),
      );
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
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export { AVATARS };
