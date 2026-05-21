import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

export default function StarsDisplay() {
  const { state } = useApp();
  const profile = state.activeProfile;
  const [animating, setAnimating] = useState(false);
  const [displayStars, setDisplayStars] = useState(profile?.stars || 0);

  useEffect(() => {
    if (!profile) return;
    if (profile.stars !== displayStars) {
      setAnimating(true);
      const diff = profile.stars - displayStars;
      const steps = Math.min(Math.abs(diff), 20);
      const stepSize = diff / steps;
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setDisplayStars((prev) => Math.round(prev + stepSize));
        if (count >= steps) {
          clearInterval(interval);
          setDisplayStars(profile.stars);
          setTimeout(() => setAnimating(false), 500);
        }
      }, 50);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.stars]);

  if (!profile) return null;

  return (
    <div
      className={`flex items-center gap-2 bg-accent-yellow/20 px-4 py-2 rounded-full transition-all ${animating ? "scale-110" : "scale-100"}`}
    >
      <span className={`text-xl ${animating ? "star-bounce" : ""}`}>⭐</span>
      <span className="font-display text-amber-600 font-bold text-lg">
        {displayStars}
      </span>
    </div>
  );
}
