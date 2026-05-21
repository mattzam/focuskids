import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import PomodoroTimer from "../components/PomodoroTimer";
import TaskList from "../components/TaskList";

// ── Badge catalog (kept in sync with AppContext) ──────────────────────────────
const BADGE_CATALOG = [
  {
    emoji: "⭐",
    name: "Primera Estrella",
    description: "Completa tu primera sesión Pomodoro",
    type: "sessions",
    value: 1,
  },
  {
    emoji: "🔥",
    name: "En Racha",
    description: "3 días seguidos de estudio",
    type: "streak",
    value: 3,
  },
  {
    emoji: "🏆",
    name: "Campeón del Foco",
    description: "Completa 10 sesiones Pomodoro",
    type: "sessions",
    value: 10,
  },
  {
    emoji: "🚀",
    name: "Despegue",
    description: "Alcanza el Nivel 5",
    type: "level",
    value: 5,
  },
  {
    emoji: "💎",
    name: "Diamante",
    description: "Acumula 500 estrellas",
    type: "stars",
    value: 500,
  },
  {
    emoji: "🎯",
    name: "Puntería Perfecta",
    description: "Completa 5 tareas",
    type: "tasks",
    value: 5,
  },
  {
    emoji: "⚡",
    name: "Súper Velocidad",
    description: "Completa una sesión de 25 minutos",
    type: "sessions25",
    value: 1,
  },
  {
    emoji: "🌟",
    name: "Superestrella",
    description: "Completa 25 sesiones Pomodoro",
    type: "sessions",
    value: 25,
  },
];

const STUDY_TIPS = [
  {
    emoji: "🍅",
    title: "El Método Pomodoro",
    description:
      "¡Estudia 25 minutos y descansa 5! Tu cerebro absorbe mejor la información con descansos cortos.",
    color: "bg-primary/10",
  },
  {
    emoji: "💧",
    title: "¡Hidrátate!",
    description:
      "Toma agua antes de estudiar. Un cerebro bien hidratado aprende hasta un 20% mejor.",
    color: "bg-blue-50",
  },
  {
    emoji: "📵",
    title: "Sin Distracciones",
    description:
      "Aleja el teléfono durante tu sesión. ¡Solo 25 minutos, tú puedes!",
    color: "bg-purple-50",
  },
  {
    emoji: "✏️",
    title: "Toma Notas",
    description:
      "Escribe lo más importante con tus propias palabras. ¡Escribir es recordar!",
    color: "bg-yellow-50",
  },
  {
    emoji: "🧠",
    title: "Repaso Activo",
    description:
      "Después de estudiar, cierra el libro e intenta recordar todo lo que aprendiste.",
    color: "bg-green-50",
  },
  {
    emoji: "🎵",
    title: "Música Instrumental",
    description:
      "La música sin letra puede ayudarte a concentrarte mucho mejor.",
    color: "bg-indigo-50",
  },
  {
    emoji: "😴",
    title: "Duerme Bien",
    description:
      "Dormir 8-10 horas hace que tu cerebro archive lo aprendido. ¡El sueño es superpoder!",
    color: "bg-slate-50",
  },
  {
    emoji: "🏃",
    title: "Muévete",
    description:
      "Un poco de ejercicio antes de estudiar activa tu cerebro y mejora la concentración.",
    color: "bg-orange-50",
  },
];

