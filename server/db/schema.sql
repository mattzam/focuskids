-- ============================================================
-- FocusKids Database Schema
-- PostgreSQL
-- ============================================================

-- Parents / guardians
CREATE TABLE IF NOT EXISTS parents (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,           -- bcrypt hashed
  pin         VARCHAR(60) NOT NULL DEFAULT '$2b$10$placeholder',  -- hashed 4-digit PIN
  name        VARCHAR(100),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Child profiles linked to a parent
CREATE TABLE IF NOT EXISTS profiles (
  id            SERIAL PRIMARY KEY,
  parent_id     INTEGER REFERENCES parents(id) ON DELETE CASCADE,
  name          VARCHAR(50) NOT NULL,
  avatar_emoji  VARCHAR(10) NOT NULL DEFAULT '🦄',
  avatar_bg     VARCHAR(50) NOT NULL DEFAULT 'bg-orange-100',
  level         INTEGER NOT NULL DEFAULT 1,
  stars         INTEGER NOT NULL DEFAULT 0,
  streak        INTEGER NOT NULL DEFAULT 0,
  sessions_completed INTEGER NOT NULL DEFAULT 0,
  last_active   DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks assigned to a child profile
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  profile_id  INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       VARCHAR(100) NOT NULL,
  emoji       VARCHAR(10) NOT NULL DEFAULT '📚',
  duration    INTEGER NOT NULL DEFAULT 25,      -- minutes
  status      VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending | done | skipped
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Pomodoro sessions (each completed focus interval)
CREATE TABLE IF NOT EXISTS sessions (
  id              SERIAL PRIMARY KEY,
  profile_id      INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id         INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
  duration_planned INTEGER NOT NULL,            -- minutes planned
  duration_actual  INTEGER,                     -- minutes actually focused
  stars_earned    INTEGER NOT NULL DEFAULT 0,
  completed       BOOLEAN NOT NULL DEFAULT FALSE,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at        TIMESTAMPTZ
);

-- Reward / achievement history
CREATE TABLE IF NOT EXISTS rewards (
  id          SERIAL PRIMARY KEY,
  profile_id  INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id  INTEGER REFERENCES sessions(id) ON DELETE SET NULL,
  type        VARCHAR(50) NOT NULL,             -- 'stars' | 'badge' | 'level_up'
  value       INTEGER NOT NULL DEFAULT 0,       -- stars amount or level reached
  badge_emoji VARCHAR(10),                      -- e.g. '🏆'
  badge_name  VARCHAR(100),
  earned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Badge definitions (static catalog)
CREATE TABLE IF NOT EXISTS badge_catalog (
  id          SERIAL PRIMARY KEY,
  emoji       VARCHAR(10) NOT NULL,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  requirement_type  VARCHAR(50),               -- 'sessions' | 'tasks' | 'streak' | 'stars'
  requirement_value INTEGER
);

-- ============================================================
-- Indexes for common queries
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_tasks_profile    ON tasks(profile_id, status);
CREATE INDEX IF NOT EXISTS idx_sessions_profile ON sessions(profile_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_rewards_profile  ON rewards(profile_id, earned_at DESC);

-- ============================================================
-- Seed badge catalog
-- ============================================================
INSERT INTO badge_catalog (emoji, name, description, requirement_type, requirement_value)
VALUES
  ('⭐', 'Primera Estrella',   'Completa tu primera sesión',       'sessions', 1),
  ('🔥', 'En Racha',           '3 días seguidos de estudio',       'streak',   3),
  ('🏆', 'Campeón del Foco',   'Completa 10 sesiones',             'sessions', 10),
  ('🚀', 'Despegue',           'Alcanza el Nivel 5',               'level',    5),
  ('💎', 'Diamante',           'Acumula 500 estrellas',            'stars',    500),
  ('🎯', 'Puntería Perfecta',  'Completa 5 tareas sin pausas',     'tasks',    5),
  ('⚡', 'Súper Velocidad',    'Completa una tarea en tiempo récord','tasks',   1),
  ('🌟', 'Superestrella',      'Completa 25 sesiones',             'sessions', 25)
ON CONFLICT DO NOTHING;
