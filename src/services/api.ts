import axios from 'axios';

export const API_BASE = 'http://127.0.0.1:8000';

const api = axios.create({ baseURL: API_BASE });

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vityarthi_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vityarthi_token');
      localStorage.removeItem('vityarthi_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authGoogle = (code: string) =>
  api.post('/auth/google', { code });
export const emailLogin = (data: Record<string, string>) =>
  api.post('/auth/login', data);
export const emailRegister = (data: Record<string, string>) =>
  api.post('/auth/register', data);

// ── User ──────────────────────────────────────────────────────────────────────
export const getMe = () => api.get('/users/me');
export const updateProfile = (data: Record<string, unknown>) =>
  api.patch('/users/profile', data);

// ── Sentiment ─────────────────────────────────────────────────────────────────
export const analyzeSentiment = (image_base64: string) =>
  api.post('/sentiment/analyze', { image_base64 });

// ── Music ─────────────────────────────────────────────────────────────────────
export const suggestMusic = (mood: string, subject = '') =>
  api.get('/music/suggest', { params: { mood, subject } });

// ── Pomodoro ──────────────────────────────────────────────────────────────────
export const startPomodoro = (data: { subject: string; duration_min: number; mood_at_start?: string }) =>
  api.post('/pomodoro/start', data);
export const completePomodoro = (session_id: number, completed = true) =>
  api.post('/pomodoro/complete', { session_id, completed });
export const listPomodoros = () => api.get('/pomodoro/sessions');
export const pomodoroStats = () => api.get('/pomodoro/stats');

// ── Goals ─────────────────────────────────────────────────────────────────────
export const listGoals = () => api.get('/goals/');
export const createGoal = (data: { title: string; description?: string; target_date?: string }) =>
  api.post('/goals/', data);
export const updateGoal = (id: number, data: Record<string, unknown>) =>
  api.patch(`/goals/${id}`, data);
export const deleteGoal = (id: number) => api.delete(`/goals/${id}`);

// ── Admin ─────────────────────────────────────────────────────────────────────
export const getAdminLogs = () => api.get('/admin/logs');
export const getAdminSnapshots = () => api.get('/admin/snapshots');
export const getAdminUsers = () => api.get('/admin/users');

// ── Contributions ─────────────────────────────────────────────────────────────
export const getContributions = (weeks = 52) =>
  api.get('/contributions/', { params: { weeks } });

// ── Resources ─────────────────────────────────────────────────────────────────
export const getSubjectGuide = (subject: string) =>
  api.get('/resources/guide', { params: { subject } });

// ── Sandbox ───────────────────────────────────────────────────────────────────
export const runCode = (code: string, language: string = 'python') =>
  api.post('/sandbox/run', { code, language });

// ── Advisor (SSE streaming) ───────────────────────────────────────────────────
export function streamAdvisorChat(
  message: string,
  mood: string,
  subject: string,
  onChunk: (text: string) => void,
  onDone: () => void
) {
  const token = localStorage.getItem('vityarthi_token');
  fetch(`${API_BASE}/advisor/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, mood, subject }),
  }).then(async (res) => {
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) return;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') { onDone(); return; }
          try { onChunk(JSON.parse(data).text || ''); } catch {}
        }
      }
    }
    onDone();
  }).catch(() => onDone());
}

export function streamDailyPlan(
  mood: string,
  available_hours: number,
  onChunk: (text: string) => void,
  onDone: () => void
) {
  const token = localStorage.getItem('vityarthi_token');
  fetch(`${API_BASE}/advisor/daily-plan?mood=${mood}&available_hours=${available_hours}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(async (res) => {
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) return;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') { onDone(); return; }
          try { onChunk(JSON.parse(data).text || ''); } catch {}
        }
      }
    }
    onDone();
  }).catch(() => onDone());
}
