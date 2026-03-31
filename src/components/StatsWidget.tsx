import { motion } from "framer-motion";
import { Brain, Clock, Zap, Target } from "lucide-react";

const stats = [
  { label: "Focus Score", value: "94%", icon: Brain, glow: "glow-text" },
  { label: "Study Hours", value: "6.5h", icon: Clock, glow: "glow-text-cyan" },
  { label: "Streak", value: "12d", icon: Zap, glow: "glow-text-pink" },
  { label: "Goals Met", value: "8/10", icon: Target, glow: "glow-text-cyan" },
];

export default function StatsWidget() {
  return (
    <>
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <s.icon className={`h-5 w-5 ${s.glow}`} />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mono-font">Live</span>
          </div>
          <p className={`text-2xl font-bold ${s.glow}`}>{s.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
        </motion.div>
      ))}
    </>
  );
}
