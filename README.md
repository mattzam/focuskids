# 🚀 FocusKids — MVP

**Aplicación de gestión del tiempo para niños de 6–12 años usando Pomodoro + Gamificación.**

---

## 📁 Estructura del Proyecto

```
focuskids/
├── client/                    # React + Tailwind CSS
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api.js             # Cliente Axios para la API
│   │   ├── App.js             # Rutas principales
│   │   ├── index.css          # Estilos globales + Tailwind
│   │   ├── context/
│   │   │   └── AppContext.js  # Estado global (perfiles, temporizador, estrellas)
│   │   ├── hooks/
│   │   │   └── usePomodoro.js # Lógica del temporizador Pomodoro
│   │   ├── components/
│   │   │   ├── PomodoroTimer.js  # ⭐ Componente principal del timer visual
│   │   │   ├── TaskList.js       # Lista de tareas (máx. 3)
│   │   │   └── StarsDisplay.js   # Contador animado de estrellas
│   │   └── pages/
│   │       ├── ProfileSelect.js  # 🏠 Pantalla 1: Selección de perfil
│   │       ├── Dashboard.js      # ⏱️ Pantalla 2: Timer + tareas
│   │       ├── RewardScreen.js   # 🎉 Pantalla 3: Recompensas con confetti
│   │       └── ParentPanel.js    # 👨‍👩‍👧 Panel parental
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                    # Node.js + Express
│   ├── index.js               # Servidor principal
│   ├── db/
│   │   ├── pool.js            # Conexión PostgreSQL
│   │   └── schema.sql         # Esquema de la base de datos
│   ├── routes/
│   │   ├── profiles.js        # CRUD perfiles de niños
│   │   ├── tasks.js           # CRUD tareas
│   │   ├── sessions.js        # Registro de sesiones Pomodoro
│   │   └── rewards.js         # Historial de recompensas
│   ├── .env.example
│   └── package.json
│
├── package.json               # Scripts raíz (dev, start, install:all)
└── README.md
```

---

## 🛠️ Instalación y Ejecución

### 1. Instalar dependencias

```bash
# Desde la raíz del proyecto
npm run install:all
```

Esto instala dependencias en `/`, `/client` y `/server`.

### 2. Configurar variables de entorno del servidor

```bash
cp server/.env.example server/.env
# Edita server/.env con tus credenciales de PostgreSQL
```

### 3. Crear la base de datos PostgreSQL

```bash
# Conéctate a PostgreSQL y crea la base de datos
psql -U postgres -c "CREATE DATABASE focuskids;"

# Ejecuta el esquema
psql -U postgres -d focuskids -f server/db/schema.sql
```

### 4. Ejecutar en modo desarrollo

```bash
# Ejecuta frontend (puerto 3000) + backend (puerto 5000) simultáneamente
npm run dev
```

### 5. O ejecutar por separado

```bash
# Solo el servidor
npm run server

# Solo el cliente (en otra terminal)
npm run client
```

---

## 🎮 Flujo de Usuario (máx. 3 clics)

```
Pantalla de Inicio        Dashboard              Recompensa
(Seleccionar Perfil)  →   (Timer + Tareas)   →  (Estrellas + Confetti)
     [1 clic]               [1 clic Play]         [Auto o 1 clic]
```

---

## 🎨 Diseño

| Token            | Valor       |
|-----------------|-------------|
| Color Primary    | `#ff6933`   |
| Color Acento     | `#FFD166`   |
| Color Éxito      | `#06D6A0`   |
| Fuente Títulos   | Fredoka One |
| Fuente Cuerpo    | Nunito      |
| Botones min.     | 48px        |
| Contraste        | WCAG AA     |

---

## 🗄️ Esquema de Base de Datos

```
parents ──┬── profiles ──┬── tasks
          |              ├── sessions ── rewards
          |              └── rewards
          └── (parent_id FK)
```

### Tablas principales
- **`profiles`** — Perfiles de niños con nivel, estrellas y racha
- **`tasks`** — Tareas activas (máx. 3 por perfil en estado `pending`)
- **`sessions`** — Historial de sesiones Pomodoro con duración real
- **`rewards`** — Registro de estrellas y logros ganados
- **`badge_catalog`** — Catálogo de insignias con sus requisitos

---

## 🌐 API Endpoints

| Método | Ruta                         | Descripción                        |
|--------|------------------------------|------------------------------------|
| GET    | `/api/health`                | Estado del servidor                |
| GET    | `/api/profiles`              | Listar perfiles                    |
| POST   | `/api/profiles`              | Crear perfil                       |
| PATCH  | `/api/profiles/:id/stars`    | Agregar estrellas                  |
| GET    | `/api/tasks?profile_id=X`    | Tareas del perfil (máx. 3)         |
| POST   | `/api/tasks`                 | Crear tarea                        |
| PATCH  | `/api/tasks/:id/complete`    | Marcar tarea como completada       |
| POST   | `/api/sessions`              | Registrar sesión y otorgar estrellas |
| GET    | `/api/sessions?profile_id=X` | Historial de sesiones              |
| GET    | `/api/rewards?profile_id=X`  | Historial de recompensas           |
| GET    | `/api/rewards/badges`        | Catálogo de insignias              |

---

## 🔑 Panel de Padres

- Acceso desde ⚙️ en la pantalla de inicio
- PIN de demostración: **`1234`**
- Funciones: ver reportes, asignar tareas, configurar tiempos

---

## 📦 Stack Tecnológico

- **Frontend:** React 18 + Tailwind CSS + React Router v6
- **Backend:** Node.js + Express
- **BD:** PostgreSQL con `pg` (node-postgres)
- **Estado Global:** Context API + useReducer
- **Animaciones:** CSS puro (keyframes) + canvas API (confetti)
