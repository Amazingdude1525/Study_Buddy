import { LayoutDashboard, ScanFace, BookOpen, Music, TerminalSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Focus Mode", path: "/focus", icon: ScanFace },
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
          <span className="glow-text">Study</span>
          <span className="text-foreground">AI</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">AI-Powered Learning</p>
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

      <div className="mt-auto space-y-3">
        <ThemeToggle />
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Study streak</p>
          <p className="text-2xl font-bold glow-text-cyan mt-1">12 days</p>
          <div className="h-1 rounded-full bg-secondary mt-3 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-[hsl(185,80%,55%)]" />
          </div>
        </div>
      </div>
    </aside>
  );
}
