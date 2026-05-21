import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, AVATARS } from "../context/AppContext";

const BADGE_CATALOG = [
  {
    emoji: "⭐",
    name: "Primera Estrella",
    description: "Completa tu primera sesión Pomodoro",
  },
  { emoji: "🔥", name: "En Racha", description: "3 días seguidos de estudio" },
  {
    emoji: "🏆",
    name: "Campeón del Foco",
    description: "Completa 10 sesiones Pomodoro",
  },
  { emoji: "🚀", name: "Despegue", description: "Alcanza el Nivel 5" },
  { emoji: "💎", name: "Diamante", description: "Acumula 500 estrellas" },
  { emoji: "🎯", name: "Puntería Perfecta", description: "Completa 5 tareas" },
  {
    emoji: "⚡",
    name: "Súper Velocidad",
    description: "Completa una sesión de 25 minutos",
  },
  {
    emoji: "🌟",
    name: "Superestrella",
    description: "Completa 25 sesiones Pomodoro",
  },
];

const QUOTES = [
  {
    text: '"El éxito es la suma de pequeños esfuerzos repetidos día tras día."',
    author: "— Robert Collier",
  },
  {
    text: '"No importa cuán lento vayas, siempre y cuando no te detengas."',
    author: "— Confucio",
  },
  {
    text: '"El genio es un 1% de inspiración y un 99% de transpiración."',
    author: "— Thomas Edison",
  },
  {
    text: '"La educación es el arma más poderosa para cambiar el mundo."',
    author: "— Nelson Mandela",
  },
  {
    text: '"Cree que puedes y ya estás a mitad del camino."',
    author: "— Theodore Roosevelt",
  },
];

function getRank(level) {
  if (level >= 15)
    return { label: "Maestro", emoji: "💎", color: "text-blue-600 bg-blue-50" };
  if (level >= 10)
    return {
      label: "Campeón",
      emoji: "🏆",
      color: "text-amber-600 bg-amber-50",
    };
  if (level >= 5)
    return {
      label: "Explorador",
      emoji: "🌟",
      color: "text-purple-600 bg-purple-50",
    };
  if (level >= 3)
    return {
      label: "Aprendiz",
      emoji: "📚",
      color: "text-green-600 bg-green-50",
    };
  return {
    label: "Principiante",
    emoji: "🌱",
    color: "text-primary bg-primary/10",
  };
}

