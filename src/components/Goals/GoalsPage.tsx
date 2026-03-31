import React, { useState, useEffect } from 'react';
import { listGoals, createGoal, updateGoal, deleteGoal } from '../../services/api';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { format } from 'date-fns';

interface Goal { id: number; title: string; description?: string; target_date?: string; progress: number; is_done: boolean; }

const RING_R = 20;
const RING_CIRC = 2 * Math.PI * RING_R;

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');
  const [loading, setLoading] = useState(false);

  const fetch = () => listGoals().then(r => setGoals(r.data)).catch(() => {
    setGoals([
      { id: 1, title: 'Finish DSA Sheet', progress: 45, is_done: false, target_date: '2026-06-01', description: 'Striver A2Z' },
      { id: 2, title: 'Complete ML Course', progress: 20, is_done: false },
      { id: 3, title: 'Build Portfolio Project', progress: 100, is_done: true },
    ]);
  });

  useEffect(() => { fetch(); }, []);

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);
    try {
      await createGoal({ title: newTitle, description: newDesc, target_date: newDate || undefined });
      setNewTitle(''); setNewDesc(''); setNewDate('');
      setShowForm(false);
      fetch();
    } catch {} finally { setLoading(false); }
  };

  const updateProgress = async (goal: Goal, progress: number) => {
    await updateGoal(goal.id, { progress, is_done: progress === 100 }).catch(() => {});
    setGoals(gs => gs.map(g => g.id === goal.id ? { ...g, progress, is_done: progress === 100 } : g));
  };

  const remove = async (id: number) => {
    await deleteGoal(id).catch(() => {});
    setGoals(gs => gs.filter(g => g.id !== id));
  };

  return (
    <div className="page-body page-with-music">
      <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <h2 className="topbar-title">🎯 Goals</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Add Goal
        </button>
      </div>

      {showForm && (
        <form className="glass-card widget fade-in" style={{ marginBottom: 20 }} onSubmit={addGoal}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>New Goal</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input className="input" placeholder="Goal title *" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
            <input className="input" placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            <input className="input" type="date" placeholder="Target date" value={newDate} onChange={e => setNewDate(e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                {loading ? 'Saving...' : 'Add Goal'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {goals.length === 0 && (
          <div className="glass-card widget" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
            No goals yet. Add your first goal above! 🎯
          </div>
        )}
        {goals.map((g) => {
          const strokeOffset = RING_CIRC * (1 - g.progress / 100);
          const days = g.target_date ? Math.ceil((new Date(g.target_date).getTime() - Date.now()) / 86400000) : null;
          return (
            <div key={g.id} className="glass-card goal-card" style={{ opacity: g.is_done ? 0.65 : 1 }}>
              {/* Circular progress ring */}
              <div className="goal-progress-ring">
                <svg width="48" height="48" className="goal-progress-svg" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r={RING_R} className="goal-track" />
                  <circle cx="24" cy="24" r={RING_R} className="goal-fill"
                    style={{ stroke: g.is_done ? 'var(--success)' : 'var(--accent)' }}
                    strokeDasharray={RING_CIRC}
                    strokeDashoffset={strokeOffset}
                  />
                </svg>
                <div className="goal-pct" style={{ color: g.is_done ? 'var(--success)' : 'var(--accent)' }}>
                  {g.is_done ? '✓' : `${g.progress}%`}
                </div>
              </div>

              {/* Info */}
              <div className="goal-info">
                <div className="goal-title" style={{ textDecoration: g.is_done ? 'line-through' : 'none' }}>
                  {g.title}
                </div>
                {g.description && <div className="goal-deadline" style={{ marginTop: 2 }}>{g.description}</div>}
                {days !== null && (
                  <div className="goal-deadline">
                    {days > 0 ? `${days} days left` : days === 0 ? '🔥 Due today!' : `${Math.abs(days)} days overdue`}
                    {days < 0 && ' ⚠️'}
                  </div>
                )}
              </div>

              {/* Progress slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                <input
                  type="range" min="0" max="100" value={g.progress}
                  onChange={e => updateProgress(g, parseInt(e.target.value))}
                  style={{ width: 100 }}
                />
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => remove(g.id)} style={{ color: 'var(--danger)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
