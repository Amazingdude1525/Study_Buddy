import { motion } from "framer-motion";
import { Activity, LogOut } from "lucide-react";
import { useAuth } from "../../services/auth";
import StatsWidget from "../StatsWidget";

export default function DashboardOverview() {
  const { user, logout } = useAuth();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 glow-text-cyan" />
            <span className="text-xs text-muted-foreground mono-font uppercase tracking-widest">Live Updates</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Good evening, <span className="glow-text">{user?.name || "Scholar"}</span>
          </h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quick schedule card */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-sm mb-4 glow-text-cyan">Today's Schedule</h3>
          <div className="space-y-3">
            {[
              { time: "09:00", subject: "Physics", status: "done" },
              { time: "11:00", subject: "Chemistry", status: "done" },
              { time: "14:00", subject: "React", status: "current" },
              { time: "16:00", subject: "Review", status: "upcoming" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="mono-font text-xs text-muted-foreground w-12">{item.time}</span>
                <div
                  className={`h-2 w-2 rounded-full ${
                    item.status === "done"
                      ? "bg-[hsl(185,80%,55%)]"
                      : item.status === "current"
                      ? "bg-[hsl(263,70%,60%)] animate-pulse shadow-[0_0_10px_hsl(263,70%,60%)]"
                      : "bg-muted-foreground/30"
                  }`}
                />
                <span className={`text-sm ${item.status === "current" ? "glow-text font-medium" : "text-muted-foreground"}`}>
                  {item.subject}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Insights & Notifications */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-sm mb-4 glow-text-pink">AI Insights</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[hsl(263,70%,50%)]/10 border border-[hsl(263,70%,50%)]/20 shadow-[0_0_15px_hsl(263,70%,50%/0.1)]">
              <p className="text-xs glow-text font-medium">Peak Performance Window</p>
              <p className="text-xs text-muted-foreground mt-1">Your focus peaks between 2-4 PM. Schedule difficult topics here.</p>
            </div>
            <div className="p-3 rounded-lg bg-[hsl(185,80%,55%)]/10 border border-[hsl(185,80%,55%)]/20 shadow-[0_0_15px_hsl(185,80%,55%/0.1)]">
              <p className="text-xs glow-text-cyan font-medium">Study Pattern</p>
              <p className="text-xs text-muted-foreground mt-1">You retain 23% more with spaced repetition. Try 25-min blocks.</p>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Squares Contribution Graph */}
      <GithubContributionGraph />

    </div>
  );
}

function GithubContributionGraph() {
  const weeks = 42;
  const days = 7;
  const squares = Array.from({length: weeks * days}).map(() => {
    const val = Math.random();
    return val > 0.8 ? 'bg-[rgba(168,85,247,0.8)] shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 
           val > 0.5 ? 'bg-[rgba(168,85,247,0.5)]' : 
           val > 0.2 ? 'bg-[rgba(168,85,247,0.3)]' : 
           'bg-black/20 border border-white/5';
  });

  return (
    <div className="glass-card p-6 border-t border-t-primary/20 bg-gradient-to-br from-background to-black/40">
      <h3 className="font-bold text-sm mb-4 glow-text-cyan flex items-center gap-2">
        <Activity className="h-4 w-4" /> Focus Contribution Graph
      </h3>
      <div className="flex gap-1.5 overflow-x-auto pb-4 scrollbar-hide opacity-80 hover:opacity-100 transition-opacity">
        {Array.from({length: weeks}).map((_, w) => (
          <div key={w} className="flex flex-col gap-1.5 hover:scale-105 transition-transform duration-200">
             {Array.from({length: days}).map((_, d) => (
               <div key={d} className={`w-3.5 h-3.5 rounded-sm ${squares[w * days + d]}`} title="Focus Sessions" />
             ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground font-mono justify-end">
        <span>Less</span>
        <div className="w-3.5 h-3.5 rounded-sm bg-black/20 border border-white/5"></div>
        <div className="w-3.5 h-3.5 rounded-sm bg-[rgba(168,85,247,0.3)]"></div>
        <div className="w-3.5 h-3.5 rounded-sm bg-[rgba(168,85,247,0.5)]"></div>
        <div className="w-3.5 h-3.5 rounded-sm bg-[rgba(168,85,247,0.8)] shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
        <span>More</span>
      </div>
    </div>
  );
}