const LEARNING_SUBJECTS = [
  {
    emoji: "📐",
    title: "Matemáticas",
    desc: "Números y problemas",
    color: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    emoji: "📖",
    title: "Lectura",
    desc: "Cuentos e historias",
    color: "bg-green-100",
    textColor: "text-green-600",
  },
  {
    emoji: "🔬",
    title: "Ciencias",
    desc: "Experimentos y descubrimientos",
    color: "bg-purple-100",
    textColor: "text-purple-600",
  },
  {
    emoji: "🌍",
    title: "Geografía",
    desc: "Países y culturas",
    color: "bg-orange-100",
    textColor: "text-orange-600",
  },
  {
    emoji: "🎨",
    title: "Arte",
    desc: "Creatividad y expresión",
    color: "bg-pink-100",
    textColor: "text-pink-600",
  },
  {
    emoji: "💬",
    title: "Idiomas",
    desc: "Nuevas palabras cada día",
    color: "bg-yellow-100",
    textColor: "text-yellow-600",
  },
];

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inicio");

  // Redirect if no profile selected
  useEffect(() => {
    if (!state.activeProfile) {
      navigate("/");
    }
  }, [state.activeProfile, navigate]);

  // Navigate to reward screen when session completes
  useEffect(() => {
    if (state.timerState === "completed" && state.lastReward) {
      const timer = setTimeout(() => navigate("/reward"), 1200);
      return () => clearTimeout(timer);
    }
  }, [state.timerState, state.lastReward, navigate]);

  if (!state.activeProfile) return null;

  const profile = state.activeProfile;

  const leftTabs = [
    { key: "inicio", icon: "home", label: "INICIO" },
    { key: "aprender", icon: "auto_stories", label: "APRENDER" },
  ];
  const rightTabs = [
    { key: "logros", icon: "workspace_premium", label: "LOGROS" },
    { key: "perfil", icon: "person", label: "PERFIL" },
  ];

  const handleTabClick = (key) => {
    if (key === "perfil") {
      navigate("/profile");
    } else {
      setActiveTab(key);
    }
  };

  const pageTitle = {
    inicio: "FocusKids",
    timer: "Pomodoro",
    aprender: "Aprender",
    logros: "Logros",
  }[activeTab] ?? "FocusKids";

  return (
    <div
      className="min-h-screen bg-bg-light flex flex-col"
      style={{ minHeight: "100dvh" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-slate-50 active:scale-90 transition-all"
          aria-label="Cambiar perfil"
        >
          <span className="material-symbols-outlined text-slate-500 text-xl">
            swap_horiz
          </span>
        </button>

        <h2 className="font-display text-2xl text-primary">{pageTitle}</h2>

        <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center">
          <span className="text-xl">
            {profile.avatar?.emoji || "🦄"}
          </span>
        </div>
      </header>

      <main className="flex-1 px-5 pb-28 overflow-y-auto">
        {activeTab === "inicio" && (
          <InicioTab profile={profile} onStart={() => setActiveTab("timer")} />
        )}
        {activeTab === "timer" && (
          <>
            <PomodoroTimer />
            <TaskList />
          </>
        )}
        {activeTab === "aprender" && <AprenderTab />}
        {activeTab === "logros" && <LogrosTab profile={profile} />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-slate-100 z-40">
        <div className="flex justify-around items-end px-2 pt-2 pb-3">
          {/* Left tabs */}
          {leftTabs.map(({ key, icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTabClick(key)}
              className={`flex flex-col items-center gap-0.5 bg-transparent border-none px-3 py-1 transition-all min-w-[60px] ${
                activeTab === key ? "text-primary" : "text-slate-400"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${activeTab === key ? "fill-icon" : ""}`}
              >
                {icon}
              </span>
              <span className="text-[10px] font-bold tracking-wide">{label}</span>
            </button>
          ))}

          {/* Center play button */}
          <button
            type="button"
            onClick={() => setActiveTab("timer")}
            className="relative -mt-6 flex items-center justify-center w-16 h-16 rounded-full shadow-lg active:scale-95 transition-all"
            style={{
              background: "linear-gradient(135deg, #ff6933 0%, #ff4500 100%)",
              boxShadow: "0 4px 20px rgba(255,105,51,0.45)",
            }}
            aria-label="Iniciar timer"
          >
            <span className="material-symbols-outlined text-white text-3xl">
              {activeTab === "timer" ? "pause" : "play_arrow"}
            </span>
          </button>

          {/* Right tabs */}
          {rightTabs.map(({ key, icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTabClick(key)}
              className={`flex flex-col items-center gap-0.5 bg-transparent border-none px-3 py-1 transition-all min-w-[60px] ${
                activeTab === key ? "text-primary" : "text-slate-400"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${activeTab === key ? "fill-icon" : ""}`}
              >
                {icon}
              </span>
              <span className="text-[10px] font-bold tracking-wide">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ── Tab: Inicio ───────────────────────────────────────────────────────────────
function InicioTab({ profile, onStart }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "¡Buenos días" : hour < 19 ? "¡Buenas tardes" : "¡Buenas noches";

  const studyMinutes = profile.sessionsCompleted * 25;
  const studyLabel =
    studyMinutes === 0
      ? "0m"
      : studyMinutes >= 60
        ? `${Math.floor(studyMinutes / 60)}h${studyMinutes % 60 > 0 ? ` ${studyMinutes % 60}m` : ""}`
        : `${studyMinutes}m`;

  const stats = [
    { label: "Estrellas", value: profile.stars, emoji: "⭐", bg: "bg-amber-50", text: "text-amber-600" },
    { label: "Sesiones", value: profile.sessionsCompleted, emoji: "🍅", bg: "bg-primary/10", text: "text-primary" },
    { label: "Racha", value: `${profile.streak}d`, emoji: "🔥", bg: "bg-orange-50", text: "text-orange-500" },
    { label: "Estudio", value: studyLabel, emoji: "📚", bg: "bg-blue-50", text: "text-blue-500" },
  ];

  return (
    <div className="space-y-5">
      {/* Greeting hero */}
      <div className="bg-gradient-to-br from-primary/10 via-orange-50 to-accent-yellow/20 rounded-3xl p-5">
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${profile.avatar?.bg || "bg-orange-100"}`}
          >
            {profile.avatar?.emoji || "🦄"}
          </div>
          <div>
            <p className="font-display text-2xl text-slate-800 leading-tight">
              {greeting},<br />
              <span className="text-primary">{profile.name}!</span>
            </p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Nivel {profile.level} · {profile.streak} días seguidos 🔥
            </p>
          </div>
        </div>

        {/* Start button */}
        <button
          type="button"
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-display text-xl text-white shadow-md active:scale-95 transition-all"
          style={{
            background: "linear-gradient(135deg, #ff6933 0%, #ff4500 100%)",
            boxShadow: "0 4px 16px rgba(255,105,51,0.4)",
          }}
        >
          <span className="material-symbols-outlined text-2xl">play_arrow</span>
          ¡Iniciar Sesión!
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, emoji, bg, text }) => (
          <div
            key={label}
            className={`${bg} rounded-2xl p-4 flex flex-col gap-1`}
          >
            <span className="text-2xl">{emoji}</span>
            <p className={`font-display text-2xl ${text} leading-none`}>
              {value}
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Task preview */}
      {profile.tasks && profile.tasks.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
            📋 Tarea activa
          </p>
          <p className="font-bold text-slate-800 text-sm">
            {profile.tasks[0].title}
          </p>
          {profile.tasks.length > 1 && (
            <p className="text-xs text-slate-400 mt-1">
              +{profile.tasks.length - 1} más en lista
            </p>
          )}
        </div>
      )}

      {/* Level progress */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Progreso Nivel {profile.level}
          </p>
          <p className="text-xs font-bold text-primary">
            {profile.stars % 100}/100 ⭐
          </p>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(profile.stars % 100)}%`,
              background: "linear-gradient(90deg, #ff6933, #ffb347)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

const BRAIN_TEASERS = [
  {
    q: "Tengo ciudades, pero no casas. Tengo montañas, pero no árboles. Tengo agua, pero no peces. ¿Qué soy?",
    a: "¡Un mapa! 🗺️",
  },
  {
    q: "Cuanto más me secas, más me mojas. ¿Qué soy?",
    a: "¡Una toalla! 🛁",
  },
  {
    q: "¿Qué tiene dientes pero no puede morder?",
    a: "¡Un peine! 💈",
  },
  {
    q: "Corro sin tener piernas. Tengo boca pero no hablo. ¿Qué soy?",
    a: "¡Un río! 🌊",
  },
  {
    q: "Soy redondo y brillante. Caliento todo el día. ¿Qué soy?",
    a: "¡El sol! ☀️",
  },
  {
    q: "Tengo agujas pero no coso. Tengo números pero no soy una calculadora. ¿Qué soy?",
    a: "¡Un reloj! ⏰",
  },
];

const TECHNIQUES = [
  {
    id: "mindmap",
    icon: "🗺️",
    title: "Mapas Mentales",
    body: "Dibuja el tema en el centro y conecta ideas con ramas de colores. Tu cerebro recuerda mejor las conexiones visuales que el texto plano. ¡Usa colores e imágenes!",
  },
  {
    id: "spaced",
    icon: "📅",
    title: "Repetición Espaciada",
    body: "Repasa el tema hoy, en 2 días y luego en una semana. Esta técnica puede duplicar lo que recuerdas a largo plazo porque consolida los recuerdos mientras duermes.",
  },
  {
    id: "teach",
    icon: "🎤",
    title: "Enseña para Aprender",
    body: "Explica lo que aprendiste como si se lo contaras a un amigo más pequeño. Si puedes enseñarlo con tus propias palabras, ¡de verdad lo sabes!",
  },
];

// ── Tab: Aprender ────────────────────────────────────────────────────────────────────────────────
function AprenderTab() {
  const [tipIdx, setTipIdx] = useState(0);
  const [expandedTech, setExpandedTech] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const teaserIdx = new Date().getDate() % BRAIN_TEASERS.length;
  const teaser = BRAIN_TEASERS[teaserIdx];
  const tip = STUDY_TIPS[tipIdx % STUDY_TIPS.length];

  return (
    <div className="space-y-5">
      {/* Rotating tip card */}
      <div className={`${tip.color} rounded-3xl p-5 shadow-sm`}>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">
          💡 Consejo del Día
        </p>
        <div className="flex items-start gap-4">
          <span className="text-5xl">{tip.emoji}</span>
          <div className="flex-1">
            <h3 className="font-display text-xl text-slate-800 mb-1">
              {tip.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {tip.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-1.5">
            {STUDY_TIPS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTipIdx(i)}
                className={`h-2 rounded-full transition-all ${
                  i === tipIdx % STUDY_TIPS.length
                    ? "bg-primary w-4"
                    : "bg-slate-300 w-2"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setTipIdx((i) => i + 1)}
            className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
            Siguiente
          </button>
        </div>
      </div>

      {/* 🧩 Desafío del Día */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-5 border border-purple-100 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-purple-500 mb-3">
          🧩 Desafío del Día
        </p>
        <p className="font-bold text-slate-700 text-sm leading-relaxed mb-4">
          {teaser.q}
        </p>
        {showAnswer ? (
          <div className="bg-white rounded-2xl p-4 border border-purple-100 text-center">
            <p className="font-display text-xl text-purple-600">{teaser.a}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAnswer(true)}
            className="w-full py-2.5 px-4 bg-purple-500 text-white rounded-2xl font-bold text-sm hover:bg-purple-600 active:scale-95 transition-all shadow-sm"
          >
            🔍 ¡Revelar Respuesta!
          </button>
        )}
        {showAnswer && (
          <button
            type="button"
            onClick={() => setShowAnswer(false)}
            className="mt-2 text-xs text-purple-400 font-bold w-full text-center hover:text-purple-600"
          >
            Ocultar
          </button>
        )}
      </div>

      {/* How Pomodoro works */}}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-display text-xl text-slate-800 mb-4">
          🍅 ¿Cómo funciona el Pomodoro?
        </h3>
        <div className="space-y-3">
          {[
            {
              step: "1",
              icon: "🎯",
              text: "Elige una tarea de tu lista",
              color: "bg-primary/10 text-primary",
            },
            {
              step: "2",
              icon: "⏱️",
              text: "Estudia enfocado por 25 minutos",
              color: "bg-blue-50 text-blue-600",
            },
            {
              step: "3",
              icon: "😴",
              text: "Descansa 5 minutos bien merecidos",
              color: "bg-accent-green/10 text-accent-green",
            },
            {
              step: "4",
              icon: "⭐",
              text: "¡Gana estrellas e insignias!",
              color: "bg-accent-yellow/20 text-amber-600",
            },
          ].map(({ step, icon, text, color }) => (
            <div
              key={step}
              className={`flex items-center gap-3 ${color} rounded-xl p-3`}
            >
              <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                {step}
              </div>
              <span className="text-2xl">{icon}</span>
              <p className="font-semibold text-sm flex-1">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🧠 Técnicas Pro */}
      <div>
        <h3 className="font-display text-xl text-slate-800 mb-3">
          🧠 Técnicas Pro
        </h3>
        <div className="space-y-2">
          {TECHNIQUES.map((tech) => (
            <div
              key={tech.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <button
                type="button"
                className="w-full flex items-center gap-3 p-4 text-left"
                onClick={() =>
                  setExpandedTech(expandedTech === tech.id ? null : tech.id)
                }
              >
                <span className="text-2xl">{tech.icon}</span>
                <span className="font-bold text-slate-800 text-sm flex-1">
                  {tech.title}
                </span>
                <span
                  className="material-symbols-outlined text-slate-400 transition-transform duration-200"
                  style={{
                    transform:
                      expandedTech === tech.id
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  }}
                >
                  expand_more
                </span>
              </button>
              {expandedTech === tech.id && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3">
                    {tech.body}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subject cards grid */}}
      <div>
        <h3 className="font-display text-xl text-slate-800 mb-3">
          📚 Áreas de Aprendizaje
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {LEARNING_SUBJECTS.map(({ emoji, title, desc, color, textColor }) => (
            <div
              key={title}
              className={`${color} rounded-2xl p-3 flex flex-col items-center text-center gap-1`}
            >
              <span className="text-3xl">{emoji}</span>
              <p className={`font-bold text-xs ${textColor}`}>{title}</p>
              <p className="text-xs text-slate-500 leading-tight">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fun fact */}
      <div className="bg-slate-900 text-white rounded-2xl p-5">
        <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">
          🧠 ¿Sabías que...?
        </p>
        <p className="text-sm leading-relaxed font-semibold">
          Los niños que usan el método Pomodoro recuerdan hasta un{" "}
          <span className="text-accent-yellow font-display text-xl">40%</span>{" "}
          más que quienes estudian largas horas seguidas. ¡Tu cerebro necesita
          descansos para aprender!
        </p>
      </div>
    </div>
  );
}

// ── Tab: Logros ───────────────────────────────────────────────────────────────
function LogrosTab({ profile }) {
  const earned = profile.badges || [];
  const earnedCount = earned.length;
  const totalCount = BADGE_CATALOG.length;
  const pct = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;
  const studyMinutes = profile.sessionsCompleted * 25;
  const studyTimeLabel =
    studyMinutes === 0
      ? "0m"
      : studyMinutes >= 60
        ? `${Math.floor(studyMinutes / 60)}h${
            studyMinutes % 60 > 0 ? ` ${studyMinutes % 60}m` : ""
          }`
        : `${studyMinutes}m`;
  const nextBadge = BADGE_CATALOG.filter((b) => !earned.includes(b.emoji))
    .map((b) => {
      let current = 0;
      if (b.type === "sessions" || b.type === "sessions25")
        current = profile.sessionsCompleted;
      else if (b.type === "tasks") current = profile.tasksCompleted;
      else if (b.type === "streak") current = profile.streak;
      else if (b.type === "stars") current = profile.stars;
      else if (b.type === "level") current = profile.level;
      return {
        ...b,
        current,
        pct: b.value > 0 ? Math.min(100, (current / b.value) * 100) : 0,
      };
    })
    .sort((a, b) => b.pct - a.pct)[0];

  return (
    <div className="space-y-5">
      {/* 🎯 Próxima Insignia */}
      {nextBadge && (
        <div className="bg-gradient-to-r from-primary/10 to-accent-yellow/20 rounded-2xl p-4 border border-primary/20 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl shrink-0">
            {nextBadge.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-primary uppercase tracking-wide mb-0.5">
              🎯 Próxima Insignia
            </p>
            <p className="font-bold text-slate-800 text-sm">{nextBadge.name}</p>
            <p className="text-xs text-slate-500 mb-1.5">
              {nextBadge.description}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${nextBadge.pct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-500 shrink-0">
                {Math.min(nextBadge.current, nextBadge.value)}/{nextBadge.value}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 📚 Tiempo total de estudio */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shrink-0">
          📚
        </div>
        <div>
          <p className="font-display text-2xl text-blue-600 leading-none">
            {studyTimeLabel}
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-0.5">
            Tiempo total de estudio
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-display text-xl text-primary">
            {profile.sessionsCompleted}
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            sesiones
          </p>
        </div>
      </div>

      {/* Overview card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-accent-yellow/20 flex items-center justify-center text-4xl">
            🏆
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl text-slate-800">Mis Logros</h2>
            <p className="text-sm text-slate-500 font-semibold">
              {earnedCount} de {totalCount} insignias obtenidas
            </p>
          </div>
          <div className="text-right">
            <span className="font-display text-3xl text-primary">
              {earnedCount}
            </span>
            <span className="text-slate-400 text-base">/{totalCount}</span>
          </div>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-yellow to-primary rounded-full transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1 text-right font-semibold">
          {totalCount - earnedCount} insignias por desbloquear
        </p>
      </div>

      {/* Earned badges highlight */}
      {earnedCount > 0 ? (
        <div className="bg-gradient-to-br from-accent-yellow/20 to-primary/10 rounded-2xl p-5 border border-accent-yellow/20">
          <h3 className="font-display text-lg text-slate-800 mb-3">
            ✨ Tus Insignias
          </h3>
          <div className="flex gap-3 flex-wrap">
            {earned.map((b, i) => {
              const cat = BADGE_CATALOG.find((bc) => bc.emoji === b);
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-4xl">
                    {b}
                  </div>
                  {cat && (
                    <p className="text-xs font-bold text-slate-600 text-center w-16 leading-tight">
                      {cat.name}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-5xl mb-3">🔒</div>
          <p className="font-display text-xl text-slate-700">
            ¡Empieza a estudiar!
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Completa sesiones Pomodoro para desbloquear insignias
          </p>
        </div>
      )}

      {/* Full catalog with individual progress */}
      <div>
        <h3 className="font-display text-lg text-slate-800 mb-3">
          📋 Todas las Insignias
        </h3>
        <div className="space-y-2">
          {BADGE_CATALOG.map((badge) => {
            const isEarned = earned.includes(badge.emoji);
            let current = 0;
            if (badge.type === "sessions" || badge.type === "sessions25")
              current = profile.sessionsCompleted;
            else if (badge.type === "tasks") current = profile.tasksCompleted;
            else if (badge.type === "streak") current = profile.streak;
            else if (badge.type === "stars") current = profile.stars;
            else if (badge.type === "level") current = profile.level;
            const badgePct =
              badge.value > 0
                ? Math.min(100, (current / badge.value) * 100)
                : 0;

            return (
              <div
                key={badge.name}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                  isEarned
                    ? "bg-accent-yellow/10 border-accent-yellow/30"
                    : "bg-white border-slate-100"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                    isEarned ? "bg-accent-yellow/20" : "bg-slate-100"
                  }`}
                >
                  {isEarned ? badge.emoji : "🔒"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-800 text-sm">
                      {badge.name}
                    </p>
                    {isEarned && (
                      <span className="material-symbols-outlined text-accent-green text-base fill-icon">
                        check_circle
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-1">
                    {badge.description}
                  </p>
                  {!isEarned && (
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${badgePct}%` }}
                      />
                    </div>
                  )}
                </div>
                {!isEarned && (
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-400">
                      {Math.min(current, badge.value)}/{badge.value}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
