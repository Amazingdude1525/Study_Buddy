import { useState } from "react";
import FloatingOrbs from "../FloatingOrbs";
import AppSidebar from "../AppSidebar";
import Chatbot from "../Chatbot/Chatbot";
import FaceScanner from "../FaceScanner";
import PomodoroTimer from "../PomodoroTimer/PomodoroTimer";
import MoodMusicPlayer from "../MoodMusicPlayer";
import SubjectsPanel from "../SubjectsPanel";
import StatsWidget from "../StatsWidget";
import CodePlayground from "../CodePlayground/CodePlayground";
import { motion } from "framer-motion";
import { Activity, LogOut } from "lucide-react";
import { useAuth } from "../../services/auth";

export default function Dashboard() {
  const [scannerActive, setScannerActive] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="mesh-gradient-bg flex min-h-screen">
      <AppSidebar />

      <main className="flex-1 relative z-10 p-8 pb-24 overflow-y-auto w-full">
        {/* Header */}
        <motion.div
          id="dashboard-top"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 glow-text-cyan" />
              <span className="text-xs text-muted-foreground mono-font uppercase tracking-widest">Live Dashboard</span>
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

        {/* Masonry-ish grid */}
        <div className="grid grid-cols-4 gap-4 auto-rows-min">
          {/* Stats row */}
          <StatsWidget />

          {/* Focus Column: Scanner + Chatbot */}
          <div className="col-span-2 flex flex-col gap-4" id="focus-scanner">
            <FaceScanner onScanStateChange={setScannerActive} />
            <div className="glass-card flex-1 overflow-hidden" style={{ minHeight: "450px" }}>
              <Chatbot />
            </div>
          </div>

          {/* Focus Timer */}
          <div className="col-span-2">
            <PomodoroTimer subject="Deep Work" />
          </div>

          {/* Subjects panel - spans 2 cols */}
          <div id="subjects-panel" className="col-span-2">
            <SubjectsPanel />
          </div>

          {/* AI Insights */}
          <div className="col-span-2 glass-card p-6">
            <h3 className="font-semibold text-sm mb-4">AI Insights</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/15">
                <p className="text-xs glow-text font-medium">Peak Performance Window</p>
                <p className="text-xs text-muted-foreground mt-1">Your focus peaks between 2-4 PM. Schedule difficult topics here.</p>
              </div>
              <div className="p-3 rounded-lg bg-[hsl(185,80%,55%)]/10 border border-[hsl(185,80%,55%)]/15">
                <p className="text-xs glow-text-cyan font-medium">Study Pattern</p>
                <p className="text-xs text-muted-foreground mt-1">You retain 23% more with spaced repetition. Try 25-min blocks.</p>
              </div>
            </div>
          </div>

          {/* Programmiz Code Console */}
          <div className="col-span-4 mt-6 glass-card overflow-hidden" style={{ height: "600px" }}>
            <div className="p-4 border-b border-border/40 bg-secondary/20 flex items-center justify-between">
              <h3 className="font-semibold text-sm glow-text-cyan">Programmiz Console</h3>
              <span className="text-xs text-muted-foreground mono-font">Python Terminal</span>
            </div>
            <div className="h-full pb-12 overflow-y-auto">
              <CodePlayground />
            </div>
          </div>
        </div>
      </main>

      <div id="music-player">
        <MoodMusicPlayer hidden={scannerActive} />
      </div>
    </div>
  );
}
