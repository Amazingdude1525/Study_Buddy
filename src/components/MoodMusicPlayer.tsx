import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";

const tracks = [
  { title: "Deep Focus Alpha Waves", artist: "StudyAI", duration: "3:42" },
  { title: "Ambient Rain Study", artist: "Nature Sounds", duration: "5:18" },
  { title: "Lo-Fi Concentration", artist: "ChillBeats", duration: "4:05" },
];

interface MoodMusicPlayerProps {
  hidden: boolean;
}

export default function MoodMusicPlayer({ hidden }: MoodMusicPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const track = tracks[trackIndex];
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, trackIndex]);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-0 left-64 right-0 z-30"
        >
          <div className="glass-player px-6 py-3 flex items-center gap-6">
            {/* Track info */}
            <div className="flex items-center gap-3 min-w-0 w-1/4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center shrink-0">
                <Volume2 className="h-4 w-4 glow-text" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 flex-1 justify-center">
              <button
                onClick={() => setTrackIndex((i) => (i - 1 + tracks.length) % tracks.length)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPlaying(!playing)}
                className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center glow-btn"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </motion.button>
              <button
                onClick={() => setTrackIndex((i) => (i + 1) % tracks.length)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 w-1/4 justify-end">
              <span className="text-xs text-muted-foreground mono-font">1:24</span>
              <div className="h-1 w-24 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(185,80%,55%)]"
                  animate={playing ? { width: ["37%", "100%"] } : {}}
                  transition={playing ? { duration: 120, ease: "linear" } : {}}
                  style={{ width: "37%" }}
                />
              </div>
              <span className="text-xs text-muted-foreground mono-font">{track.duration}</span>
            </div>
          </div>
          <audio ref={audioRef} src="https://streams.ilovemusic.de/iloveradio17.mp3" loop preload="none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
