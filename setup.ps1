# ============================================================
#  StudyBuddy AI — Complete Project Setup Script
#  Run from D:\AI_VITYARTHI:
#  powershell -ExecutionPolicy Bypass -File setup.ps1
# ============================================================

Write-Host ""
Write-Host "  ███████╗████████╗██╗   ██╗██████╗ ██╗   ██╗" -ForegroundColor Cyan
Write-Host "  ██╔════╝╚══██╔══╝██║   ██║██╔══██╗╚██╗ ██╔╝" -ForegroundColor Cyan
Write-Host "  ███████╗   ██║   ██║   ██║██║  ██║ ╚████╔╝ " -ForegroundColor Cyan
Write-Host "  ╚════██║   ██║   ██║   ██║██║  ██║  ╚██╔╝  " -ForegroundColor Cyan
Write-Host "  ███████║   ██║   ╚██████╔╝██████╔╝   ██║   " -ForegroundColor Cyan
Write-Host "  ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝    ╚═╝   " -ForegroundColor Cyan
Write-Host "           B U D D Y   A I   S E T U P        " -ForegroundColor Magenta
Write-Host ""

# ─── Create all folders ───────────────────────────────────
$folders = @(
  "src\components\Layout",
  "src\components\PomodoroTimer",
  "src\components\EmotionDetector",
  "src\components\MusicPlayer",
  "src\components\Chatbot",
  "src\components\StudyPlanner",
  "src\components\Dashboard",
  "src\services",
  "src\types",
  "public\models"
)
foreach ($f in $folders) {
  if (!(Test-Path $f)) { New-Item -ItemType Directory -Path $f -Force | Out-Null }
}
Write-Host "  [OK] Folders created" -ForegroundColor Green

# ─── index.html ───────────────────────────────────────────
@"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>StudyBuddy AI</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
"@ | Set-Content index.html
Write-Host "  [OK] index.html" -ForegroundColor Green

# ─── vite.config.ts ───────────────────────────────────────
@"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
})
"@ | Set-Content vite.config.ts
Write-Host "  [OK] vite.config.ts" -ForegroundColor Green

# ─── tailwind.config.js ───────────────────────────────────
@"
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        ink: { 950: '#080b12', 900: '#0d1117', 800: '#161b22', 700: '#21262d', 600: '#30363d', 500: '#6e7681' },
        neon: { purple: '#bf5af2', blue: '#0a84ff', green: '#30d158', red: '#ff453a', amber: '#ffd60a', teal: '#64d2ff' },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        glow:  { '0%': { boxShadow: '0 0 5px rgba(191,90,242,0.3)' }, '100%': { boxShadow: '0 0 20px rgba(191,90,242,0.8), 0 0 40px rgba(191,90,242,0.3)' } },
      },
    },
  },
  plugins: [],
}
"@ | Set-Content tailwind.config.js
Write-Host "  [OK] tailwind.config.js" -ForegroundColor Green

# ─── postcss.config.js ────────────────────────────────────
@"
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} }
}
"@ | Set-Content postcss.config.js
Write-Host "  [OK] postcss.config.js" -ForegroundColor Green

# ─── src/main.tsx ─────────────────────────────────────────
@"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
)
"@ | Set-Content src\main.tsx
Write-Host "  [OK] src/main.tsx" -ForegroundColor Green

# ─── src/index.css ────────────────────────────────────────
@"
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --ink-950: #080b12;
  --ink-900: #0d1117;
  --ink-800: #161b22;
  --ink-700: #21262d;
  --ink-600: #30363d;
  --neon-purple: #bf5af2;
  --neon-blue: #0a84ff;
  --neon-green: #30d158;
  --neon-red: #ff453a;
  --neon-amber: #ffd60a;
  --neon-teal: #64d2ff;
}

* {
  scrollbar-width: thin;
  scrollbar-color: var(--ink-700) transparent;
  font-family: 'DM Sans', sans-serif;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--ink-700); border-radius: 2px; }

h1, h2, h3, .font-display { font-family: 'Syne', sans-serif; }

