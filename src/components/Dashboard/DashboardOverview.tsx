import { useAuth } from "../../services/auth";
import StatsWidget from "../StatsWidget";
import DigitalClock from "./DigitalClock";
import { motion } from "framer-motion";
import { Activity, Zap, Target, Flame } from "lucide-react";
import ContributionGraph from "../Contributions/ContributionGraph";

export default function DashboardOverview() {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 pb-10">
      {/* Dynamic Hero Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden glass-card p-10 border-none bg-gradient-to-br from-primary/10 via-background to-black"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Zap className="h-48 w-48 text-primary animate-pulse" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                Rank: Neural Core {user?.level || 1}
              </span>
              <div className="flex items-center gap-1.5 text-orange-400">
                <Flame className="h-4 w-4 fill-orange-400/20" />
                <span className="text-xs font-bold font-mono">{user?.streak || 0} DAY STREAK</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Welcome back,<br/>
              <span className="gradient-text">{user?.name || "Scholar"}</span>
            </h1>
            
            <div className="flex items-center gap-4 pt-2">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                     #{i}
                   </div>
                 ))}
               </div>
               <span className="text-xs text-muted-foreground font-medium italic opacity-60">
                 You are in the top 12% this week
               </span>
            </div>
          </div>
          
          <div className="glass-card p-6 border-white/5 bg-black/40 shadow-2xl backdrop-blur-xl">
             <DigitalClock />
             <div className="mt-4 pt-4 border-t border-white/5 flex gap-6">
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">XP Points</p>
                  <p className="text-xl font-black glow-text-cyan">{user?.xp || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Global Level</p>
                  <p className="text-xl font-black glow-text-pink">{user?.level || 1}</p>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats column */}
        <div className="lg:col-span-2 space-y-6">
           <ContributionGraph />
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-8 group hover:bg-white/5 transition-colors cursor-pointer">
                <h3 className="font-black text-xs text-muted-foreground uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                   <Target className="h-4 w-4 text-pink-500" /> Goal Trajectory
                </h3>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div animate={{ width: '65%' }} className="h-full bg-pink-500 shadow-[0_0_15px_pink]" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You've completed <span className="text-white font-bold">4 out of 6</span> weekly challenges.
                  </p>
                </div>
              </div>

              <div className="glass-card p-8 group hover:bg-white/5 transition-colors cursor-pointer">
                <h3 className="font-black text-xs text-muted-foreground uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                   <Activity className="h-4 w-4 text-cyan-400" /> Focus Efficiency
                </h3>
                <div className="flex items-end gap-1 h-12">
                   {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                     <motion.div 
                       key={i}
                       initial={{ height: 0 }}
                       animate={{ height: `${h}%` }}
                       transition={{ delay: i * 0.05 }}
                       className="flex-1 bg-cyan-400/40 rounded-t-sm"
                     />
                   ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Efficiency is <span className="text-cyan-400 font-bold">+12%</span> higher today.
                </p>
              </div>
           </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
           <div className="glass-card p-8 border-t-primary/30">
              <h3 className="font-bold text-xs uppercase tracking-widest mb-6 glow-text-cyan flex items-center gap-2">
                <Zap className="h-4 w-4" /> Neuro Signals
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-1 bg-primary/40 rounded-full shadow-[0_0_10px_purple]" />
                  <div>
                    <p className="text-[11px] font-black uppercase text-primary mb-1">Peak Flow</p>
                    <p className="text-xs text-muted-foreground">Highest concentration detected at 10:45 AM.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-1 bg-cyan-400/40 rounded-full shadow-[0_0_10px_cyan]" />
                  <div>
                    <p className="text-[11px] font-black uppercase text-cyan-400 mb-1">Study Alert</p>
                    <p className="text-xs text-muted-foreground">It's time for spaced repetition of Physics.</p>
                  </div>
                </div>
              </div>
           </div>

           <div className="glass-card p-8 border-l-orange-500/20">
              <StatsWidget />
           </div>
        </div>
      </div>
    </div>
  );
}
