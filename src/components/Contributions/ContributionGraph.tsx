import React, { useEffect, useState } from 'react';
import { getContributions } from '../../services/api';
import { format, parseISO, subDays } from 'date-fns';

interface ContribDay { date: string; minutes: number; sessions: number; }
interface ContribData { data: ContribDay[]; total_days_studied: number; total_minutes: number; current_streak: number; }

function getLevel(minutes: number) {
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
    getContributions(52)
      .then(r => setContrib(r.data))
      .catch(() => {
        // Mock data if backend not running
        const mockData: ContribDay[] = [];
        for (let i = 365; i >= 0; i--) {
          const d = subDays(new Date(), i);
          const min = Math.random() > 0.6 ? Math.floor(Math.random() * 180) : 0;
          mockData.push({ date: format(d, 'yyyy-MM-dd'), minutes: min, sessions: Math.floor(min / 30) });
        }
        setContrib({ data: mockData, total_days_studied: mockData.filter(d => d.minutes > 0).length, total_minutes: mockData.reduce((a,b) => a+b.minutes, 0), current_streak: 3 });
      });
  }, []);

  if (!contrib) return <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading...</div>;

  // Group into weeks (columns of 7)
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

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: 22, fontWeight: 800 }}>{contrib.total_days_studied}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>days studied</span>
        </div>
        <div>
          <span style={{ fontSize: 22, fontWeight: 800 }}>{totalHours}h {totalMin}m</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>total</span>
        </div>
        <div>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{contrib.current_streak}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>day streak 🔥</span>
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
                  className={`contrib-cell contrib-${getLevel(day.minutes)}`}
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
