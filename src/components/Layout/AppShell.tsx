import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { useTheme } from '../../services/theme';
import MusicPlayer from '../MusicPlayer/MusicPlayer';
import {
  LayoutDashboard, Timer, Target, BookOpen, MessageSquare, Code, Sun, Moon, LogOut
} from 'lucide-react';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pomodoro', icon: Timer, label: 'Pomodoro' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/resources', icon: BookOpen, label: 'Resources' },
  { to: '/advisor', icon: MessageSquare, label: 'AI Advisor' },
  { to: '/playground', icon: Code, label: 'Playground' },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'S';

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1><span className="gradient-text">🎓 Vityarthi</span></h1>
          <span>AI Study Companion</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <Icon size={18} className="nav-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 4 }} onClick={toggle}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <div className="user-pill" onClick={handleLogout}>
            {user?.picture
              ? <img src={user.picture} alt="" className="user-avatar" />
              : <div className="user-avatar-placeholder">{initials}</div>
            }
            <div className="user-pill-text">
              <div className="user-pill-name">{user?.name}</div>
              <div className="user-pill-email">{user?.email}</div>
            </div>
            <LogOut size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <Outlet />
        <MusicPlayer />
      </div>
    </div>
  );
}
