import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { sessionsAPI } from '../api';

export function usePomodoro() {
  const { state, dispatch } = useApp();
  const intervalRef = useRef(null);

  const { timerState, timeLeft, activeProfile, activeTaskIndex, timerMinutes } = state;

  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerState, dispatch]);

  // Auto-complete when time runs out
  useEffect(() => {
    if (timeLeft === 0 && timerState === 'running') {
      handleSessionComplete(true);
    }
  }, [timeLeft, timerState]);

  const handleSessionComplete = async (completedFully) => {
    const task = activeProfile?.tasks?.[activeTaskIndex];
    const durationPlanned = task?.duration || timerMinutes;
    const durationActual = completedFully ? durationPlanned : Math.round((durationPlanned * 60 - timeLeft) / 60);
    const starsEarned = calculateStars(durationPlanned, timeLeft, completedFully);

    try {
      // 1. Guardar en Base de Datos
      const res = await sessionsAPI.create({
        profile_id: activeProfile.id,
        task_id: task?.id || null,
        duration_planned: durationPlanned,
        duration_actual: durationActual,
        stars_earned: starsEarned,
        completed: completedFully
      });

      dispatch({ 
        type: 'COMPLETE_SESSION', 
        payload: { 
          stars: starsEarned, 
          newBadge: res.newBadge,
          profileUpdate: res.profile 
        } 
      });
      
    } catch (error) {
      console.error("Error guardando sesión:", error);
      dispatch({ type: 'COMPLETE_SESSION', payload: { stars: starsEarned } });
    }
  };

  const start = () => dispatch({ type: 'SET_TIMER_STATE', payload: 'running' });
  const pause = () => dispatch({ type: 'SET_TIMER_STATE', payload: 'paused' });
  const reset = () => dispatch({ type: 'RESET_TIMER' });
  const skip = () => handleSessionComplete(false);
  const startBreak = () => dispatch({ type: 'START_BREAK' });

  return { start, pause, reset, skip, startBreak };
}

function calculateStars(durationPlanned, timeLeft, completedFully) {
  if (completedFully) return 80;
  const ratio = 1 - (timeLeft / (durationPlanned * 60));
  if (ratio >= 0.8) return 60;
  if (ratio >= 0.5) return 40;
  return 10;
}
