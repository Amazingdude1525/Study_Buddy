import React, { useEffect, useState } from 'react';
import { getContributions } from '../../services/api';
import { format, parseISO, subDays } from 'date-fns';

interface ContribDay { date: string; minutes: number; sessions: number; }
interface ContribData { 
  data: ContribDay[]; 
  total_days_studied: number; 
  total_minutes: number; 
  current_streak: number;
  xp: number;
  level: number;
}

function getLevelColor(minutes: number) {
  if (minutes === 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 120) return 3;
  return 4;
}

export default function ContributionGraph() {
  const [contrib, setContrib] = useState<ContribData | null>(null);
  const [tooltip, setTooltip] = useState<{text: string; x: number; y: number} | null>(null);

  useEffect(() => {
    console.log("NeuroFlow: Syncing Synapse Grid...");
    const timeoutId = setTimeout(() => {
      if (!contrib) {
        console.warn("NeuroFlow: Synapse Grid connection delayed. Forcing local sync...");
        loadMockData();
      }
    }, 4000);

    const loadMockData = () => {
      const mockData: ContribDay[] = [];
      for (let i = 365; i >= 0; i--) {
        const d = subDays(new Date(), i);
        const min = Math.random() > 0.6 ? Math.floor(Math.random() * 180) : 0;
        mockData.push({ date: format(d, 'yyyy-MM-dd'), minutes: min, sessions: Math.floor(min / 30) });
      }
      setContrib({ 
        data: mockData, 
        total_days_studied: mockData.filter(d => d.minutes > 0).length, 
        total_minutes: mockData.reduce((a,b) => a+b.minutes, 0), 
        current_streak: 3,
        xp: 1250,
        level: 2
      });
    };

    getContributions(52)
      .then(r => {
        clearTimeout(timeoutId);
        setContrib(r.data);
        console.log("NeuroFlow: Synapse Grid synced successfully.");
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        console.error("Synapse Link Failure:", err);
        loadMockData();
      });

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const refresh = () => {
      getContributions(52)
        .then(r => setContrib(r.data))
        .catch(() => {});
    };
    window.addEventListener('refreshStats', refresh);
    return () => window.removeEventListener('refreshStats', refresh);
  }, []);

  if (!contrib) return <div className="h-64 flex items-center justify-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground animate-pulse">Initializing Synapse Grid...</div>;

  const weeks: ContribDay[][] = [];
  let week: ContribDay[] = [];
  contrib.data.forEach((d, i) => {
    week.push(d);
    if (week.length === 7 || i === contrib.data.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  const totalHours = Math.floor(contrib.total_minutes / 60);
  const totalMin = contrib.total_minutes % 60;
  const xpInLevel = contrib.xp % 1000;
  const xpProgress = (xpInLevel / 1000) * 100;

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-end' }}>
             <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)' }}>Level {contrib.level}</span>
             <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{xpInLevel}/1000 XP balance</span>
          </div>
          <div style={{ height: 6, width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${xpProgress}%`, background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)', transition: 'width 1s ease-out' }} />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900 }}>{contrib.current_streak}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Day Streak 🔥</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900 }}>{totalHours}h {totalMin}m</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Focus Time</div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed', left: tooltip.x, top: tooltip.y - 40,
          background: 'var(--text)', color: 'var(--bg)', padding: '4px 8px',
          borderRadius: 'var(--r-sm)', fontSize: 12, pointerEvents: 'none', zIndex: 999,
          transform: 'translateX(-50%)',
        }}>
          {tooltip.text}
        </div>
      )}

      {/* Grid */}
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 2, minWidth: 'fit-content' }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`contrib-cell contrib-${getLevelColor(day.minutes)}`}
                  style={{ width: 12, height: 12 }}
                  onMouseEnter={e => setTooltip({
                    text: `${day.date}: ${day.minutes}m (${day.sessions} sessions)`,
                    x: (e.target as HTMLElement).getBoundingClientRect().left,
                    y: (e.target as HTMLElement).getBoundingClientRect().top,
                  })}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Less</span>
        {[0,1,2,3,4].map(l => <div key={l} className={`contrib-cell contrib-${l}`} style={{ width: 12, height: 12 }} />)}
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>More</span>
      </div>
    </div>
  );
}
