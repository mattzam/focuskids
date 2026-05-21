import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const CONFETTI_COLORS = ["#ff6933", "#FFD166", "#06D6A0", "#ff8c5a", "#fff"];

function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -200,
      w: 8 + Math.random() * 8,
      h: 5 + Math.random() * 5,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      speed: 2 + Math.random() * 4,
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 8,
      drift: (Math.random() - 0.5) * 2,
    }));

    let animId;
    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      pieces.forEach((p) => {
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - p.y / canvas.height);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (frame < 180) animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

function StarCounter({ target }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [target]);

  return <span className="text-accent-yellow font-display">{count}</span>;
}

export default function RewardScreen() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const reward = state.lastReward;
  const profile = state.activeProfile;

  useEffect(() => {
    if (!profile || !reward) {
      navigate("/");
      return;
    }
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!profile || !reward) return null;

  const handleNextTask = () => {
    dispatch({ type: "COMPLETE_TASK" });
    dispatch({ type: "RESET_TIMER" });
    navigate("/dashboard");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen bg-bg-light flex flex-col"
      style={{ minHeight: "100dvh" }}
    >
      <Confetti />

      {/* Header */}
      <div className="flex items-center bg-bg-light p-4 justify-between">
        <button
          onClick={handleGoHome}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12">
          ¡Sesión Completada!
        </h2>
      </div>

      {/* Celebration area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Glowing star character */}
        <div
          className={`relative w-full max-w-xs aspect-square flex items-center justify-center transition-all duration-700 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-accent-yellow/20 rounded-full blur-3xl" />

          {/* Main mascot */}
          <div className="relative z-10 float-animation">
            <div className="w-52 h-52 bg-gradient-to-br from-accent-yellow/30 to-primary/20 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-9xl">{profile.avatar?.emoji || "🌟"}</span>
            </div>
          </div>

          {/* Floating stars */}
          {[
            { top: "5%", left: "15%", size: "text-4xl", delay: "0s" },
            { top: "10%", right: "10%", size: "text-3xl", delay: "0.2s" },
            { bottom: "15%", left: "5%", size: "text-2xl", delay: "0.4s" },
            { top: "45%", right: "-5%", size: "text-2xl", delay: "0.6s" },
            { bottom: "5%", right: "20%", size: "text-3xl", delay: "0.8s" },
          ].map((pos, i) => (
            <span
              key={i}
              className={`absolute ${pos.size} animate-bounce`}
              style={{
                ...pos,
                animationDelay: pos.delay,
                animationDuration: `${1.5 + i * 0.3}s`,
              }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Message */}
        <div
          className={`text-center mt-6 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1 className="text-4xl font-display text-slate-900 leading-tight">
            ¡Genial, {profile.name}!
          </h1>
          <p className="text-slate-600 text-lg font-semibold mt-3 px-4">
            ¡Estuviste súper enfocado! Ganaste{" "}
            <StarCounter target={reward.stars} /> ⭐ para tu colección.
          </p>
        </div>

        {/* Stats row */}
        <div
          className={`flex gap-4 mt-6 transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {[
            { icon: "⏱️", value: `${state.timerMinutes}min`, label: "Tiempo" },
            { icon: "🔥", value: `${profile.streak}`, label: "Racha" },
            {
              icon: "🏆",
              value: `${profile.sessionsCompleted}`,
              label: "Sesiones",
            },
          ].map(({ icon, value, label }) => (
            <div
              key={label}
              className="flex-1 bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-100"
            >
              <div className="text-2xl">{icon}</div>
              <div className="font-display text-xl text-slate-800">{value}</div>
              <div className="text-xs text-slate-400 font-semibold">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Achievement badge */}
        {reward.achievement && (
          <div
            className={`mt-5 flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow border border-slate-100 transition-all duration-700 delay-700 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
          >
            <div className="bg-accent-yellow rounded-full p-2 flex items-center justify-center text-2xl w-10 h-10">
              {typeof reward.achievement === "string"
                ? reward.achievement
                : "🏆"}
            </div>
            <span className="font-bold text-slate-800 uppercase tracking-wide text-sm">
              ¡Nueva Insignia Desbloqueada!
            </span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div
        className={`px-6 pb-10 flex flex-col gap-3 transition-all duration-700 delay-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <button
          onClick={handleNextTask}
          className="w-full bg-accent-green text-white py-5 rounded-2xl text-xl font-display shadow-xl shadow-accent-green/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Siguiente Tarea
          <span className="material-symbols-outlined">play_arrow</span>
        </button>
        <button
          onClick={handleGoHome}
          className="w-full bg-slate-100 text-slate-700 py-5 rounded-2xl text-xl font-display hover:bg-slate-200 active:scale-[0.98] transition-all"
        >
          Volver al Inicio
        </button>
      </div>

      {/* Bottom nav */}
      <div className="flex gap-2 border-t border-slate-200 bg-bg-light px-4 pb-6 pt-2">
        {[
          {
            icon: "home",
            label: "Inicio",
            active: false,
            onClick: handleGoHome,
          },
          {
            icon: "check_circle",
            label: "Tareas",
            active: true,
            onClick: () => navigate("/dashboard"),
          },
          {
            icon: "grade",
            label: "Estrellas",
            active: false,
            onClick: () => {},
          },
          {
            icon: "person_pin",
            label: "Padres",
            active: false,
            onClick: () => navigate("/parent"),
          },
        ].map(({ icon, label, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex flex-1 flex-col items-center justify-end gap-1 ${active ? "text-accent-green" : "text-slate-400"}`}
          >
            <div className="flex h-8 items-center justify-center">
              <span
                className={`material-symbols-outlined ${active ? "fill-icon" : ""}`}
              >
                {icon}
              </span>
            </div>
            <p className="text-xs font-semibold">{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
