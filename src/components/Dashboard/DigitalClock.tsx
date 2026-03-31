import { useState, useEffect } from "react";

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="flex flex-col items-end">
      <div className="text-2xl font-bold font-mono glow-text tracking-tighter">
        {timeString}
      </div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">
        {timeZone.replace('_', ' ')}
      </div>
    </div>
  );
}
