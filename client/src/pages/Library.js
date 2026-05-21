import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Library() {
  const navigate = useNavigate();

  const TOPICS = [
    { icon: '🌎', title: 'Planetas del Sistema Solar', color: 'bg-indigo-100', text: 'text-indigo-600' },
    { icon: '🦕', title: 'La Era de los Dinosaurios', color: 'bg-green-100', text: 'text-green-600' },
    { icon: '➗', title: 'Trucos de Matemáticas', color: 'bg-blue-100', text: 'text-blue-600' },
    { icon: '🎨', title: 'Aprende a Dibujar', color: 'bg-pink-100', text: 'text-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-bg-light flex flex-col pb-24" style={{ minHeight: '100dvh' }}>
      <header className="flex items-center gap-3 p-5 pt-6 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)} // Vuelve atrás
          className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-90 transition-all text-slate-600"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-display text-slate-800">Biblioteca</h1>
      </header>

      <main className="flex-1 p-5 overflow-y-auto">
        <section className="text-center mb-8">
          <div className="text-6xl mb-3">📚</div>
          <h2 className="text-2xl font-display text-slate-800 mb-1">¡Aprende algo nuevo!</h2>
          <p className="text-slate-500 font-bold">Usa tus pomodoros para explorar estos temas interactivos.</p>
        </section>

        <div className="space-y-4">
          {TOPICS.map((topic, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-4 bg-white p-4 rounded-3xl border-2 border-transparent hover:border-primary transition-all shadow-sm active:scale-95 text-left group"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${topic.color} ${topic.text}`}>
                {topic.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors">{topic.title}</h3>
                <p className="text-sm font-semibold text-slate-400">Lectura · 15 mins</p>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-3xl">
                chevron_right
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
