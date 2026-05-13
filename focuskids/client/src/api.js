import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Profiles ─────────────────────────────────────────────
export const profilesAPI = {
  list:       ()              => api.get('/profiles').then(r => r.data),
  get:        (id)            => api.get(`/profiles/${id}`).then(r => r.data),
  create:     (data)          => api.post('/profiles', data).then(r => r.data),
  addStars:   (id, stars)     => api.patch(`/profiles/${id}/stars`, { stars }).then(r => r.data),
  delete:     (id)            => api.delete(`/profiles/${id}`).then(r => r.data),
};

// ── Tasks ─────────────────────────────────────────────────
export const tasksAPI = {
  list:       (profileId)     => api.get(`/tasks?profile_id=${profileId}`).then(r => r.data),
  create:     (data)          => api.post('/tasks', data).then(r => r.data),
  complete:   (id)            => api.patch(`/tasks/${id}/complete`).then(r => r.data),
  delete:     (id)            => api.delete(`/tasks/${id}`).then(r => r.data),
};

// ── Sessions ─────────────────────────────────────────────
export const sessionsAPI = {
  create:     (data)          => api.post('/sessions', data).then(r => r.data),
  list:       (profileId, limit = 10) =>
    api.get(`/sessions?profile_id=${profileId}&limit=${limit}`).then(r => r.data),
};

// ── Rewards ──────────────────────────────────────────────
export const rewardsAPI = {
  list:       (profileId)     => api.get(`/rewards?profile_id=${profileId}`).then(r => r.data),
  badges:     ()              => api.get('/rewards/badges').then(r => r.data),
};

export default api;
