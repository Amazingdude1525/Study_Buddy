import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace, X, Sparkles, ChevronDown } from "lucide-react";
import NeuralNetworkOverlay from "./NeuralNetworkOverlay";
import { analyzeSentiment } from "../services/api";

interface FaceScannerProps {
  onScanStateChange: (active: boolean) => void;
}

const moods = [
  { label: "Focused", value: "focused" },
  { label: "Happy", value: "happy" },
  { label: "Sad", value: "sad" },
  { label: "Angry", value: "angry" },
  { label: "Calm", value: "calm" },
  { label: "Energized", value: "energized" },
  { label: "Curious", value: "curious" },
  { label: "Determined", value: "determined" },
];

export default function FaceScanner({ onScanStateChange }: FaceScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [moodDropdownOpen, setMoodDropdownOpen] = useState(false);
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>("all");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Once scanning turns on and video element mounts, attach the stream
  useEffect(() => {
    if (scanning && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [scanning]);

  const startScan = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      // First set scanning=true so the <video> element mounts
      setScanning(true);
      setShowResult(false);
      setEmotion(null);
      onScanStateChange(true);

      // Capture frame after the neural network animation plays for a few seconds
      setTimeout(async () => {
        if (!videoRef.current) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext("2d");

        let detected = "Focused";
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0);
          const b64 = canvas.toDataURL("image/jpeg", 0.7);
          try {
            const res = await analyzeSentiment(b64);
            const dom = res.data.dominant_emotion || "focused";
            if (dom === "No Human Face Detected" || dom === "No Face Detected" || dom === "Camera/Analysis Error") {
              detected = "Face not detectable";
            } else {
              const match = moods.find(m => m.value.includes(dom) || dom.includes(m.value));
              detected = match ? match.label : (dom.charAt(0).toUpperCase() + dom.slice(1));
            }
          } catch (e) {
            console.error("Sentiment backend failed", e);
          }
        }

        setEmotion(detected);
        setShowResult(true);
        stopScan();
      }, 5000);
    } catch {
      console.error("Camera access denied");
    }
  }, [onScanStateChange]);

  const stopScan = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
    onScanStateChange(false);
  }, [onScanStateChange]);

  return (
    <>
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={stopScan}
          />
        )}
      </AnimatePresence>

      <div className="glass-card p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ScanFace className="h-5 w-5 glow-text-cyan" />
            <h3 className="font-semibold text-sm">Focus Scanner</h3>
          </div>

          <div className="relative">
            <button
              onClick={() => setMoodDropdownOpen(!moodDropdownOpen)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary/50"
            >
              <span>{selectedMoodFilter === "all" ? "All Moods" : moods.find(m => m.value === selectedMoodFilter)?.label}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            <AnimatePresence>
              {moodDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full mt-1 z-50 glass-card p-1 min-w-[140px] shadow-xl"
                >
                  <button
                    onClick={() => { setSelectedMoodFilter("all"); setMoodDropdownOpen(false); }}
                    className="w-full text-left text-xs px-3 py-1.5 rounded-md hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    All Moods
                  </button>
                  {moods.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => { setSelectedMoodFilter(m.value); setMoodDropdownOpen(false); }}
                      className="w-full text-left text-xs px-3 py-1.5 rounded-md hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {m.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {scanning && (
            <button onClick={stopScan} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {moods.slice(0, 5).map((m) => (
            <span key={m.value} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/40 text-muted-foreground border border-border/30">
              {m.label}
            </span>
          ))}
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/40 text-muted-foreground border border-border/30">
            +{moods.length - 5} more
          </span>
        </div>

        {!scanning && !showResult && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startScan}
            className="glow-btn w-full py-3 rounded-lg bg-primary/20 border border-primary/30 text-primary-foreground font-medium text-sm"
          >
            Scan Face
          </motion.button>
        )}

        <AnimatePresence>
          {showResult && emotion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20"
            >
              <Sparkles className="h-5 w-5 glow-text" />
              <div>
                <p className="text-xs text-muted-foreground">Emotion Detected</p>
                <p className="font-bold glow-text text-lg">{emotion}</p>
              </div>
              <button
                onClick={() => { setShowResult(false); setEmotion(null); }}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              >
                Scan Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full-screen scanner overlay with webcam + neural network */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8"
          >
            <div className="relative w-full max-w-xl aspect-[4/3] rounded-2xl overflow-hidden border-2 border-primary/40 shadow-2xl shadow-primary/30">
              {/* Live webcam feed */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{ transform: "scaleX(-1)" }}
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              {/* Neural network animation overlaid on top of face */}
              <NeuralNetworkOverlay />
              
              {/* Red-Net Mask Overlay (Cyberpunk Scanner) */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              <div className="absolute inset-0 bg-red-500/10 animate-[pulse_2s_ease-in-out_infinite] mix-blend-screen pointer-events-none" />
              {/* Scanning line */}
              <div className="scanner-line bg-red-500/50 shadow-[0_0_20px_red]" />
              {/* Corner brackets */}
              {[
                "top-3 left-3 border-t-2 border-l-2",
                "top-3 right-3 border-t-2 border-r-2",
                "bottom-3 left-3 border-b-2 border-l-2",
                "bottom-3 right-3 border-b-2 border-r-2",
              ].map((cls, i) => (
                <div key={i} className={`absolute w-8 h-8 border-primary/70 ${cls}`} />
              ))}
              {/* Status text */}
              <div className="absolute bottom-6 left-0 right-0 text-center z-20">
                <span className="mono-font text-sm glow-text-cyan tracking-widest uppercase bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  Analyzing Focus...
                </span>
              </div>
              {/* Close button */}
              <button
                onClick={stopScan}
                className="absolute top-3 right-12 z-30 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
