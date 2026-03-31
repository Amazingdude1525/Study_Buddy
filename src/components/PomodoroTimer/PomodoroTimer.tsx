import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { startPomodoro, completePomodoro } from '../../services/api';

export default function PomodoroTimer({ subject = 'Focus' }: { subject?: string }) {
  const [durationMins, setDurationMins] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleComplete();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleStart = async () => {
    setIsActive(true);
    if (!sessionId) {
      try {
        const res = await startPomodoro({ subject, duration_min: durationMins });
        setSessionId(res.data.id);
      } catch (e) {
        console.error("Failed to start session on backend", e);
      }
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(durationMins * 60);
    setSessionId(null);
  };

  const handleComplete = async () => {
    setIsActive(false);
    if (sessionId) {
      try {
        await completePomodoro(sessionId, true);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          handleReset();
        }, 4000);
      } catch (e) {
        console.error("Failed to complete session on backend", e);
      }
    } else {
      handleReset();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-card z-10 flex flex-col items-center justify-center"
          >
            <CheckCircle2 className="h-12 w-12 text-primary mb-2" />
            <h3 className="text-lg font-bold">Goal Recorded!</h3>
            <p className="text-xs text-muted-foreground">+25 mins to contributions</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-xs text-muted-foreground font-medium mb-4 uppercase tracking-widest">{subject} Focus</div>
      
      <div className="flex gap-2 mb-6">
        {[15, 25, 45, 60].map(m => (
          <button
            key={m}
            onClick={() => {
              if (isActive) return;
              setDurationMins(m);
              setTimeLeft(m * 60);
            }}
            disabled={isActive}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              durationMins === m 
                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_hsl(263,70%,50%/0.3)]' 
                : 'bg-transparent border-white/10 text-muted-foreground hover:text-white'
            } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {m}m
          </button>
        ))}
      </div>

      <div className="text-6xl font-mono tracking-tighter font-bold mb-8 text-foreground">
        {formatTime(timeLeft)}
      </div>

      <div className="flex items-center gap-4">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            <Play className="h-4 w-4" /> Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 bg-secondary text-foreground px-6 py-2.5 rounded-md font-medium hover:bg-secondary/80 transition-colors"
          >
            <Pause className="h-4 w-4" /> Pause
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="p-2.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