export default function ProfilePage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const profile = state.activeProfile;
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    if (!profile) navigate("/");
  }, [profile, navigate]);

  useEffect(() => {
    const t = setInterval(
      () => setQuoteIdx((i) => (i + 1) % QUOTES.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

  if (!profile) return null;

  const levelProgress = profile.stars % 100;
  const starsToNextLevel = 100 - levelProgress;
  const earned = profile.badges || [];
  const rank = getRank(profile.level);
  const studyMinutes = profile.sessionsCompleted * 25;
  const studyTimeLabel =
    studyMinutes === 0
      ? "0m"
      : studyMinutes >= 60
        ? `${Math.floor(studyMinutes / 60)}h${
            studyMinutes % 60 > 0 ? ` ${studyMinutes % 60}m` : ""
          }`
        : `${studyMinutes}m`;

  const handleRename = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== profile.name) {
      dispatch({
        type: "RENAME_PROFILE",
        payload: { profileId: profile.id, name: trimmed },
      });
    }
    setIsEditingName(false);
  };

  const handleAvatarChange = (avatarIndex) => {
    dispatch({
      type: "UPDATE_AVATAR",
      payload: { profileId: profile.id, avatarIndex },
    });
    setEditingAvatar(false);
  };

  const stats = [
    {
      icon: "⏱️",
      label: "Sesiones",
      value: profile.sessionsCompleted,
      bg: "bg-primary/10",
      color: "text-primary",
    },
    {
      icon: "⭐",
      label: "Estrellas",
      value: profile.stars,
      bg: "bg-accent-yellow/20",
      color: "text-amber-600",
    },
    {
      icon: "🔥",
      label: "Racha",
      value: `${profile.streak}d`,
      bg: "bg-orange-50",
      color: "text-orange-500",
    },
    {
      icon: "📚",
      label: "Tiempo",
      value: studyTimeLabel,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
  ];

  return (
    <div
      className="min-h-screen bg-bg-light flex flex-col"
      style={{ minHeight: "100dvh" }}
    >
      {/* Header */}
      <header className="flex items-center gap-3 p-5 bg-white border-b border-slate-100 shadow-sm">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-display text-slate-800">Mi Perfil</h1>
        <div className="ml-auto bg-primary/10 px-3 py-1 rounded-full">
          <span className="text-primary text-sm font-bold">
            Nivel {profile.level}
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-10">
        {/* Hero: avatar + name + level */}
        <div className="flex flex-col items-center py-8 px-5 bg-white border-b border-slate-100">
          <button
            type="button"
            onClick={() => setEditingAvatar(true)}
            className="relative group mb-4"
            aria-label="Cambiar avatar"
          >
            <div
              className={`w-28 h-28 rounded-full ${profile.avatar?.bg || "bg-orange-100"} flex items-center justify-center text-6xl shadow-lg border-4 border-white group-hover:scale-105 transition-transform`}
            >
              {profile.avatar?.emoji || "🦄"}
            </div>
            <div className="absolute bottom-1 right-1 bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md border-2 border-white">
              <span className="material-symbols-outlined text-lg">edit</span>
            </div>
          </button>

          {isEditingName ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                autoFocus
                className="border-2 border-primary rounded-xl px-3 py-1 font-display text-xl text-center outline-none w-40 bg-white shadow-sm"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") setIsEditingName(false);
                }}
                maxLength={20}
              />
              <button
                type="button"
                onClick={handleRename}
                className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center text-accent-green hover:bg-accent-green/30"
              >
                <span className="material-symbols-outlined text-lg">check</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <h2 className="text-3xl font-display text-slate-800">
                {profile.name}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEditName(profile.name);
                  setIsEditingName(true);
                }}
                className="w-7 h-7 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
                aria-label="Editar nombre"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${rank.color}`}
            >
              {rank.emoji} {rank.label}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Nivel {profile.level}
            </span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-semibold">
              🔥 {profile.streak} días
            </span>
          </div>

          {/* Level progress */}
          <div className="w-full max-w-xs mt-5">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Nivel {profile.level}</span>
              <span>Nivel {profile.level + 1}</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent-yellow rounded-full transition-all duration-1000"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="text-center text-xs text-slate-400 mt-1 font-semibold">
              ⭐ {levelProgress}/100 · Faltan {starsToNextLevel} para subir de
              nivel
            </p>
          </div>
        </div>

        <div className="px-5 pt-5 space-y-5">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ icon, label, value, bg, color }) => (
              <div
                key={label}
                className={`${bg} rounded-2xl p-4 flex items-center gap-3`}
              >
                <span className="text-3xl">{icon}</span>
                <div>
                  <div
                    className={`font-display text-2xl leading-none ${color}`}
                  >
                    {value}
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-0.5">
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Badges section */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl text-slate-800">Insignias</h3>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                {earned.length}/{BADGE_CATALOG.length}
              </span>
            </div>

            {earned.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">🔒</div>
                <p className="text-slate-500 font-semibold text-sm">
                  ¡Completa sesiones para ganar insignias!
                </p>
              </div>
            ) : (
              <div className="flex gap-3 flex-wrap mb-4">
                {earned.map((b, i) => {
                  const cat = BADGE_CATALOG.find((c) => c.emoji === b);
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="w-14 h-14 bg-accent-yellow/20 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                        {b}
                      </div>
                      {cat && (
                        <p className="text-xs font-bold text-slate-500 text-center w-16 leading-tight">
                          {cat.name}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {earned.length < BADGE_CATALOG.length && (
              <>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                  Por desbloquear
                </p>
                <div className="flex gap-3 flex-wrap">
                  {BADGE_CATALOG.filter((b) => !earned.includes(b.emoji)).map(
                    (badge) => (
                      <div
                        key={badge.name}
                        className="flex flex-col items-center gap-1 opacity-40"
                      >
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">
                          🔒
                        </div>
                        <p className="text-xs font-bold text-slate-400 text-center w-16 leading-tight">
                          {badge.name}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </>
            )}
          </div>

          {/* Motivational quotes — rotating */}
          <div className="bg-slate-900 text-white rounded-2xl p-5">
            <p className="text-xs font-bold text-primary uppercase tracking-wide mb-3">
              ✨ Recuerda siempre
            </p>
            <p className="font-display text-xl leading-snug min-h-[3.5rem]">
              {QUOTES[quoteIdx].text}
            </p>
            <p className="text-slate-400 text-xs mt-2 font-semibold">
              {QUOTES[quoteIdx].author}
            </p>
            <div className="flex gap-1.5 mt-4 justify-center">
              {QUOTES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setQuoteIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === quoteIdx ? "bg-primary w-4" : "bg-white/20 w-1.5"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Avatar picker bottom sheet */}
      {editingAvatar && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setEditingAvatar(false)}
        >
          <div
            className="bg-white rounded-t-3xl p-6 w-full max-w-md animate-[slideUp_0.3s_ease-out_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-display text-center mb-5 text-slate-800">
              Elige tu Avatar
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {AVATARS.map((av, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAvatarChange(i)}
                  className={`h-24 rounded-2xl text-5xl flex items-center justify-center transition-all ${av.bg} ${
                    profile.avatar?.emoji === av.emoji
                      ? "ring-4 ring-primary scale-105 shadow-lg"
                      : "hover:scale-105 hover:shadow-md"
                  }`}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
            <div className="h-6" />
          </div>
        </div>
      )}
    </div>
  );
}
