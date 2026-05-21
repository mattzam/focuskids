import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const TASK_EMOJIS = [
  "📚",
  "📖",
  "🎨",
  "🔬",
  "✏️",
  "🎵",
  "🧩",
  "💻",
  "🌍",
  "🧮",
];
const DURATIONS = [15, 20, 25];

export default function TaskList() {
  const { state, dispatch } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newEmoji, setNewEmoji] = useState("📚");
  const [newDuration, setNewDuration] = useState(20);

  const tasks = state.activeProfile?.tasks || [];
  const activeIdx = state.activeTaskIndex;

  const handleAdd = () => {
    if (newTitle.trim()) {
      dispatch({
        type: "ADD_TASK",
        payload: {
          title: newTitle.trim(),
          emoji: newEmoji,
          duration: newDuration,
        },
      });
      setNewTitle("");
      setShowAdd(false);
    }
  };

  return (
    <section className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-display text-slate-800">Tareas de Hoy</h3>
        {tasks.length < 3 && (
          <button
            onClick={() => setShowAdd(true)}
            className="text-primary font-bold text-sm flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            <span className="material-symbols-outlined text-base">
              add_circle
            </span>
            Agregar
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-slate-500 font-semibold">No hay tareas aún</p>
          <p className="text-slate-400 text-sm">
            ¡Agrega una tarea para comenzar!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.slice(0, 3).map((task, i) => (
            <TaskCard
              key={task.id}
              task={task}
              isActive={i === activeIdx && state.timerState !== "idle"}
              isCompleted={task.status === "done"}
              index={i}
              delay={i * 80}
            />
          ))}
        </div>
      )}

      {/* Add Task Sheet */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="bg-white rounded-t-3xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-2xl font-display text-center mb-5 text-slate-800">
              Nueva Tarea
            </h4>

            {/* Emoji picker */}
            <div className="flex gap-2 flex-wrap justify-center mb-4">
              {TASK_EMOJIS.map((em) => (
                <button
                  key={em}
                  onClick={() => setNewEmoji(em)}
                  className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${newEmoji === em ? "bg-primary/20 ring-2 ring-primary scale-110" : "bg-slate-100 hover:scale-105"}`}
                >
                  {em}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Nombre de la tarea..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-lg font-body focus:outline-none focus:border-primary mb-4"
              autoFocus
              maxLength={30}
            />

            {/* Duration */}
            <div className="flex items-center gap-2 justify-center mb-5">
              <span className="text-sm font-bold text-slate-500">Tiempo:</span>
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setNewDuration(d)}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${newDuration === d ? "bg-primary text-white shadow" : "bg-slate-100 text-slate-600"}`}
                >
                  {d} min
                </button>
              ))}
            </div>

            <button
              onClick={handleAdd}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/30"
            >
              Agregar Tarea ✅
            </button>
            <div className="h-4" />
          </div>
        </div>
      )}
    </section>
  );
}

function TaskCard({ task, isActive, isCompleted, index, delay }) {
  const statusConfig = {
    done: {
      border: "border-accent-green/40",
      bg: "bg-accent-green/5",
      iconBg: "bg-accent-green/20",
      dot: null,
    },
    active: {
      border: "border-primary border-2",
      bg: "bg-white",
      iconBg: "bg-primary/20",
      dot: <div className="w-3 h-3 rounded-full bg-primary" />,
    },
    pending: {
      border: "border-slate-100",
      bg: "bg-white",
      iconBg: "bg-slate-100",
      dot: null,
    },
  };

  const status = isCompleted ? "done" : isActive ? "active" : "pending";
  const cfg = statusConfig[status];

  return (
    <div
      className={`${cfg.bg} border ${cfg.border} rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-[slideUp_0.3s_ease-out_forwards] transition-all`}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div
        className={`w-12 h-12 rounded-xl ${cfg.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}
      >
        {task.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <h4
          className={`font-bold text-base truncate ${isCompleted ? "line-through text-slate-400" : "text-slate-900"}`}
        >
          {task.title}
        </h4>
        <p className="text-sm text-slate-400 font-semibold">
          {isActive
            ? "✨ Enfocándose ahora..."
            : isCompleted
              ? "✅ Completada"
              : `⏱️ ${task.duration} min`}
        </p>
      </div>

      <div className="flex-shrink-0">
        {isCompleted ? (
          <div className="w-7 h-7 rounded-full bg-accent-green flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-base fill-icon">
              check
            </span>
          </div>
        ) : isActive ? (
          <div className="w-7 h-7 rounded-full border-2 border-primary flex items-center justify-center">
            {cfg.dot}
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full border-2 border-slate-200" />
        )}
      </div>
    </div>
  );
}
