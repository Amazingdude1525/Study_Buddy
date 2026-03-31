import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [light, setLight] = useState(() => document.documentElement.classList.contains("light"));

  useEffect(() => {
    if (light) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [light]);

  return (
    <button
      onClick={() => setLight(!light)}
      className="relative flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
    >
      <motion.div
        initial={false}
        animate={{ rotate: light ? 0 : 180 }}
        transition={{ type: "spring", damping: 15 }}
      >
        {light ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 glow-text-cyan" />}
      </motion.div>
      <span>{light ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