.glass {
  background: rgba(22, 27, 34, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(48, 54, 61, 0.6);
}

.neon-border-purple { box-shadow: 0 0 0 1px rgba(191,90,242,0.4), inset 0 0 20px rgba(191,90,242,0.03); }
.neon-border-blue   { box-shadow: 0 0 0 1px rgba(10,132,255,0.4), inset 0 0 20px rgba(10,132,255,0.03); }
.neon-border-green  { box-shadow: 0 0 0 1px rgba(48,209,88,0.4),  inset 0 0 20px rgba(48,209,88,0.03); }

@keyframes scanline {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
.scanline::after {
  content: '';
  position: fixed; top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(transparent, rgba(191,90,242,0.08), transparent);
  animation: scanline 8s linear infinite;
  pointer-events: none;
  z-index: 9999;
}
"@ | Set-Content src\index.css
Write-Host "  [OK] src/index.css" -ForegroundColor Green

# ─── src/types/index.ts ───────────────────────────────────
@"
export type Emotion = 'happy'|'sad'|'angry'|'fearful'|'disgusted'|'surprised'|'neutral';
export interface EmotionData { emotion: Emotion; score: number; timestamp: Date; }
export interface ChatMessage { id: string; role: 'user'|'assistant'; content: string; timestamp: Date; }
export interface StudyTask { id: string; subject: string; topic: string; date: string; duration: number; completed: boolean; priority: 'high'|'medium'|'low'; }
export interface StudySession { id: string; date: string; subject: string; duration: number; pomodorosCompleted: number; focusScore: number; emotionHistory: EmotionData[]; }
export type Subject = 'Mathematics'|'Physics'|'Chemistry'|'Biology'|'History'|'Computer Science'|'Literature'|'Economics'|'Other';
"@ | Set-Content src\types\index.ts
Write-Host "  [OK] src/types/index.ts" -ForegroundColor Green

# ─── src/services/storage.ts ──────────────────────────────
@"
import { StudySession, StudyTask } from '../types';
const K = { SESSIONS:'sb_sessions', TASKS:'sb_tasks', STREAK:'sb_streak', SUBJECT:'sb_subject', LAST:'sb_last_study' };
export const storage = {
  getSessions: (): StudySession[] => { try { return JSON.parse(localStorage.getItem(K.SESSIONS)||'[]'); } catch { return []; } },
  saveSession: (s: StudySession) => { const a=storage.getSessions(); const i=a.findIndex(x=>x.id===s.id); if(i>=0)a[i]=s; else a.push(s); localStorage.setItem(K.SESSIONS,JSON.stringify(a)); },
  getTasks: (): StudyTask[] => { try { return JSON.parse(localStorage.getItem(K.TASKS)||'[]'); } catch { return []; } },
  saveTasks: (t: StudyTask[]) => localStorage.setItem(K.TASKS,JSON.stringify(t)),
  getCurrentSubject: () => localStorage.getItem(K.SUBJECT)||'Mathematics',
  setCurrentSubject: (s: string) => localStorage.setItem(K.SUBJECT,s),
  getStreak: () => parseInt(localStorage.getItem(K.STREAK)||'0'),
  updateStreak: () => {
    const today=new Date().toDateString(); const last=localStorage.getItem(K.LAST); const streak=storage.getStreak();
    if(last===today) return streak;
    const yesterday=new Date(Date.now()-86400000).toDateString();
    const n=last===yesterday?streak+1:1;
    localStorage.setItem(K.STREAK,String(n)); localStorage.setItem(K.LAST,today); return n;
  },
};
"@ | Set-Content src\services\storage.ts
Write-Host "  [OK] src/services/storage.ts" -ForegroundColor Green

# ─── src/App.tsx ──────────────────────────────────────────
@"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import PomodoroTimer from './components/PomodoroTimer/PomodoroTimer';
import EmotionDetector from './components/EmotionDetector/EmotionDetector';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import Chatbot from './components/Chatbot/Chatbot';
import StudyPlanner from './components/StudyPlanner/StudyPlanner';
import Dashboard from './components/Dashboard/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/timer" replace />} />
          <Route path="timer"     element={<PomodoroTimer />} />
          <Route path="emotion"   element={<EmotionDetector />} />
          <Route path="music"     element={<MusicPlayer />} />
          <Route path="chat"      element={<Chatbot />} />
          <Route path="planner"   element={<StudyPlanner />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
"@ | Set-Content src\App.tsx
Write-Host "  [OK] src/App.tsx" -ForegroundColor Green

# ─── Layout/Sidebar.tsx ───────────────────────────────────
@"
import { NavLink } from 'react-router-dom';
import { Timer, Brain, Music, MessageCircle, Calendar, BarChart2, Zap } from 'lucide-react';

const nav = [
  { path:'/timer',     icon:Timer,         label:'Focus Timer',  tag:'FOCUS'  },
  { path:'/emotion',   icon:Brain,         label:'Emotion AI',   tag:'AI'     },
  { path:'/music',     icon:Music,         label:'Music',        tag:'VIBES'  },
  { path:'/chat',      icon:MessageCircle, label:'AI Tutor',     tag:'CHAT'   },
  { path:'/planner',   icon:Calendar,      label:'Planner',      tag:'PLAN'   },
  { path:'/dashboard', icon:BarChart2,     label:'Dashboard',    tag:'STATS'  },
];

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen flex flex-col relative" style={{background:'var(--ink-900)',borderRight:'1px solid rgba(48,54,61,0.6)'}}>
      {/* Logo */}
      <div className="p-5 pb-4" style={{borderBottom:'1px solid rgba(48,54,61,0.4)'}}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg, var(--neon-purple), var(--neon-blue))'}}>
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm" style={{fontFamily:'Syne,sans-serif',letterSpacing:'0.05em'}}>STUDYBUDDY</p>
            <p style={{color:'var(--neon-purple)',fontSize:'9px',letterSpacing:'0.15em'}}>AI COMPANION</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p style={{color:'var(--ink-500)',fontSize:'9px',letterSpacing:'0.15em',padding:'12px 8px 6px'}}>NAVIGATION</p>
        {nav.map(({ path, icon: Icon, label, tag }) => (
          <NavLink key={path} to={path} className={({ isActive }) =>
            `group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
              isActive
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-200'
            }`}
            style={({ isActive }) => isActive ? {
              background:'rgba(191,90,242,0.12)',
              borderLeft:'2px solid var(--neon-purple)',
              paddingLeft:'10px',
            } : {
              borderLeft:'2px solid transparent',
            }}>
            {({ isActive }) => (<>
              <div className="flex items-center gap-3">
                <Icon size={16} style={{ color: isActive ? 'var(--neon-purple)' : undefined }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: isActive ? 500 : 400 }}>{label}</span>
              </div>
              <span style={{
                fontSize:'8px', letterSpacing:'0.1em', padding:'1px 5px', borderRadius:'3px',
                background: isActive ? 'rgba(191,90,242,0.2)' : 'rgba(48,54,61,0.5)',
                color: isActive ? 'var(--neon-purple)' : 'var(--ink-500)',
              }}>{tag}</span>
            </>)}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4" style={{borderTop:'1px solid rgba(48,54,61,0.4)'}}>
        <div className="rounded-lg p-3" style={{background:'rgba(191,90,242,0.06)',border:'1px solid rgba(191,90,242,0.12)'}}>
          <p style={{color:'var(--neon-purple)',fontSize:'10px',fontWeight:600,letterSpacing:'0.08em'}}>BYOP — VITyarthi</p>
          <p style={{color:'var(--ink-500)',fontSize:'9px',marginTop:'2px'}}>React + Claude AI + Tailwind</p>
        </div>
      </div>
    </aside>
  );
}
"@ | Set-Content src\components\Layout\Sidebar.tsx
Write-Host "  [OK] Layout/Sidebar.tsx" -ForegroundColor Green

# ─── Layout/Layout.tsx ────────────────────────────────────
@"
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
export default function Layout() {
  return (
    <div className="flex min-h-screen scanline" style={{background:'var(--ink-950)'}}>
      <Sidebar />
      <main className="flex-1 overflow-auto"><Outlet /></main>
    </div>
  );
}
"@ | Set-Content src\components\Layout\Layout.tsx
Write-Host "  [OK] Layout/Layout.tsx" -ForegroundColor Green

# ─── PomodoroTimer.tsx ────────────────────────────────────
@"
import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Settings, X } from 'lucide-react';

type Mode = 'pomodoro'|'short'|'long'|'deep';
type Phase = 'focus'|'break'|'idle';
interface Cfg { label:string; emoji:string; focus:number; brk:number; color:string; glow:string; desc:string; }

const MODES: Record<Mode,Cfg> = {
  pomodoro: { label:'Pomodoro',   emoji:'🍅', focus:25*60, brk:5*60,  color:'#ff453a', glow:'rgba(255,69,58,0.3)',  desc:'Classic 25/5 rhythm' },
  short:    { label:'Short Break',emoji:'☕', focus:5*60,  brk:0,     color:'#30d158', glow:'rgba(48,209,88,0.3)',  desc:'5 min recharge'      },
  long:     { label:'Long Break', emoji:'🌿', focus:15*60, brk:0,     color:'#0a84ff', glow:'rgba(10,132,255,0.3)', desc:'15 min deep rest'    },
  deep:     { label:'Deep Work',  emoji:'⚡', focus:90*60, brk:20*60, color:'#bf5af2', glow:'rgba(191,90,242,0.3)', desc:'90/20 flow state'    },
};
const SUBJECTS = ['Mathematics','Physics','Chemistry','Biology','History','Computer Science','Literature','Economics','Other'];
const fmt = (s:number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

const TIPS: Record<string,string[]> = {
  Mathematics:       ['Solve without looking at examples first — struggle = learning.','Write out steps by hand. Typing skips neural encoding.','Done a problem? Redo it from scratch 24h later.'],
  Physics:           ['Draw a free-body diagram before writing any equation.','Check units at every step — they tell you if you\'re wrong.','If confused, try extreme cases: what if mass = 0?'],
  Chemistry:         ['Write equations from memory 5 times. Pattern recognition builds.','Build 3D mental models of molecular geometry.','Connect reactions to real-life: rust, cooking, batteries.'],
  'Computer Science':['Type code by hand — no copy-paste. Muscle memory matters.','Rubber duck debug: explain your code to an imaginary friend.','Read others\' code. It\'s the fastest way to level up.'],
  default:           ['Feynman Technique: explain it to a 10-year-old.','Space your review: today, tomorrow, next week.','Take a 5-min walk between sessions. Movement = memory.'],
};

export default function PomodoroTimer() {
  const [mode, setMode]           = useState<Mode>('pomodoro');
  const [phase, setPhase]         = useState<Phase>('idle');
  const [timeLeft, setTimeLeft]   = useState(MODES.pomodoro.focus);
  const [running, setRunning]     = useState(false);
  const [pomos, setPomos]         = useState(0);
  const [totalMin, setTotalMin]   = useState(0);
  const [subject, setSubject]     = useState('Mathematics');
  const [showCfg, setShowCfg]     = useState(false);
  const [customF, setCustomF]     = useState(25);
  const [customB, setCustomB]     = useState(5);
  const [sessions, setSessions]   = useState<{label:string;phase:string;time:string}[]>([]);
  const [tipIdx, setTipIdx]       = useState(0);
  const ref = useRef<ReturnType<typeof setInterval>|null>(null);
  const cfg = MODES[mode];
  const total = phase==='break' ? cfg.brk : cfg.focus;
  const pct   = total>0 ? ((total-timeLeft)/total)*100 : 0;
  const R=88; const C=2*Math.PI*R; const off=C-(pct/100)*C;

  const ping = useCallback(()=>{
    try {
      const ctx=new AudioContext(); const o=ctx.createOscillator(); const g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      [[880,0],[660,0.1],[880,0.2],[1100,0.3]].forEach(([f,t])=>o.frequency.setValueAtTime(f,ctx.currentTime+t));
      g.gain.setValueAtTime(0.3,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.6);
      o.start(ctx.currentTime); o.stop(ctx.currentTime+0.6);
    } catch {}
  },[]);

  useEffect(()=>{
    if(running){
      ref.current=setInterval(()=>{
        setTimeLeft(p=>{
          if(p<=1){
            clearInterval(ref.current!); ping(); setRunning(false);
            const isB=phase==='break';
            if(!isB&&cfg.brk>0){ setPhase('break'); setTimeLeft(cfg.brk); if(mode==='pomodoro'){setPomos(x=>x+1);setTotalMin(x=>x+25);} }
            else { setPhase('idle'); setTimeLeft(cfg.focus); }
            setSessions(s=>[{label:cfg.label,phase:isB?'break':'focus',time:new Date().toLocaleTimeString()},...s.slice(0,4)]);
            return 0;
          }
          return p-1;
        });
      },1000);
    }
    return ()=>clearInterval(ref.current!);
  },[running,phase,mode]);

  const reset  = ()=>{ setRunning(false); setPhase('idle'); setTimeLeft(cfg.focus); clearInterval(ref.current!); };
  const skip   = ()=>{ setRunning(false); if(phase==='focus'&&cfg.brk>0){setPhase('break');setTimeLeft(cfg.brk);}else{setPhase('idle');setTimeLeft(cfg.focus);} };
  const change = (m:Mode)=>{ setMode(m); setPhase('idle'); setRunning(false); setTimeLeft(MODES[m].focus); clearInterval(ref.current!); };
  const tips   = TIPS[subject]||TIPS.default;

  return (
    <div className="min-h-screen p-6 flex flex-col gap-5" style={{background:'var(--ink-950)',color:'white'}}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{fontFamily:'Syne,sans-serif',letterSpacing:'-0.02em'}}>Focus Timer</h1>
          <p style={{color:'var(--ink-500)',fontSize:'13px'}}>Deep work sessions · Pomodoro technique</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={subject} onChange={e=>{setSubject(e.target.value);setTipIdx(0);}}
            className="text-sm rounded-lg px-3 py-2 outline-none"
            style={{background:'var(--ink-800)',border:'1px solid var(--ink-600)',color:'white'}}>
            {SUBJECTS.map(s=><option key={s}>{s}</option>)}
          </select>
          <button onClick={()=>setShowCfg(true)} className="p-2 rounded-lg transition-colors"
            style={{background:'var(--ink-800)',border:'1px solid var(--ink-600)'}}>
            <Settings size={16} style={{color:'var(--ink-500)'}}/>
          </button>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
        {(Object.entries(MODES) as [Mode,Cfg][]).map(([k,v])=>(
          <button key={k} onClick={()=>change(k)}
            className="flex-1 py-2 text-xs font-medium rounded-lg transition-all"
            style={mode===k ? {background:v.color+'22',color:v.color,border:`1px solid ${v.color}44`} : {color:'var(--ink-500)'}}>
            {v.emoji} {v.label}
          </button>
        ))}
      </div>

      <div className="flex gap-5 flex-wrap lg:flex-nowrap">
        {/* Timer */}
        <div className="flex-1 flex flex-col items-center gap-5">
          <div className="relative" style={{width:220,height:220}}>
            {/* Glow */}
            <div className="absolute inset-0 rounded-full" style={{boxShadow:`0 0 60px ${cfg.glow}`,opacity:running?1:0.3,transition:'opacity 0.5s'}}/>
            <svg width="220" height="220" style={{transform:'rotate(-90deg)'}}>
              <circle cx="110" cy="110" r={R} fill="none" stroke="var(--ink-800)" strokeWidth="8"/>
              <circle cx="110" cy="110" r={R} fill="none" stroke={cfg.color} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={off} style={{transition:'stroke-dashoffset 1s linear',filter:`drop-shadow(0 0 6px ${cfg.color})`}}/>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono font-bold" style={{fontSize:'42px',letterSpacing:'-0.03em',color:running?cfg.color:'white',transition:'color 0.3s'}}>{fmt(timeLeft)}</span>
              <span style={{color:'var(--ink-500)',fontSize:'11px',letterSpacing:'0.1em',marginTop:'2px'}}>
                {phase==='idle'?cfg.desc.toUpperCase():phase==='focus'?'FOCUS MODE':'BREAK TIME'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button onClick={reset} className="p-3 rounded-full transition-all" style={{background:'var(--ink-800)',border:'1px solid var(--ink-600)'}}>
              <RotateCcw size={18} style={{color:'var(--ink-500)'}}/>
            </button>
            <button onClick={()=>{if(phase==='idle')setPhase('focus');setRunning(r=>!r);}}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
              style={{background:cfg.color,boxShadow:`0 0 20px ${cfg.glow}`,transform:running?'scale(0.95)':'scale(1)'}}>
              {running?<Pause size={22}/>:<Play size={22} style={{marginLeft:'2px'}}/>}
            </button>
            <button onClick={skip} className="p-3 rounded-full transition-all" style={{background:'var(--ink-800)',border:'1px solid var(--ink-600)'}}>
              <SkipForward size={18} style={{color:'var(--ink-500)'}}/>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            {[
              {icon:'🍅',v:pomos,   l:"Pomodoros",     c:'var(--neon-red)'   },
              {icon:'⏱️',v:totalMin,l:"Min Focused",    c:'var(--neon-blue)'  },
              {icon:'🔥',v:parseInt(localStorage.getItem('sb_streak')||'0'),l:"Day Streak",c:'var(--neon-amber)'},
            ].map(s=>(
              <div key={s.l} className="rounded-xl p-3 text-center" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
                <div className="text-lg">{s.icon}</div>
                <div className="text-xl font-bold mt-0.5" style={{color:s.c,fontFamily:'Syne,sans-serif'}}>{s.v}</div>
                <div style={{color:'var(--ink-500)',fontSize:'10px',marginTop:'1px'}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Side panels */}
        <div className="w-68 flex flex-col gap-3" style={{width:'270px'}}>
          {/* Tip card */}
          <div className="rounded-xl p-4 flex-1" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
            <div className="flex items-center justify-between mb-3">
              <span style={{color:'var(--neon-purple)',fontSize:'11px',fontWeight:600,letterSpacing:'0.1em'}}>💡 STUDY TIP</span>
              <button onClick={()=>setTipIdx(i=>(i+1)%tips.length)} style={{color:'var(--ink-500)',fontSize:'11px'}}>next →</button>
            </div>
            <p style={{color:'#c9d1d9',fontSize:'13px',lineHeight:'1.6'}}>{tips[tipIdx]}</p>
          </div>

          {/* Sessions */}
          <div className="rounded-xl p-4" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
            <p style={{color:'var(--ink-500)',fontSize:'11px',fontWeight:600,letterSpacing:'0.1em',marginBottom:'10px'}}>RECENT SESSIONS</p>
            {sessions.length===0
              ? <p style={{color:'var(--ink-600)',fontSize:'12px'}}>Start a session to track it</p>
              : sessions.map((s,i)=>(
                  <div key={i} className="flex items-center justify-between py-1.5" style={{borderBottom:'1px solid var(--ink-800)'}}>
                    <span style={{color:'#c9d1d9',fontSize:'12px'}}>{s.label} · {s.phase}</span>
                    <span style={{color:'var(--ink-500)',fontSize:'11px'}}>{s.time}</span>
                  </div>
                ))
            }
          </div>
        </div>
      </div>

      {/* Settings modal */}
      {showCfg&&(
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{background:'rgba(8,11,18,0.85)',backdropFilter:'blur(4px)'}} onClick={()=>setShowCfg(false)}>
          <div className="rounded-2xl p-6 w-80" style={{background:'var(--ink-800)',border:'1px solid var(--ink-600)'}} onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 style={{fontFamily:'Syne,sans-serif',fontSize:'16px',fontWeight:700}}>Custom Timer</h3>
              <button onClick={()=>setShowCfg(false)}><X size={16} style={{color:'var(--ink-500)'}}/></button>
            </div>
            <div className="space-y-4">
              {[['Focus (minutes)',customF,(v:number)=>setCustomF(v)],['Break (minutes)',customB,(v:number)=>setCustomB(v)]].map(([l,v,fn])=>(
                <div key={l as string}>
                  <label style={{color:'var(--ink-500)',fontSize:'12px',display:'block',marginBottom:'6px'}}>{l as string}</label>
                  <input type="number" min={1} max={180} value={v as number} onChange={e=>(fn as Function)(Number(e.target.value))}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{background:'var(--ink-900)',border:'1px solid var(--ink-600)',color:'white'}}/>
                </div>
              ))}
              <button onClick={()=>{MODES.pomodoro.focus=customF*60;MODES.pomodoro.brk=customB*60;change('pomodoro');setShowCfg(false);}}
                className="w-full py-2.5 rounded-lg text-sm font-semibold"
                style={{background:'var(--neon-purple)',color:'white'}}>
                Apply Custom Timer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"@ | Set-Content src\components\PomodoroTimer\PomodoroTimer.tsx
Write-Host "  [OK] PomodoroTimer.tsx" -ForegroundColor Green

# ─── MusicPlayer.tsx (Spotify + YouTube with ad-skip) ─────
@"
import { useState, useRef, useEffect } from 'react';
import { Music, ExternalLink, AlertCircle, Youtube, Headphones, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Info } from 'lucide-react';

type Source = 'spotify'|'youtube';

interface Track {
  id: string; name: string; artist: string; emoji: string;
  mood: string; subject: string[]; duration: string;
  spotifyId: string; youtubeId: string;
}

const TRACKS: Track[] = [
  { id:'1',  name:'Lofi Hip Hop Radio',      artist:'Lofi Girl',            emoji:'🎧', mood:'focus',    subject:['Mathematics','Computer Science','Physics'],   duration:'Live',     spotifyId:'37i9dQZF1DWWQRwui0ExPn', youtubeId:'jfKfPfyJRdk' },
  { id:'2',  name:'Deep Focus',              artist:'Spotify Editorial',    emoji:'🧠', mood:'deep',     subject:['Mathematics','Physics','Chemistry'],          duration:'2h 30m',   spotifyId:'37i9dQZF1DWZeKCadgRdKQ', youtubeId:'F-65SZKmJfI' },
  { id:'3',  name:'Classical Concentration', artist:'Mozart / Bach',        emoji:'🎻', mood:'deep',     subject:['Literature','History','Economics'],           duration:'3h',       spotifyId:'37i9dQZF1DWV0gynK7G6pD', youtubeId:'SRecFCNAMlI' },
  { id:'4',  name:'Nature & Rain Sounds',    artist:'Ambient World',        emoji:'🌿', mood:'chill',    subject:['Biology','Literature','History'],             duration:'8h',       spotifyId:'37i9dQZF1DX4PP3DA4J0N8', youtubeId:'eKFTSSKCzWA' },
  { id:'5',  name:'Synthwave Focus',         artist:'Various Artists',      emoji:'🌆', mood:'energize', subject:['Computer Science','Mathematics','Physics'],   duration:'2h',       spotifyId:'37i9dQZF1DX6J5NfMJS675', youtubeId:'b56fTBmJDCw' },
  { id:'6',  name:'Jazz Cafe Study',         artist:'Jazz Café',            emoji:'☕', mood:'chill',    subject:['Economics','Literature','History'],           duration:'2h',       spotifyId:'37i9dQZF1DXbITWG1ZJKYt', youtubeId:'Dx5qFachd3A' },
  { id:'7',  name:'Epic Cinematic Study',    artist:'Hans Zimmer / Nolan',  emoji:'⚡', mood:'energize', subject:['Chemistry','Biology','Physics'],              duration:'1h 30m',   spotifyId:'37i9dQZF1DX7K31D69s4M1', youtubeId:'RqZeFzBfqW4' },
  { id:'8',  name:'Brown Noise',             artist:'Noise Factory',        emoji:'🌊', mood:'focus',    subject:['Mathematics','Computer Science','Economics'], duration:'10h',      spotifyId:'37i9dQZF1DWUZ5bk6qqDSy', youtubeId:'q76ZbitS12A' },
  { id:'9',  name:'Binaural Beats Alpha',    artist:'Brain.fm',             emoji:'🔵', mood:'deep',     subject:['Mathematics','Physics','Chemistry'],          duration:'3h',       spotifyId:'37i9dQZF1DX0SM0LYsmbMT', youtubeId:'F-65SZKmJfI' },
  { id:'10', name:'Indie Study Vibes',       artist:'Various',              emoji:'🌸', mood:'chill',    subject:['Literature','History','Economics'],           duration:'2h',       spotifyId:'37i9dQZF1DXcCnTAt8CfNe', youtubeId:'Dx5qFachd3A' },
];

const MOOD_CFG: Record<string,{color:string;icon:string}> = {
  focus:    {color:'var(--neon-purple)',icon:'🎯'},
  deep:     {color:'var(--neon-blue)',  icon:'🧠'},
  chill:    {color:'var(--neon-green)', icon:'🌿'},
  energize: {color:'var(--neon-red)',   icon:'⚡'},
};
const SUBJECTS = ['All','Mathematics','Physics','Chemistry','Biology','History','Computer Science','Literature','Economics'];

export default function MusicPlayer() {
  const [source,      setSource]      = useState<Source>('spotify');
  const [current,     setCurrent]     = useState(TRACKS[0]);
  const [playing,     setPlaying]     = useState(false);
  const [mood,        setMood]        = useState('all');
  const [subj,        setSubj]        = useState('All');
  const [muted,       setMuted]       = useState(false);
  const [showAdInfo,  setShowAdInfo]  = useState(false);
  const [adSkipMode,  setAdSkipMode]  = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const filtered = TRACKS.filter(t=>
    (mood==='all'||t.mood===mood)&&(subj==='All'||t.subject.includes(subj))
  );
  const idx = filtered.findIndex(t=>t.id===current.id);

  const play = (t: Track) => {
    if(current.id===t.id){ setPlaying(p=>!p); }
    else { setCurrent(t); setPlaying(true); }
  };
  const next = ()=>{ const n=filtered[(idx+1)%filtered.length]; if(n){setCurrent(n);setPlaying(true);} };
  const prev = ()=>{ const n=filtered[(idx-1+filtered.length)%filtered.length]; if(n){setCurrent(n);setPlaying(true);} };

  const ytSrc = `https://www.youtube-nocookie.com/embed/${current.youtubeId}?autoplay=${playing?1:0}&controls=1&loop=1&playlist=${current.youtubeId}&rel=0&modestbranding=1&iv_load_policy=3&mute=${muted?1:0}`;
  const spSrc = `https://open.spotify.com/embed/playlist/${current.spotifyId}?utm_source=generator&theme=0`;

  return (
    <div className="min-h-screen p-6 flex flex-col gap-5" style={{background:'var(--ink-950)',color:'white'}}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{fontFamily:'Syne,sans-serif',letterSpacing:'-0.02em'}}>Study Music</h1>
          <p style={{color:'var(--ink-500)',fontSize:'13px'}}>Curated audio environments for deep focus</p>
        </div>
        {/* Source toggle */}
        <div className="flex items-center gap-2 p-1 rounded-xl" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
          {(['spotify','youtube'] as Source[]).map(s=>(
            <button key={s} onClick={()=>{setSource(s);setPlaying(false);}}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={source===s?{background:'var(--ink-700)',color:'white'}:{color:'var(--ink-500)'}}>
              {s==='spotify'?<><Headphones size={14}/>Spotify</>:<><Youtube size={14}/>YouTube</>}
            </button>
          ))}
        </div>
      </div>

      {/* YT ad-block notice */}
      {source==='youtube'&&(
        <div className="rounded-xl p-3 flex items-start gap-3" style={{background:'rgba(255,214,10,0.06)',border:'1px solid rgba(255,214,10,0.2)'}}>
          <AlertCircle size={16} style={{color:'var(--neon-amber)',flexShrink:0,marginTop:'1px'}}/>
          <div className="flex-1">
            <p style={{color:'var(--neon-amber)',fontSize:'12px',fontWeight:600}}>YouTube Ad-Blocking — Privacy Mode Active</p>
            <p style={{color:'#c9d1d9',fontSize:'11px',lineHeight:'1.5',marginTop:'3px'}}>
              Using <strong>youtube-nocookie.com</strong> embed domain (minimal tracking, fewer ads).
              For full ad removal, install <a href="https://ublockorigin.com" target="_blank" rel="noopener noreferrer" style={{color:'var(--neon-blue)',textDecoration:'underline'}}>uBlock Origin</a> browser extension — it works with embedded players too.
            </p>
          </div>
          <button onClick={()=>setAdSkipMode(p=>!p)} className="px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0"
            style={adSkipMode?{background:'rgba(255,214,10,0.2)',color:'var(--neon-amber)',border:'1px solid rgba(255,214,10,0.3)'}:{background:'var(--ink-800)',color:'var(--ink-500)',border:'1px solid var(--ink-600)'}}>
            {adSkipMode?'✓ Privacy Mode':'Enable'}
          </button>
        </div>
      )}

      {/* Spotify tip */}
      {source==='spotify'&&(
        <div className="rounded-xl p-3 flex items-start gap-3" style={{background:'rgba(30,215,96,0.06)',border:'1px solid rgba(30,215,96,0.2)'}}>
          <Info size={16} style={{color:'#1ed760',flexShrink:0,marginTop:'1px'}}/>
          <p style={{color:'#c9d1d9',fontSize:'11px',lineHeight:'1.5'}}>
            <span style={{color:'#1ed760',fontWeight:600}}>Spotify Embed</span> — Click any playlist to open the full Spotify player. 
            For ad-free listening, log in with Spotify Free (shuffle play) or use Spotify Premium. The player below streams directly from Spotify.
          </p>
        </div>
      )}

      <div className="flex gap-5 flex-wrap lg:flex-nowrap">
        {/* Track grid */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Filters */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              {['all','focus','deep','chill','energize'].map(m=>(
                <button key={m} onClick={()=>setMood(m)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={mood===m?{
                    background: m==='all' ? 'var(--ink-600)' : MOOD_CFG[m].color+'22',
                    color: m==='all' ? 'white' : MOOD_CFG[m].color,
                    border: `1px solid ${m==='all' ? 'var(--ink-600)' : MOOD_CFG[m].color+'44'}`,
                  }:{
                    color:'var(--ink-500)',border:'1px solid var(--ink-700)'
                  }}>
                  {m==='all'?'✨ All':`${MOOD_CFG[m].icon} ${m.charAt(0).toUpperCase()+m.slice(1)}`}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {SUBJECTS.map(s=>(
                <button key={s} onClick={()=>setSubj(s)} className="px-2.5 py-1 rounded-lg text-xs transition-all"
                  style={subj===s?{background:'var(--ink-700)',color:'white'}:{color:'var(--ink-500)'}}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map(t=>{
              const isActive=current.id===t.id; const isPlaying=isActive&&playing;
              const mc=MOOD_CFG[t.mood];
              return (
                <div key={t.id} onClick={()=>play(t)}
                  className="rounded-xl p-4 cursor-pointer transition-all"
                  style={{
                    background:'var(--ink-900)',
                    border:`1px solid ${isActive?mc.color+'60':'var(--ink-700)'}`,
                    boxShadow: isActive ? `0 0 20px ${mc.color}18` : 'none',
                    transform: isActive ? 'translateY(-1px)' : 'none',
                  }}>
                  <div className="text-3xl mb-2">{t.emoji}</div>
                  <h4 className="font-semibold text-sm" style={{color:'white'}}>{t.name}</h4>
                  <p style={{color:'var(--ink-500)',fontSize:'11px',marginTop:'2px'}}>{t.artist}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span style={{
                      fontSize:'9px',letterSpacing:'0.08em',padding:'2px 6px',borderRadius:'4px',
                      background:mc.color+'18',color:mc.color,
                    }}>{mc.icon} {t.mood.toUpperCase()}</span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{background:isPlaying?mc.color:'var(--ink-700)'}}>
                      {isPlaying ? <Pause size={10} className="text-white"/> : <Play size={10} className="text-white" style={{marginLeft:'1px'}}/>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Now Playing / Player */}
        <div style={{width:'280px'}} className="flex flex-col gap-3">
          {/* Now playing card */}
          <div className="rounded-xl p-5" style={{background:'var(--ink-900)',border:`1px solid ${MOOD_CFG[current.mood].color}33`}}>
            <p style={{color:'var(--ink-500)',fontSize:'9px',letterSpacing:'0.15em',marginBottom:'12px'}}>NOW PLAYING</p>
            <div className="text-5xl text-center mb-4 animate-float">{current.emoji}</div>
            <h3 className="text-white font-bold text-center" style={{fontFamily:'Syne,sans-serif',fontSize:'15px'}}>{current.name}</h3>
            <p style={{color:'var(--ink-500)',fontSize:'11px',textAlign:'center',marginTop:'4px'}}>{current.artist}</p>
            <div className="flex items-center justify-center gap-4 mt-5">
              <button onClick={prev} style={{color:'var(--ink-500)'}}><SkipBack size={18}/></button>
              <button onClick={()=>setPlaying(p=>!p)}
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{background:MOOD_CFG[current.mood].color,boxShadow:`0 0 16px ${MOOD_CFG[current.mood].color}55`}}>
                {playing?<Pause size={18}/>:<Play size={18} style={{marginLeft:'2px'}}/>}
              </button>
              <button onClick={next} style={{color:'var(--ink-500)'}}><SkipForward size={18}/></button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button onClick={()=>setMuted(m=>!m)} style={{color:muted?'var(--neon-red)':'var(--ink-500)'}}>
                {muted?<VolumeX size={16}/>:<Volume2 size={16}/>}
              </button>
              <span style={{color:'var(--ink-600)',fontSize:'10px'}}>{current.duration}</span>
              <a href={source==='spotify'?`https://open.spotify.com/playlist/${current.spotifyId}`:`https://www.youtube.com/watch?v=${current.youtubeId}`}
                target="_blank" rel="noopener noreferrer" style={{color:'var(--ink-500)'}}>
                <ExternalLink size={14}/>
              </a>
            </div>
          </div>

          {/* Embedded player */}
          <div className="rounded-xl overflow-hidden" style={{border:'1px solid var(--ink-700)'}}>
            {source==='spotify' ? (
              <iframe
                src={spSrc}
                width="100%" height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy" style={{borderRadius:'0',border:'none'}}
                title="Spotify Player"
              />
            ) : (
              <div>
                <iframe
                  ref={iframeRef}
                  key={`${current.youtubeId}-${playing}`}
                  src={ytSrc}
                  width="100%" height="140"
                  allow="autoplay; encrypted-media"
                  allowFullScreen style={{border:'none',display:'block'}}
                  title="YouTube Player"
                />
                <div className="px-3 py-2" style={{background:'var(--ink-900)'}}>
                  <p style={{color:'var(--ink-500)',fontSize:'9px',letterSpacing:'0.08em'}}>
                    ✓ Privacy-enhanced mode · No cross-site tracking
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Subject tags */}
          <div className="rounded-xl p-3" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
            <p style={{color:'var(--ink-500)',fontSize:'9px',letterSpacing:'0.12em',marginBottom:'8px'}}>BEST FOR</p>
            <div className="flex flex-wrap gap-1.5">
              {current.subject.map(s=>(
                <span key={s} style={{fontSize:'10px',padding:'2px 8px',borderRadius:'4px',background:'var(--ink-800)',color:'var(--ink-500)',border:'1px solid var(--ink-700)'}}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"@ | Set-Content src\components\MusicPlayer\MusicPlayer.tsx
Write-Host "  [OK] MusicPlayer.tsx (Spotify + YouTube privacy mode)" -ForegroundColor Green

# ─── Chatbot.tsx ──────────────────────────────────────────
@"
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Zap, BookOpen } from 'lucide-react';

interface Msg { id:string; role:'user'|'assistant'; content:string; ts:Date; }

const SUBJECTS = ['Mathematics','Physics','Chemistry','Biology','History','Computer Science','Literature','Economics','Other'];
const QUICK = [
  {icon:'💡',l:'Explain simply',    p:'Explain this concept simply, with an analogy: '},
  {icon:'❓',l:'Give me a hint',    p:'I am stuck — give me a hint without the full answer: '},
  {icon:'📝',l:'Quiz me (3 Qs)',    p:'Give me 3 practice questions on: '},
  {icon:'🧠',l:'Memory trick',      p:'Give me a mnemonic or memory trick for: '},
  {icon:'🔗',l:'Real-world use',    p:'How is this concept used in real life? Topic: '},
  {icon:'⚡',l:'Key formulas',      p:'List the key formulas/rules I must memorize for: '},
  {icon:'🗺️',l:'Topic roadmap',     p:'Give me a learning roadmap for understanding: '},
  {icon:'🐛',l:'Fix my thinking',   p:'Here is my reasoning. Tell me where I went wrong: '},
];
const TOOLS = [
  {name:'NotebookLM',    e:'📓',d:'Upload any PDF and chat with it',    url:'https://notebooklm.google.com',  how:'Create notebook → Upload textbook PDF → Ask questions on specific pages!'},
  {name:'Wolfram Alpha', e:'🧮',d:'Solve math/physics step-by-step',    url:'https://wolframalpha.com',        how:'Type any equation → Get full step-by-step solution + graphs.'},
  {name:'Perplexity AI', e:'🔍',d:'AI search with citations',           url:'https://perplexity.ai',           how:'Ask research questions → Get cited answers you can actually trust.'},
  {name:'Quizlet AI',    e:'🃏',d:'Auto-generate flashcards',           url:'https://quizlet.com',             how:'Paste your notes → AI builds spaced-repetition flashcard decks.'},
  {name:'Khan Academy',  e:'🎓',d:'Free video lessons on everything',   url:'https://khanacademy.org',         how:'Search any topic → Watch 10-min lessons → Practice with instant feedback.'},
  {name:'Desmos',        e:'📈',d:'Interactive graphing calculator',    url:'https://desmos.com',              how:'Type any function → See it plotted instantly. Perfect for calculus/algebra.'},
];

async function ask(msg:string, subject:string, hist:Msg[]):Promise<string> {
  try {
    const k=import.meta.env.VITE_ANTHROPIC_API_KEY;
    if(!k||k==='your_anthropic_api_key_here')
      return '⚠️ **API key not set!**\n\nOpen the `.env` file and replace `your_anthropic_api_key_here` with your key from [console.anthropic.com](https://console.anthropic.com).\n\nOnce set, restart the dev server.';
    const recent=hist.slice(-8).map(m=>({role:m.role==='assistant'?'assistant':'user' as const,content:m.content}));
    const r=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':k,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514', max_tokens:1000,
        system:`You are StudyBuddy — a brilliant, warm AI tutor specializing in ${subject}. Your style: clear, concise, encouraging. You use analogies and examples. For hints, guide without spoiling. Use **bold** for key terms. Keep responses under 280 words. End with an emoji that fits the mood.`,
        messages:[...recent,{role:'user',content:msg}],
      }),
    });
    const d=await r.json();
    if(d.error) return `❌ API Error: ${d.error.message}`;
    return d.content?.[0]?.text||'No response generated.';
  } catch(e) { return `Connection error. Make sure:\n1. Your API key is correct in .env\n2. You have internet access`; }
}

const md=(t:string)=>t
  .replace(/\*\*(.*?)\*\*/g,'<strong style="color:#e6edf3">$1</strong>')
  .replace(/\*(.*?)\*/g,'<em style="color:#c9d1d9">$1</em>')
  .replace(/`(.*?)`/g,'<code style="background:var(--ink-800);padding:1px 5px;border-radius:4px;color:var(--neon-purple);font-size:12px">$1</code>')
  .replace(/\n/g,'<br/>');

export default function Chatbot() {
  const [msgs, setMsgs]       = useState<Msg[]>([{id:'0',role:'assistant',ts:new Date(),content:'👋 Hey! I\'m **StudyBuddy** — your personal AI tutor.\n\nPick a subject above and ask me anything:\n- 💡 Explain concepts with analogies\n- ❓ Get hints (not full answers)\n- 📝 Practice questions on demand\n- 🧠 Memory tricks that actually work\n\nWhat are we working on today?'}]);
  const [input, setInput]     = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [loading, setLoading] = useState(false);
  const [tab, setTab]         = useState<'chat'|'tools'>('chat');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); },[msgs]);

  const send=async(text:string)=>{
    if(!text.trim()||loading) return;
    const um:Msg={id:Date.now().toString(),role:'user',content:text.trim(),ts:new Date()};
    setMsgs(p=>[...p,um]); setInput(''); setLoading(true);
    const r=await ask(text,subject,msgs);
    setMsgs(p=>[...p,{id:(Date.now()+1).toString(),role:'assistant',content:r,ts:new Date()}]);
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col" style={{background:'var(--ink-950)',color:'white'}}>
      {/* Topbar */}
      <div className="px-5 py-3 flex items-center justify-between" style={{borderBottom:'1px solid var(--ink-700)',background:'var(--ink-900)'}}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,var(--neon-purple),var(--neon-blue))'}}>
            <Bot size={16} className="text-white"/>
          </div>
          <div>
            <p className="text-white font-semibold text-sm" style={{fontFamily:'Syne,sans-serif'}}>StudyBuddy AI Tutor</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:'var(--neon-green)'}}/>
              <span style={{color:'var(--neon-green)',fontSize:'10px'}}>Online · Claude Sonnet</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={subject} onChange={e=>setSubject(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5 outline-none"
            style={{background:'var(--ink-800)',border:'1px solid var(--ink-600)',color:'white'}}>
            {SUBJECTS.map(s=><option key={s}>{s}</option>)}
          </select>
          <div className="flex p-1 rounded-lg gap-0.5" style={{background:'var(--ink-800)',border:'1px solid var(--ink-700)'}}>
            {([['chat','💬 Chat'],['tools','🛠️ Tools']] as const).map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)}
                className="px-3 py-1.5 rounded-md text-xs transition-all"
                style={tab===t?{background:'var(--ink-600)',color:'white'}:{color:'var(--ink-500)'}}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={()=>setMsgs(msgs.slice(0,1))} style={{color:'var(--ink-500)',padding:'6px'}}>
            <Trash2 size={14}/>
          </button>
        </div>
      </div>

      {tab==='chat' ? (<>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {msgs.map(m=>(
            <div key={m.id} className={`flex gap-3 ${m.role==='user'?'flex-row-reverse':''}`}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{background:m.role==='user'?'var(--neon-blue)':'linear-gradient(135deg,var(--neon-purple),var(--neon-blue))'}}>
                {m.role==='user'?<User size={12}/>:<Bot size={12}/>}
              </div>
              <div className="max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                style={m.role==='user'?{background:'var(--neon-blue)',borderTopRightRadius:'4px',color:'white'}
                                       :{background:'var(--ink-800)',borderTopLeftRadius:'4px',color:'#c9d1d9',border:'1px solid var(--ink-700)'}}
                dangerouslySetInnerHTML={{__html:md(m.content)}}/>
            </div>
          ))}
          {loading&&(
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{background:'linear-gradient(135deg,var(--neon-purple),var(--neon-blue))'}}>
                <Bot size={12}/>
              </div>
              <div className="px-4 py-3 rounded-2xl" style={{background:'var(--ink-800)',border:'1px solid var(--ink-700)'}}>
                <div className="flex gap-1 items-center">
                  {[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{background:'var(--neon-purple)',animationDelay:`${i*0.15}s`}}/>)}
                  <span style={{color:'var(--ink-500)',fontSize:'11px',marginLeft:'6px'}}>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>

        {/* Quick prompts */}
        <div className="px-4 py-2" style={{borderTop:'1px solid var(--ink-800)'}}>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {QUICK.map(q=>(
              <button key={q.l} onClick={()=>setInput(q.p)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
                style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)',color:'var(--ink-500)'}}>
                <span>{q.icon}</span><span>{q.l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4" style={{borderTop:'1px solid var(--ink-700)'}}>
          <div className="flex items-end gap-3 rounded-2xl px-4 py-3" style={{background:'var(--ink-800)',border:'1px solid var(--ink-600)'}}>
            <textarea value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(input);}}}
              placeholder={`Ask anything about ${subject}...`} rows={1}
              className="flex-1 bg-transparent text-sm outline-none resize-none max-h-32"
              style={{color:'white',lineHeight:'1.5'}}/>
            <button onClick={()=>send(input)} disabled={!input.trim()||loading}
              className="p-2 rounded-xl transition-all flex-shrink-0"
              style={input.trim()&&!loading
                ?{background:'var(--neon-purple)',color:'white',boxShadow:'0 0 12px rgba(191,90,242,0.4)'}
                :{background:'var(--ink-700)',color:'var(--ink-500)',cursor:'not-allowed'}}>
              <Send size={14}/>
            </button>
          </div>
          <p style={{color:'var(--ink-600)',fontSize:'10px',textAlign:'center',marginTop:'6px'}}>Powered by Claude AI · Always verify important facts</p>
        </div>
      </>) : (
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-5">
            <h2 className="text-lg font-bold" style={{fontFamily:'Syne,sans-serif'}}>🛠️ AI Tools for Students</h2>
            <p style={{color:'var(--ink-500)',fontSize:'12px',marginTop:'4px'}}>Free tools that supercharge your studying</p>
          </div>
          <div className="space-y-3">
            {TOOLS.map(t=>(
              <div key={t.name} className="rounded-xl p-4" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{t.e}</span>
                    <div>
                      <h4 className="font-semibold text-sm">{t.name}</h4>
                      <p style={{color:'var(--ink-500)',fontSize:'11px'}}>{t.d}</p>
                    </div>
                  </div>
                  <a href={t.url} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0"
                    style={{background:'rgba(191,90,242,0.15)',color:'var(--neon-purple)',border:'1px solid rgba(191,90,242,0.3)'}}>
                    Open →
                  </a>
                </div>
                <div className="rounded-lg p-3" style={{background:'var(--ink-800)'}}>
                  <p style={{color:'var(--neon-green)',fontSize:'10px',fontWeight:600,marginBottom:'3px'}}>📋 HOW TO USE</p>
                  <p style={{color:'#8b949e',fontSize:'11px',lineHeight:'1.6'}}>{t.how}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl p-5" style={{background:'linear-gradient(135deg,rgba(191,90,242,0.08),rgba(10,132,255,0.08))',border:'1px solid rgba(191,90,242,0.2)'}}>
            <h4 className="font-bold mb-3" style={{fontFamily:'Syne,sans-serif',fontSize:'14px',color:'var(--neon-purple)'}}>⚡ The Ultimate Study Stack</h4>
            <ol className="space-y-2" style={{color:'#8b949e',fontSize:'12px',lineHeight:'1.7'}}>
              <li><strong style={{color:'white'}}>1.</strong> Upload textbook PDF to <strong style={{color:'var(--neon-purple)'}}>NotebookLM</strong> → get page-specific explanations</li>
              <li><strong style={{color:'white'}}>2.</strong> Check math/physics work on <strong style={{color:'var(--neon-purple)'}}>Wolfram Alpha</strong> → see where you went wrong</li>
              <li><strong style={{color:'white'}}>3.</strong> Use <strong style={{color:'var(--neon-purple)'}}>StudyBuddy Chat</strong> (here!) when fundamentally confused</li>
              <li><strong style={{color:'white'}}>4.</strong> Dump notes into <strong style={{color:'var(--neon-purple)'}}>Quizlet</strong> → study flashcards 2 nights before exams</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
"@ | Set-Content src\components\Chatbot\Chatbot.tsx
Write-Host "  [OK] Chatbot.tsx" -ForegroundColor Green

# ─── StudyPlanner.tsx ─────────────────────────────────────
@"
import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Calendar, Sparkles, X } from 'lucide-react';

interface Task { id:string; subject:string; topic:string; date:string; duration:number; completed:boolean; priority:'high'|'medium'|'low'; }
const SUBJECTS = ['Mathematics','Physics','Chemistry','Biology','History','Computer Science','Literature','Economics','Other'];
const EMO: Record<string,string> = {Mathematics:'📐',Physics:'⚛️',Chemistry:'🧪',Biology:'🧬',History:'📜','Computer Science':'💻',Literature:'📖',Economics:'📊',Other:'📝'};
const PCFG = {
  high:   {color:'var(--neon-red)',  bg:'rgba(255,69,58,0.1)',  border:'rgba(255,69,58,0.3)' },
  medium: {color:'var(--neon-amber)',bg:'rgba(255,214,10,0.1)', border:'rgba(255,214,10,0.3)'},
  low:    {color:'var(--neon-green)',bg:'rgba(48,209,88,0.1)',  border:'rgba(48,209,88,0.3)' },
};

async function aiPlan(subjects:string[],exam:string,hrs:number): Promise<Task[]> {
  try {
    const k=import.meta.env.VITE_ANTHROPIC_API_KEY;
    if(!k||k==='your_anthropic_api_key_here') return [];
    const r=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':k,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1200,messages:[{role:'user',content:
        `Create a spaced-repetition study plan from today (${new Date().toISOString().split('T')[0]}) until ${exam}. Subjects: ${subjects.join(', ')}. Available: ${hrs}h/day. Return ONLY valid JSON array, no markdown. Schema: [{"id":"1","subject":"name","topic":"specific sub-topic","date":"YYYY-MM-DD","duration":30,"completed":false,"priority":"high|medium|low"}]. Max 18 tasks. Space difficult topics 2-3 days before exam.`}]}),
    });
    const d=await r.json();
    const t=d.content?.[0]?.text||'[]';
    return JSON.parse(t.replace(/```json|```/g,'').trim());
  } catch { return []; }
}

export default function StudyPlanner() {
  const today=new Date().toISOString().split('T')[0];
  const [tasks,   setTasks]   = useState<Task[]>(()=>{ try{return JSON.parse(localStorage.getItem('sb_tasks')||'[]');}catch{return [];} });
  const [showAdd, setShowAdd] = useState(false);
  const [showAI,  setShowAI]  = useState(false);
  const [gen,     setGen]     = useState(false);
  const [filter,  setFilter]  = useState<'all'|'today'|'upcoming'|'done'>('all');
  const [newT,    setNewT]    = useState({subject:'Mathematics',topic:'',date:today,duration:45,priority:'medium' as 'high'|'medium'|'low'});
  const [aiF,     setAiF]     = useState({subjects:[] as string[],exam:'',hrs:3});

  useEffect(()=>{ localStorage.setItem('sb_tasks',JSON.stringify(tasks)); },[tasks]);

  const visible=tasks.filter(t=>{
    if(filter==='today')    return t.date===today&&!t.completed;
    if(filter==='upcoming') return t.date>today&&!t.completed;
    if(filter==='done')     return t.completed;
    return true;
  }).sort((a,b)=>a.date.localeCompare(b.date));

  const add=()=>{ if(!newT.topic.trim()) return; setTasks(p=>[...p,{...newT,id:Date.now().toString(),completed:false}]); setNewT({subject:'Mathematics',topic:'',date:today,duration:45,priority:'medium'}); setShowAdd(false); };
  const toggle=(id:string)=>setTasks(p=>p.map(t=>t.id===id?{...t,completed:!t.completed}:t));
  const del=(id:string)=>setTasks(p=>p.filter(t=>t.id!==id));
  const generate=async()=>{ if(!aiF.exam||aiF.subjects.length===0) return; setGen(true); const n=await aiPlan(aiF.subjects,aiF.exam,aiF.hrs); if(n.length>0)setTasks(p=>[...p,...n]); setGen(false); setShowAI(false); };
  const toggleSubj=(s:string)=>setAiF(p=>({...p,subjects:p.subjects.includes(s)?p.subjects.filter(x=>x!==s):[...p.subjects,s]}));

  const done=tasks.filter(t=>t.completed).length;
  const todayTasks=tasks.filter(t=>t.date===today&&!t.completed);
  const leftMins=tasks.filter(t=>!t.completed).reduce((a,t)=>a+t.duration,0);

  return (
    <div className="min-h-screen p-6 flex flex-col gap-5" style={{background:'var(--ink-950)',color:'white'}}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{fontFamily:'Syne,sans-serif',letterSpacing:'-0.02em'}}>Study Planner</h1>
          <p style={{color:'var(--ink-500)',fontSize:'13px'}}>Plan sessions · Track progress · Beat procrastination</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>{setShowAI(s=>!s);setShowAdd(false);}}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{background:'rgba(191,90,242,0.15)',color:'var(--neon-purple)',border:'1px solid rgba(191,90,242,0.3)'}}>
            <Sparkles size={14}/>AI Generate
          </button>
          <button onClick={()=>{setShowAdd(s=>!s);setShowAI(false);}}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{background:'var(--ink-800)',color:'white',border:'1px solid var(--ink-600)'}}>
            <Plus size={14}/>Add Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {icon:'📋',l:"Today",    v:todayTasks.length,         c:'var(--neon-blue)'  },
          {icon:'✅',l:"Done",     v:done,                       c:'var(--neon-green)' },
          {icon:'⏳',l:"Pending",  v:tasks.length-done,          c:'var(--neon-amber)' },
          {icon:'⏱️',l:"Hours Left",v:`${Math.round(leftMins/60)}h`,c:'var(--neon-purple)'},
        ].map(s=>(
          <div key={s.l} className="rounded-xl p-4" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold" style={{color:s.c,fontFamily:'Syne,sans-serif'}}>{s.v}</div>
            <div style={{color:'var(--ink-500)',fontSize:'11px',marginTop:'2px'}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* AI Generator */}
      {showAI&&(
        <div className="rounded-xl p-5" style={{background:'var(--ink-900)',border:'1px solid rgba(191,90,242,0.3)'}}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2" style={{fontFamily:'Syne,sans-serif'}}>
              <Sparkles size={16} style={{color:'var(--neon-purple)'}}/>AI Study Plan Generator
            </h3>
            <button onClick={()=>setShowAI(false)}><X size={16} style={{color:'var(--ink-500)'}}/></button>
          </div>
          <div className="space-y-4">
            <div>
              <p style={{color:'var(--ink-500)',fontSize:'12px',marginBottom:'8px'}}>Select subjects to study</p>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(s=>(
                  <button key={s} onClick={()=>toggleSubj(s)} className="px-3 py-1.5 rounded-lg text-sm transition-all"
                    style={aiF.subjects.includes(s)?{background:'rgba(191,90,242,0.2)',color:'var(--neon-purple)',border:'1px solid rgba(191,90,242,0.4)'}:{background:'var(--ink-800)',color:'var(--ink-500)',border:'1px solid var(--ink-700)'}}>
                    {EMO[s]} {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label style={{color:'var(--ink-500)',fontSize:'12px',display:'block',marginBottom:'4px'}}>Exam / Deadline Date</label>
                <input type="date" value={aiF.exam} min={today} onChange={e=>setAiF(p=>({...p,exam:e.target.value}))}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{background:'var(--ink-800)',border:'1px solid var(--ink-600)',color:'white'}}/>
              </div>
              <div className="flex-1">
                <label style={{color:'var(--ink-500)',fontSize:'12px',display:'block',marginBottom:'4px'}}>Hours Available / Day</label>
                <input type="number" min={1} max={12} value={aiF.hrs} onChange={e=>setAiF(p=>({...p,hrs:Number(e.target.value)}))}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{background:'var(--ink-800)',border:'1px solid var(--ink-600)',color:'white'}}/>
              </div>
            </div>
            <button onClick={generate} disabled={gen||!aiF.exam||aiF.subjects.length===0}
              className="w-full py-2.5 rounded-lg font-semibold text-sm"
              style={gen||!aiF.exam||aiF.subjects.length===0?{background:'var(--ink-800)',color:'var(--ink-500)',cursor:'not-allowed'}:{background:'var(--neon-purple)',color:'white',boxShadow:'0 0 20px rgba(191,90,242,0.3)'}}>
              {gen?'🤖 Generating your personalized plan...':'✨ Generate AI-Powered Study Plan'}
            </button>
          </div>
        </div>
      )}

      {/* Manual add */}
      {showAdd&&(
        <div className="rounded-xl p-5" style={{background:'var(--ink-900)',border:'1px solid var(--ink-600)'}}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{fontFamily:'Syne,sans-serif'}}>New Study Task</h3>
            <button onClick={()=>setShowAdd(false)}><X size={16} style={{color:'var(--ink-500)'}}/></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Subject','select','subject',SUBJECTS,newT.subject,(v:string)=>setNewT(p=>({...p,subject:v}))],
              ['Topic','text','topic',null,newT.topic,(v:string)=>setNewT(p=>({...p,topic:v}))],
              ['Date','date','date',null,newT.date,(v:string)=>setNewT(p=>({...p,date:v}))],
              ['Duration (min)','number','duration',null,newT.duration,(v:string)=>setNewT(p=>({...p,duration:Number(v)}))],
            ].map(([l,type,field,opts,val,fn])=>(
              <div key={field as string}>
                <label style={{color:'var(--ink-500)',fontSize:'12px',display:'block',marginBottom:'4px'}}>{l as string}</label>
                {type==='select'
                  ? <select value={val as string} onChange={e=>(fn as Function)(e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                      style={{background:'var(--ink-800)',border:'1px solid var(--ink-600)',color:'white'}}>
                      {(opts as string[]).map(o=><option key={o}>{o}</option>)}
                    </select>
                  : <input type={type as string} value={val as string|number} min={type==='number'?5:type==='date'?today:undefined} max={type==='number'?300:undefined}
                      placeholder={field==='topic'?'e.g. Integration by parts, Newton\'s Laws...':''}
                      onChange={e=>(fn as Function)(e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                      style={{background:'var(--ink-800)',border:'1px solid var(--ink-600)',color:'white'}}/>
                }
              </div>
            ))}
            <div>
              <label style={{color:'var(--ink-500)',fontSize:'12px',display:'block',marginBottom:'4px'}}>Priority</label>
              <div className="flex gap-2">
                {(['high','medium','low'] as const).map(p=>(
                  <button key={p} onClick={()=>setNewT(x=>({...x,priority:p}))}
                    className="flex-1 py-2 rounded-lg text-xs font-medium capitalize"
                    style={newT.priority===p?{background:PCFG[p].bg,color:PCFG[p].color,border:`1px solid ${PCFG[p].border}`}:{background:'var(--ink-800)',color:'var(--ink-500)',border:'1px solid var(--ink-700)'}}>
                    {p==='high'?'🔴':p==='medium'?'🟡':'🟢'} {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <button onClick={add} className="w-full py-2 rounded-lg font-semibold text-sm"
                style={{background:'var(--neon-blue)',color:'white'}}>
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)',width:'fit-content'}}>
        {(['all','today','upcoming','done'] as const).map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className="px-4 py-1.5 rounded-lg text-sm capitalize"
            style={filter===f?{background:'var(--ink-700)',color:'white'}:{color:'var(--ink-500)'}}>
            {f}{f==='today'?` (${todayTasks.length})`:''}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {visible.length===0 ? (
          <div className="text-center py-16" style={{color:'var(--ink-600)'}}>
            <Calendar size={40} className="mx-auto mb-3" style={{opacity:0.3}}/>
            <p style={{fontSize:'14px'}}>No tasks here — add one manually or let AI generate your plan</p>
          </div>
        ) : visible.map(t=>(
          <div key={t.id} className="flex items-center gap-4 rounded-xl px-4 py-3 transition-all"
            style={{background:'var(--ink-900)',border:`1px solid ${t.completed?'var(--ink-800)':'var(--ink-700)'}`,opacity:t.completed?0.5:1}}>
            <button onClick={()=>toggle(t.id)}>
              {t.completed ? <CheckCircle size={18} style={{color:'var(--neon-green)'}}/> : <Circle size={18} style={{color:'var(--ink-600)'}}/>}
            </button>
            <span className="text-lg">{EMO[t.subject]||'📝'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{textDecoration:t.completed?'line-through':'none',color:t.completed?'var(--ink-500)':'white'}}>{t.topic}</p>
              <p style={{color:'var(--ink-500)',fontSize:'11px'}}>{t.subject}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{background:PCFG[t.priority].bg,color:PCFG[t.priority].color,border:`1px solid ${PCFG[t.priority].border}`}}>{t.priority}</span>
              <span style={{color:'var(--ink-500)',fontSize:'11px'}}>{t.duration}m</span>
              <span style={{color:'var(--ink-600)',fontSize:'11px'}}>{t.date}</span>
              <button onClick={()=>del(t.id)} style={{color:'var(--ink-700)'}} className="hover:text-red-400"><Trash2 size={13}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"@ | Set-Content src\components\StudyPlanner\StudyPlanner.tsx
Write-Host "  [OK] StudyPlanner.tsx" -ForegroundColor Green

# ─── Dashboard.tsx ────────────────────────────────────────
@"
import { useState, useEffect } from 'react';
import { Clock, Target, Flame, TrendingUp } from 'lucide-react';

const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const COLORS=['var(--neon-purple)','var(--neon-blue)','var(--neon-green)','var(--neon-red)','var(--neon-amber)','var(--neon-teal)','#ec4899'];
const EMO: Record<string,string>={Mathematics:'📐',Physics:'⚛️',Chemistry:'🧪',Biology:'🧬',History:'📜','Computer Science':'💻',Literature:'📖',Economics:'📊',Other:'📝'};

export default function Dashboard() {
  const [tasks,setTasks]=useState<any[]>([]);
  const [streak,setStreak]=useState(0);
  const [weekly,setWeekly]=useState<{label:string;value:number;color:string}[]>([]);
  const [breakdown,setBreakdown]=useState<{subject:string;minutes:number;count:number}[]>([]);

  useEffect(()=>{
    const t=JSON.parse(localStorage.getItem('sb_tasks')||'[]');
    setTasks(t);
    setStreak(parseInt(localStorage.getItem('sb_streak')||'0'));
    const today=new Date();
    setWeekly(DAYS.map((label,i)=>{
      const d=new Date(today); d.setDate(today.getDate()-today.getDay()+i+1);
      const ds=d.toISOString().split('T')[0];
      const mins=t.filter((x:any)=>x.date===ds&&x.completed).reduce((a:number,x:any)=>a+x.duration,0);
      return {label,value:mins,color:COLORS[i]};
    }));
    const by:Record<string,{minutes:number;count:number}>={};
    t.filter((x:any)=>x.completed).forEach((x:any)=>{
      if(!by[x.subject])by[x.subject]={minutes:0,count:0};
      by[x.subject].minutes+=x.duration; by[x.subject].count+=1;
    });
    setBreakdown(Object.entries(by).map(([subject,d])=>({subject,...d})).sort((a,b)=>b.minutes-a.minutes));
  },[]);

  const done=tasks.filter(t=>t.completed);
  const total=tasks.length;
  const mins=done.reduce((a,t)=>a+t.duration,0);
  const rate=total>0?Math.round((done.length/total)*100):0;
  const today=new Date().toISOString().split('T')[0];
  const todayDone=tasks.filter(t=>t.date===today&&t.completed);
  const todayMins=todayDone.reduce((a,t)=>a+t.duration,0);
  const maxWeekly=Math.max(...weekly.map(d=>d.value),1);

  const mot = rate>=80?{msg:"You're on fire! 🔥 Keep the streak alive!",c:'var(--neon-green)'}
    : rate>=50?{msg:"Solid progress! 💪 Push through the last stretch.",c:'var(--neon-amber)'}
    : total===0?{msg:"Add your first task and start the journey 🚀",c:'var(--neon-blue)'}
    : {msg:"Every expert was once a beginner. One task at a time. ✨",c:'var(--neon-purple)'};

  const achv=[
    {e:'🌱',n:'First Step',  d:'Complete first task', ok:done.length>=1 },
    {e:'🔥',n:'On Fire',     d:'3-day streak',         ok:streak>=3      },
    {e:'⚡',n:'Productive',  d:'2+ hours in a day',    ok:todayMins>=120 },
    {e:'🏆',n:'Champion',    d:'10 tasks done',         ok:done.length>=10},
    {e:'🎯',n:'Focused',     d:'80% completion',        ok:rate>=80       },
    {e:'🌟',n:'Star Student',d:'7-day streak',           ok:streak>=7      },
    {e:'📚',n:'Scholar',     d:'5+ subjects',           ok:breakdown.length>=5},
    {e:'💎',n:'Legend',      d:'50 tasks done',         ok:done.length>=50},
  ];

  return (
    <div className="min-h-screen p-6 flex flex-col gap-5" style={{background:'var(--ink-950)',color:'white'}}>
      <div>
        <h1 className="text-2xl font-bold" style={{fontFamily:'Syne,sans-serif',letterSpacing:'-0.02em'}}>Progress Dashboard</h1>
        <p style={{color:mot.c,fontSize:'13px',marginTop:'4px'}}>{mot.msg}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {icon:<Clock size={18} style={{color:'var(--neon-blue)'}}/>,  label:'Hours Studied', v:`${Math.floor(mins/60)}h ${mins%60}m`, bg:'rgba(10,132,255,0.08)',   bdr:'rgba(10,132,255,0.2)'  },
          {icon:<Target size={18} style={{color:'var(--neon-green)'}}/>, label:'Tasks Done',    v:`${done.length}/${total}`,             bg:'rgba(48,209,88,0.08)',    bdr:'rgba(48,209,88,0.2)'   },
          {icon:<Flame size={18} style={{color:'var(--neon-amber)'}}/>,  label:'Day Streak',    v:`${streak} days`,                      bg:'rgba(255,214,10,0.08)',   bdr:'rgba(255,214,10,0.2)'  },
          {icon:<TrendingUp size={18} style={{color:'var(--neon-purple)'}}/>,label:'Completion',v:`${rate}%`,                            bg:'rgba(191,90,242,0.08)',   bdr:'rgba(191,90,242,0.2)'  },
        ].map(s=>(
          <div key={s.label} className="rounded-xl p-4" style={{background:s.bg,border:`1px solid ${s.bdr}`}}>
            <div className="mb-3">{s.icon}</div>
            <div className="text-2xl font-bold" style={{fontFamily:'Syne,sans-serif'}}>{s.v}</div>
            <div style={{color:'var(--ink-500)',fontSize:'11px',marginTop:'2px'}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Weekly bar chart */}
        <div className="rounded-xl p-5" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
          <p className="font-semibold mb-4" style={{fontFamily:'Syne,sans-serif',fontSize:'14px'}}>📅 This Week</p>
          {weekly.every(d=>d.value===0) ? (
            <div className="flex items-center justify-center h-32" style={{color:'var(--ink-600)',fontSize:'13px'}}>Complete tasks to see your chart</div>
          ) : (
            <div className="flex items-end gap-2" style={{height:'120px'}}>
              {weekly.map((d,i)=>(
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end" style={{height:'96px'}}>
                    <div className="w-full rounded-t-md" style={{
                      height:`${Math.max((d.value/maxWeekly)*100,d.value>0?8:0)}%`,
                      background:d.color,
                      boxShadow:d.value>0?`0 0 8px ${d.color}66`:'none',
                      transition:'height 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                    }}/>
                  </div>
                  <span style={{color:'var(--ink-500)',fontSize:'10px'}}>{d.label}</span>
                </div>
              ))}
            </div>
          )}
          <p style={{color:'var(--ink-600)',fontSize:'10px',textAlign:'center',marginTop:'8px'}}>Minutes studied per day</p>
        </div>

        {/* Today donut */}
        <div className="rounded-xl p-5" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
          <p className="font-semibold mb-4" style={{fontFamily:'Syne,sans-serif',fontSize:'14px'}}>⚡ Today</p>
          <div className="flex items-center justify-center mb-4">
            <div className="relative" style={{width:'120px',height:'120px'}}>
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{transform:'rotate(-90deg)'}}>
                <circle cx="50" cy="50" r="38" fill="none" stroke="var(--ink-800)" strokeWidth="8"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="var(--neon-purple)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2*Math.PI*38}`}
                  strokeDashoffset={`${2*Math.PI*38*(1-Math.min(todayMins/120,1))}`}
                  style={{transition:'stroke-dashoffset 1s',filter:'drop-shadow(0 0 4px var(--neon-purple))'}}/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-bold" style={{fontSize:'22px',fontFamily:'Syne,sans-serif'}}>{todayMins}m</span>
                <span style={{color:'var(--ink-500)',fontSize:'9px',letterSpacing:'0.1em'}}>TODAY</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{color:'var(--ink-500)'}}>Tasks completed</span>
              <span style={{color:'white',fontWeight:500}}>{todayDone.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{color:'var(--ink-500)'}}>2h daily goal</span>
              <span style={{color:todayMins>=120?'var(--neon-green)':'var(--neon-amber)',fontWeight:500}}>
                {todayMins>=120?'✅ Crushed it!':`${120-todayMins}m remaining`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject breakdown */}
      <div className="rounded-xl p-5" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
        <p className="font-semibold mb-4" style={{fontFamily:'Syne,sans-serif',fontSize:'14px'}}>📚 Subject Breakdown</p>
        {breakdown.length===0 ? (
          <div className="text-center py-8" style={{color:'var(--ink-600)',fontSize:'13px'}}>Complete some tasks to see your breakdown</div>
        ) : breakdown.map((item,i)=>(
          <div key={item.subject} className="flex items-center gap-4 mb-3">
            <span className="text-lg">{EMO[item.subject]||'📝'}</span>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{item.subject}</span>
                <span style={{color:'var(--ink-500)',fontSize:'11px'}}>{item.count} tasks · {item.minutes}m</span>
              </div>
              <div className="rounded-full h-1.5" style={{background:'var(--ink-800)'}}>
                <div className="h-1.5 rounded-full" style={{
                  width:`${(item.minutes/breakdown[0].minutes)*100}%`,
                  background:COLORS[i%COLORS.length],
                  boxShadow:`0 0 6px ${COLORS[i%COLORS.length]}88`,
                }}/>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="rounded-xl p-5" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
        <p className="font-semibold mb-4" style={{fontFamily:'Syne,sans-serif',fontSize:'14px'}}>🏆 Achievements</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {achv.map(a=>(
            <div key={a.n} className="p-3 rounded-xl text-center" style={a.ok?{background:'rgba(255,214,10,0.08)',border:'1px solid rgba(255,214,10,0.2)'}:{background:'var(--ink-800)',border:'1px solid var(--ink-700)',opacity:0.4}}>
              <div className="text-2xl mb-1">{a.e}</div>
              <div className="text-sm font-medium" style={{color:a.ok?'var(--neon-amber)':'var(--ink-500)',fontFamily:'Syne,sans-serif'}}>{a.n}</div>
              <div style={{color:'var(--ink-600)',fontSize:'10px',marginTop:'2px'}}>{a.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
"@ | Set-Content src\components\Dashboard\Dashboard.tsx
Write-Host "  [OK] Dashboard.tsx" -ForegroundColor Green

# ─── EmotionDetector.tsx ──────────────────────────────────
@"
import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, RefreshCw, AlertTriangle } from 'lucide-react';

type Emotion='happy'|'sad'|'angry'|'fearful'|'disgusted'|'surprised'|'neutral';
const EMO: Record<Emotion,{emoji:string;label:string;tip:string;color:string;action:string}> = {
  happy:     {emoji:'😄',label:'Happy',     color:'var(--neon-green)', action:'Start on hard problems now!',                    tip:'Your dopamine is high — perfect for tackling challenging new topics and making connections.'},
  neutral:   {emoji:'😐',label:'Focused',   color:'var(--neon-blue)',  action:'Ideal for reading & memorization.',              tip:'Calm and ready — optimal state for reading, note-taking, and memorization work.'},
  surprised: {emoji:'😮',label:'Engaged',   color:'var(--neon-amber)', action:'Great for exploring new concepts.',              tip:'Your brain is primed for novelty — perfect for learning something completely new.'},
  sad:       {emoji:'😢',label:'Sad',       color:'var(--neon-teal)',  action:'Try lofi music for 5 minutes first.',            tip:'Take a 5-min break with calming music. Review familiar material rather than new content.'},
  fearful:   {emoji:'😰',label:'Stressed',  color:'var(--neon-purple)',action:'Do box breathing: 4s in, 4s hold, 4s out.',      tip:'4-7-8 breathing helps: inhale 4s, hold 7s, exhale 8s. Then start with easiest tasks.'},
  angry:     {emoji:'😠',label:'Frustrated',color:'var(--neon-red)',   action:'Step away for 5 min. You\'ll return sharper.',   tip:'A short physical break resets your brain. Walk, stretch, or get water before continuing.'},
  disgusted: {emoji:'😒',label:'Bored',     color:'#f97316',           action:'Switch subjects or set a 15-min challenge.',     tip:'Try the Pomodoro technique or gamify it: race against the clock for 15 minutes.'},
};

export default function EmotionDetector() {
  const videoRef=useRef<HTMLVideoElement>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const intervalRef=useRef<ReturnType<typeof setInterval>|null>(null);
  const streamRef=useRef<MediaStream|null>(null);
  const [active,setActive]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const [loading,setLoading]=useState(false);
  const [current,setCurrent]=useState<{emotion:Emotion;score:number;ts:Date}|null>(null);
  const [history,setHistory]=useState<{emotion:Emotion;score:number;ts:Date}[]>([]);
  const [error,setError]=useState('');
  const [apiReady,setApiReady]=useState(false);

  useEffect(()=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
    s.onload=()=>setApiReady(true);
    s.onerror=()=>setError('Could not load face detection library. Check internet connection.');
    document.head.appendChild(s);
    return ()=>{ try{document.head.removeChild(s);}catch{} };
  },[]);

  useEffect(()=>{
    if(!apiReady) return;
    setLoading(true);
    const fa=(window as any).faceapi;
    Promise.all([fa.nets.tinyFaceDetector.loadFromUri('/models'),fa.nets.faceExpressionNet.loadFromUri('/models')])
      .then(()=>setLoaded(true))
      .catch(()=>setError('AI models not found. Download model files to public/models/ — see setup instructions below.'))
      .finally(()=>setLoading(false));
  },[apiReady]);

  const detect=useCallback(async()=>{
    if(!videoRef.current||!canvasRef.current||!loaded) return;
    const fa=(window as any).faceapi;
    try {
      const dets=await fa.detectAllFaces(videoRef.current,new fa.TinyFaceDetectorOptions()).withFaceExpressions();
      if(dets.length>0){
        const exp=dets[0].expressions;
        const [emo,score]=Object.entries(exp).sort(([,a],[,b])=>(b as number)-(a as number))[0] as [Emotion,number];
        const r={emotion:emo,score,ts:new Date()};
        setCurrent(r); setHistory(p=>[r,...p.slice(0,11)]);
        const cv=canvasRef.current!; const ds={width:videoRef.current!.offsetWidth,height:videoRef.current!.offsetHeight};
        fa.matchDimensions(cv,ds); const rs=fa.resizeResults(dets,ds);
        fa.draw.drawDetections(cv,rs);
      }
    } catch {}
  },[loaded]);

  const start=async()=>{
    try {
      const s=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:'user'}});
      streamRef.current=s;
      if(videoRef.current){videoRef.current.srcObject=s;await videoRef.current.play();}
      setActive(true); setError('');
      intervalRef.current=setInterval(detect,2500);
    } catch { setError('Camera denied. Please allow camera access in browser settings.'); }
  };
  const stop=()=>{
    streamRef.current?.getTracks().forEach(t=>t.stop()); streamRef.current=null;
    if(intervalRef.current) clearInterval(intervalRef.current);
    setActive(false);
  };
  useEffect(()=>()=>{stop();},[]);

  return (
    <div className="min-h-screen p-6 flex flex-col gap-5" style={{background:'var(--ink-950)',color:'white'}}>
      <div>
        <h1 className="text-2xl font-bold" style={{fontFamily:'Syne,sans-serif',letterSpacing:'-0.02em'}}>Emotion AI</h1>
        <p style={{color:'var(--ink-500)',fontSize:'13px'}}>Real-time emotion detection to optimize your study state</p>
      </div>

      {error&&(
        <div className="rounded-xl p-4 flex items-start gap-3" style={{background:'rgba(255,69,58,0.08)',border:'1px solid rgba(255,69,58,0.3)'}}>
          <AlertTriangle size={16} style={{color:'var(--neon-red)',flexShrink:0,marginTop:'1px'}}/>
          <p style={{color:'#ff6b6b',fontSize:'13px'}}>{error}</p>
        </div>
      )}

      <div className="flex gap-5 flex-wrap lg:flex-nowrap">
        {/* Camera */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="rounded-xl overflow-hidden" style={{border:'1px solid var(--ink-700)'}}>
            <div className="relative bg-black" style={{aspectRatio:'16/9'}}>
              {active ? (<>
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline/>
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"/>
                {current&&(
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-2 rounded-xl" style={{background:'rgba(8,11,18,0.85)',backdropFilter:'blur(8px)',border:`1px solid ${EMO[current.emotion].color}44`}}>
                    <span className="text-xl">{EMO[current.emotion].emoji}</span>
                    <div>
                      <p className="font-semibold text-sm" style={{color:EMO[current.emotion].color}}>{EMO[current.emotion].label}</p>
                      <p style={{color:'var(--ink-500)',fontSize:'10px'}}>{Math.round(current.score*100)}% confident</p>
                    </div>
                    <div className="ml-2 w-1 h-1 rounded-full animate-pulse" style={{background:EMO[current.emotion].color}}/>
                  </div>
                )}
              </>) : (
                <div className="flex flex-col items-center justify-center h-full gap-3" style={{minHeight:'200px'}}>
                  <CameraOff size={40} style={{color:'var(--ink-700)'}}/>
                  <p style={{color:'var(--ink-600)',fontSize:'13px'}}>Camera inactive</p>
                </div>
              )}
            </div>
            <div className="px-4 py-3 flex items-center justify-between" style={{background:'var(--ink-900)'}}>
              <p style={{color:'var(--ink-500)',fontSize:'11px'}}>
                {loading?'⏳ Loading AI models...' : loaded?'✅ face-api.js ready' : apiReady?'⚠️ Download model files' : '⏳ Loading library...'}
              </p>
              <div className="flex gap-2">
                {active&&<button onClick={detect} className="p-2 rounded-lg" style={{background:'var(--ink-800)',border:'1px solid var(--ink-600)'}}><RefreshCw size={14} style={{color:'var(--ink-500)'}}/></button>}
                <button onClick={active?stop:start} disabled={!loaded&&!active}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                  style={active?{background:'rgba(255,69,58,0.15)',color:'var(--neon-red)',border:'1px solid rgba(255,69,58,0.3)'}:{background:loaded?'rgba(191,90,242,0.15)':'var(--ink-800)',color:loaded?'var(--neon-purple)':'var(--ink-500)',border:loaded?'1px solid rgba(191,90,242,0.3)':'1px solid var(--ink-700)',cursor:loaded?'pointer':'not-allowed'}}>
                  {active?<><CameraOff size={14}/>Stop Camera</>:<><Camera size={14}/>Start Camera</>}
                </button>
              </div>
            </div>
          </div>

          {/* Setup guide */}
          {!loaded&&!error&&(
            <div className="rounded-xl p-4" style={{background:'rgba(10,132,255,0.06)',border:'1px solid rgba(10,132,255,0.2)'}}>
              <p style={{color:'var(--neon-blue)',fontWeight:600,fontSize:'12px',marginBottom:'8px'}}>ℹ️ One-time Setup for Emotion AI</p>
              <ol style={{color:'#8b949e',fontSize:'11px',lineHeight:'2',listStyleType:'decimal',paddingLeft:'16px'}}>
                <li>Go to: <a href="https://github.com/justadudewhohacks/face-api.js/tree/master/weights" target="_blank" rel="noopener noreferrer" style={{color:'var(--neon-blue)',textDecoration:'underline'}}>face-api.js weights (GitHub)</a></li>
                <li>Download files starting with <code style={{background:'var(--ink-800)',padding:'1px 4px',borderRadius:'3px'}}>tiny_face_detector_</code></li>
                <li>Download files starting with <code style={{background:'var(--ink-800)',padding:'1px 4px',borderRadius:'3px'}}>face_expression_recognition_</code></li>
                <li>Place all files in <code style={{background:'var(--ink-800)',padding:'1px 4px',borderRadius:'3px'}}>public/models/</code> folder</li>
                <li>Refresh the page — camera button will unlock</li>
              </ol>
            </div>
          )}

          {/* Emotion grid */}
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(EMO) as [Emotion,typeof EMO[Emotion]][]).map(([k,v])=>(
              <div key={k} className="rounded-lg p-2 text-center" style={{background:current?.emotion===k?`${v.color}12`:'var(--ink-900)',border:`1px solid ${current?.emotion===k?v.color+'44':'var(--ink-700)'}`,transition:'all 0.3s'}}>
                <div className="text-xl">{v.emoji}</div>
                <div style={{fontSize:'9px',color:current?.emotion===k?v.color:'var(--ink-600)',marginTop:'3px',letterSpacing:'0.05em'}}>{v.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{width:'260px'}} className="flex flex-col gap-3">
          {/* Current emotion card */}
          {current ? (
            <div className="rounded-xl p-5 text-center" style={{background:'var(--ink-900)',border:`1px solid ${EMO[current.emotion].color}33`,boxShadow:`0 0 30px ${EMO[current.emotion].color}11`}}>
              <div className="text-5xl mb-2 animate-float">{EMO[current.emotion].emoji}</div>
              <h3 className="font-bold text-lg" style={{fontFamily:'Syne,sans-serif',color:EMO[current.emotion].color}}>{EMO[current.emotion].label}</h3>
              <p style={{color:'var(--ink-500)',fontSize:'11px',marginTop:'2px'}}>{Math.round(current.score*100)}% confidence</p>
              <div className="mt-3 rounded-lg p-3" style={{background:'var(--ink-800)',border:'1px solid var(--ink-700)'}}>
                <p style={{color:'var(--neon-green)',fontSize:'10px',fontWeight:600,marginBottom:'4px'}}>⚡ RECOMMENDED ACTION</p>
                <p style={{color:'white',fontSize:'12px',fontWeight:500}}>{EMO[current.emotion].action}</p>
              </div>
              <div className="mt-2 rounded-lg p-3" style={{background:'var(--ink-800)',border:'1px solid var(--ink-700)'}}>
                <p style={{color:'var(--neon-purple)',fontSize:'10px',fontWeight:600,marginBottom:'4px'}}>💡 STUDY TIP</p>
                <p style={{color:'#8b949e',fontSize:'11px',lineHeight:'1.5'}}>{EMO[current.emotion].tip}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-5 text-center" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
              <div className="text-4xl mb-2" style={{opacity:0.3}}>🎭</div>
              <p style={{color:'var(--ink-600)',fontSize:'13px'}}>Start camera to detect your emotion</p>
            </div>
          )}

          {/* History */}
          <div className="rounded-xl p-4 flex-1" style={{background:'var(--ink-900)',border:'1px solid var(--ink-700)'}}>
            <p style={{color:'var(--ink-500)',fontSize:'9px',letterSpacing:'0.15em',marginBottom:'10px'}}>EMOTION HISTORY</p>
            {history.length===0
              ? <p style={{color:'var(--ink-700)',fontSize:'12px'}}>No readings yet</p>
              : history.slice(0,10).map((h,i)=>(
                  <div key={i} className="flex items-center justify-between py-1.5" style={{borderBottom:'1px solid var(--ink-800)'}}>
                    <div className="flex items-center gap-2">
                      <span>{EMO[h.emotion].emoji}</span>
                      <span style={{color:'#c9d1d9',fontSize:'12px'}}>{EMO[h.emotion].label}</span>
                    </div>
                    <span style={{color:'var(--ink-600)',fontSize:'10px'}}>{h.ts.toLocaleTimeString()}</span>
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
"@ | Set-Content src\components\EmotionDetector\EmotionDetector.tsx
Write-Host "  [OK] EmotionDetector.tsx" -ForegroundColor Green

# ─── .env ─────────────────────────────────────────────────
if (!(Test-Path ".env")) {
  "VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here" | Set-Content .env
  Write-Host "  [OK] .env created — ADD YOUR API KEY!" -ForegroundColor Yellow
} else {
  $c=Get-Content .env -Raw
  if ($c -notmatch "VITE_ANTHROPIC_API_KEY") {
    Add-Content .env "`nVITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here"
    Write-Host "  [OK] API key entry added to .env" -ForegroundColor Yellow
  } else { Write-Host "  [SKIP] .env already configured" -ForegroundColor Gray }
}

# ─── Install packages ─────────────────────────────────────
Write-Host ""
Write-Host "  Checking & installing packages..." -ForegroundColor Cyan
$pkg = Get-Content package.json -Raw -ErrorAction SilentlyContinue
$miss = @()
if ($pkg -notmatch '"react-router-dom"')     { $miss += "react-router-dom" }
if ($pkg -notmatch '"lucide-react"')          { $miss += "lucide-react" }
if ($pkg -notmatch '"@vitejs/plugin-react"')  { $miss += "@vitejs/plugin-react" }
if ($pkg -notmatch '"vite"')                  { $miss += "vite" }
if ($pkg -notmatch '"react"[^-]')             { $miss += "react react-dom" }
if ($pkg -notmatch '"typescript"')            { $miss += "typescript @types/react @types/react-dom" }
if ($pkg -notmatch '"tailwindcss"')           { $miss += "tailwindcss postcss autoprefixer" }
if ($miss.Count -gt 0) {
  Write-Host "  Installing: $($miss -join ' ')" -ForegroundColor Yellow
  Invoke-Expression "npm install $($miss -join ' ') --save-dev"
  npm install react-router-dom lucide-react --save
}

# ─── Fix package.json scripts ─────────────────────────────
$pj = Get-Content package.json -Raw | ConvertFrom-Json
if (-not $pj.scripts -or -not $pj.scripts.dev) {
  Write-Host "  Fixing package.json scripts..." -ForegroundColor Yellow
  $pj | Add-Member -Force -MemberType NoteProperty -Name "scripts" -Value ([PSCustomObject]@{
    dev   = "vite"
    build = "tsc && vite build"
    preview = "vite preview"
  })
  $pj | Add-Member -Force -MemberType NoteProperty -Name "type" -Value "module"
  $pj | ConvertTo-Json -Depth 10 | Set-Content package.json
  Write-Host "  [OK] package.json scripts fixed" -ForegroundColor Green
}

# ─── Done ─────────────────────────────────────────────────
Write-Host ""
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host "   StudyBuddy AI is READY!" -ForegroundColor Green
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  STEP 1 — Add your API key to .env:" -ForegroundColor Yellow
Write-Host "    VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxx" -ForegroundColor White
Write-Host "    Get free key: https://console.anthropic.com" -ForegroundColor Gray
Write-Host ""
Write-Host "  STEP 2 — For Emotion AI, download model files:" -ForegroundColor Yellow
Write-Host "    https://github.com/justadudewhohacks/face-api.js/tree/master/weights" -ForegroundColor Gray
Write-Host "    Files: tiny_face_detector_* + face_expression_recognition_*" -ForegroundColor Gray
Write-Host "    Put them in: public\models\" -ForegroundColor Gray
Write-Host ""
Write-Host "  STEP 3 — Run the app:" -ForegroundColor Yellow
Write-Host "    npm run dev" -ForegroundColor Cyan
Write-Host ""
