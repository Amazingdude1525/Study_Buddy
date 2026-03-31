import type { StudySession, StudyTask } from '../types';

const KEYS = {
  SESSIONS: 'studybuddy_sessions',
  TASKS: 'studybuddy_tasks',
  STREAK: 'studybuddy_streak',
  SUBJECT: 'studybuddy_current_subject'
};

export const storage = {
  getSessions: (): StudySession[] => {
    const d = localStorage.getItem(KEYS.SESSIONS);
    return d ? JSON.parse(d) : [];
  },
  saveSession: (s: StudySession) => {
    const arr = storage.getSessions();
    const i = arr.findIndex(x => x.id === s.id);
    if (i >= 0) arr[i] = s; else arr.push(s);
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(arr));
  },
  getTasks: (): StudyTask[] => {
    const d = localStorage.getItem(KEYS.TASKS);
    return d ? JSON.parse(d) : [];
  },
  saveTasks: (t: StudyTask[]) => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(t));
  },
  getCurrentSubject: () => localStorage.getItem(KEYS.SUBJECT) || 'Mathematics',
  setCurrentSubject: (s: string) => localStorage.setItem(KEYS.SUBJECT, s),
  getStreak: () => parseInt(localStorage.getItem(KEYS.STREAK) || '0'),
  updateStreak: () => {
    const today = new Date().toDateString();
    const last = localStorage.getItem('studybuddy_last_study');
    const streak = storage.getStreak();
    if (last === today) return streak;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const n = last === yesterday ? streak + 1 : 1;
    localStorage.setItem(KEYS.STREAK, String(n));
    localStorage.setItem('studybuddy_last_study', today);
    return n;
  },
};
