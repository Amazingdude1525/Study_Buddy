export type Emotion = 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised' | 'neutral';
export interface EmotionData { emotion: Emotion; score: number; timestamp: Date; }
export interface ChatMessage { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date; }
export interface StudyTask { id: string; subject: string; topic: string; date: string; duration: number; completed: boolean; priority: 'high' | 'medium' | 'low'; }
export interface StudySession { id: string; date: string; subject: string; duration: number; pomodorosCompleted: number; focusScore: number; emotionHistory: EmotionData[]; }
export type Subject = 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'History' | 'Computer Science' | 'Literature' | 'Economics' | 'Other';
export type TimerMode = 'pomodoro' | 'deepwork' | 'powerhour' | 'custom';
export type TimerPhase = 'focus' | 'break' | 'idle';
export interface Playlist { id: string; name: string; emoji: string; description: string; youtubeId: string; mood: 'focus' | 'chill' | 'energize' | 'deep'; subjects: Subject[]; }
