import React, { useState, useEffect, useRef } from 'react';
import { startPomodoro, completePomodoro, pomodoroStats } from '../../services/api';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';

const PHASES = [
  { label: 'FOCUS', duration: 25 * 60, color: 'var(--accent)' },
  { label: 'BREAK', duration: 5 * 60, color: 'var(--success)' },
  { label: 'LONG BREAK', duration: 15 * 60, color: 'var(--accent-2)' },
];

const RADIUS = 80;
const CIRC = 2 * Math.PI * RADIUS;

interface Stats { total_sessions: number; completed_sessions: number; total_hours: number; }

export default function PomodoroPage() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [remaining, setRemaining] = useState(PHASES[0].duration);
  const [running, setRunning] = useState(false);
  const [subject, setSubject] = useState('');
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phase = PHASES[phaseIdx];
  const progress = (phase.duration - remaining) / phase.duration;
  const strokeOffset = CIRC * (1 - progress);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  useEffect(() => {
    pomodoroStats().then(r => setStats(r.data)).catch(() => {});
  }, [sessionCount]);

  const reset = () => {
    setRunning(false);
    setRemaining(phase.duration);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const tick = () => {
    setRemaining(r => {
      if (r <= 1) {
        handlePhaseEnd();
        return 0;
      }
      return r - 1;
    });
  };

  const handlePhaseEnd = async () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseIdx === 0 && sessionId) {
      await completePomodoro(sessionId, true).catch(() => {});
      setSessionCount(c => c + 1);
      setSessionId(null);
    }
    // Move to next phase
    const next = phaseIdx === 0 ? (sessionCount % 4 === 3 ? 2 : 1) : 0;
    setPhaseIdx(next);
    setRemaining(PHASES[next].duration);
  };

  const toggleRun = async () => {
    if (running) {
      setRunning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      if (phaseIdx === 0 && !sessionId) {
        try {
          const res = await startPomodoro({ subject: subject || 'General', duration_min: 25 });
          setSessionId(res.data.id);
        } catch {}
      }
      setRunning(true);
      intervalRef.current = setInterval(tick, 1000);
    }
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    if (!running && intervalRef.current) clearInterval(intervalRef.current);
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, 1000);
    }
  }, [running]);

  return (
    <div className="page-body page-with-music">
      <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <h2 className="topbar-title">⏱️ Pomodoro Timer</h2>
        {stats && (
          <div style={{ display: 'flex', gap: 12 }}>
            <span className="badge badge-accent">✅ {stats.completed_sessions} sessions</span>
            <span className="badge badge-success">⏰ {stats.total_hours}h total</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, marginTop: 32 }}>
        {/* Phase tabs */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--surface)', padding: '4px', borderRadius: 'var(--r-full)', border: '1px solid var(--border)' }}>
          {PHASES.map((p, i) => (
            <button
              key={i}
              className={`btn btn-sm ${phaseIdx === i ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 'var(--r-full)' }}
              onClick={() => { setPhaseIdx(i); setRemaining(PHASES[i].duration); setRunning(false); }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* SVG Ring */}
        <div className="pomodoro-ring-wrap glass-card" style={{ padding: 32, borderRadius: '50%' }}>
          <svg width="200" height="200" className="pomodoro-svg" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={RADIUS} className="pomodoro-track" />
            <circle
              cx="100" cy="100" r={RADIUS}
              className="pomodoro-progress"
              strokeDasharray={CIRC}
              strokeDashoffset={strokeOffset}
              style={{ stroke: phase.color }}
            />
          </svg>
          <div className="pomodoro-label">
            <div className="pomodoro-time" style={{ color: phase.color }}>{mm}:{ss}</div>
            <div className="pomodoro-phase">{phase.label}</div>
          </div>
        </div>

        {/* Subject input */}
        <input
          className="input"
          style={{ maxWidth: 300, textAlign: 'center' }}
          placeholder="What are you studying? (e.g. DSA)"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary btn-icon" onClick={reset} title="Reset">
            <RotateCcw size={18} />
          </button>
          <button className="btn btn-primary" style={{ minWidth: 120, justifyContent: 'center' }} onClick={toggleRun}>
            {running ? <><Pause size={18} />  Pause</> : <><Play size={18} />  Start</>}
          </button>
          {sessionId && (
            <button className="btn btn-secondary btn-icon" title="Mark complete early"
              onClick={() => completePomodoro(sessionId, true).then(() => { setSessionId(null); setSessionCount(c => c + 1); })}>
              <CheckCircle size={18} style={{ color: 'var(--success)' }} />
            </button>
          )}
        </div>

        {/* Session dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              width: 12, height: 12, borderRadius: '50%',
              background: i < (sessionCount % 4) ? 'var(--accent)' : 'var(--border)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          {sessionCount} sessions completed today · After 4 sessions, take a long break!
        </p>
      </div>
    </div>
  );
}
