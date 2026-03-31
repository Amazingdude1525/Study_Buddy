import { useState, useEffect } from "react";
import { LayoutDashboard, Camera, BookOpen, Music, TerminalSquare, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { getContributions } from "../services/api";
import { motion } from "framer-motion";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Focus Mode", path: "/focus", icon: Camera },
  { title: "Subjects", path: "/subjects", icon: BookOpen },
  { title: "Music", path: "/music", icon: Music },
  { title: "Creator", path: "/about", icon: TerminalSquare },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="glass-sidebar w-64 min-h-screen flex flex-col py-8 px-4 z-20 shrink-0">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="glow-text text-primary">Neuro</span>
          <span className="text-foreground">Flow</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Neural Study Ecosystem</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.title}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 w-full ${
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_hsl(263,70%,50%/0.3)]" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <button
          onClick={() => {
            localStorage.removeItem('vityarthi_token');
            localStorage.removeItem('vityarthi_user');
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all w-full group"
        >
          <LogOut className="h-4 w-4 group-hover:text-red-400" />
          <span>Logout Session</span>
        </button>
        <div className="h-px bg-white/5" />
        <ThemeToggle />
        <StreakCounter />
      </div>
    </aside>
  );
}

function StreakCounter() {
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    getContributions().then(res => {
      setStreak(res.data.current_streak || 0);
    }).catch(() => setStreak(0));
  }, []);

  return (
    <div className="glass-card p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Study streak</p>
      <p className="text-2xl font-bold glow-text-cyan mt-1">{streak} {streak === 1 ? 'day' : 'days'}</p>
      <div className="h-1 rounded-full bg-secondary mt-3 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((streak / 30) * 100, 100)}%` }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(185,80%,55%)]" 
        />
      </div>
    </div>
  );
}
