import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

export function usePomodoro() {
  const { state, dispatch } = useApp();
  const intervalRef = useRef(null);

  const { timerState, timeLeft } = state;

  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerState, dispatch]);

  // Auto-complete when time runs out
  // Note: TICK now keeps timerState as 'running' when timeLeft reaches 0,
  // so this effect correctly detects the moment to award stars.
  useEffect(() => {
    if (timeLeft === 0 && timerState === "running") {
      dispatch({ type: "COMPLETE_SESSION", payload: calculateStars(state) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, timerState]);

  const start = () => dispatch({ type: "SET_TIMER_STATE", payload: "running" });
  const pause = () => dispatch({ type: "SET_TIMER_STATE", payload: "paused" });
  const reset = () => dispatch({ type: "RESET_TIMER" });
  const skip = () =>
    dispatch({ type: "COMPLETE_SESSION", payload: calculateStars(state) });
  const startBreak = () => dispatch({ type: "START_BREAK" });

  return { start, pause, reset, skip, startBreak };
}

function calculateStars(state) {
  const task = state.activeProfile?.tasks[state.activeTaskIndex];
  if (!task) return 30;
  const ratio = 1 - state.timeLeft / (task.duration * 60);
  if (ratio >= 0.95) return 80;
  if (ratio >= 0.8) return 60;
  if (ratio >= 0.5) return 40;
  return 30;
}
