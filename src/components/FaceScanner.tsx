import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Sparkles, ChevronDown, ShieldCheck, ShieldAlert, Smile, Frown, Meh, Zap } from "lucide-react";
import NeuralNetworkOverlay from "./NeuralNetworkOverlay";
import { analyzeSentiment } from "../services/api";
import { useAuth } from "../services/auth";

interface FaceScannerProps {
  onScanStateChange: (active: boolean) => void;
}

const faceapi = (window as any).faceapi;

export default function FaceScanner({ onScanStateChange }: FaceScannerProps) {
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [emotion, setEmotion] = useState<string>("Initializing...");
  const [isMatched, setIsMatched] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [detection, setDetection] = useState<any>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const referenceDescriptor = useRef<Float32Array | null>(null);

  // Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log("NeuroFlow Biometric Models Synced.");
      } catch (e) {
        console.error("Model load failed", e);
      }
    };
    if (faceapi) loadModels();
  }, []);

  // Compute reference descriptor from onboarding photo if exists
  useEffect(() => {
    const enroll = async () => {
      if (user?.face_id_snapshot && modelsLoaded) {
        const img = new Image();
        img.src = user.face_id_snapshot;
        img.onload = async () => {
          const result = await faceapi.allFacesTiny(img, new faceapi.TinyFaceDetectorOptions());
          if (result?.[0]?.descriptor) {
            referenceDescriptor.current = result[0].descriptor;
            console.log("Identity Fingerprint Cached.");
          }
        };
      }
    };
    enroll();
  }, [user, modelsLoaded]);

  const startScan = useCallback(async () => {
    if (!modelsLoaded) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setScanning(true);
      setShowResult(false);
      onScanStateChange(true);
    } catch {
      console.error("Camera binary link denied");
    }
  }, [modelsLoaded, onScanStateChange]);

  useEffect(() => {
    if (scanning && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [scanning]);

  const stopScan = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
    onScanStateChange(false);
  }, [onScanStateChange]);

  // Real-time detection loop
  useEffect(() => {
    let animationId: number;
    const runDetection = async () => {
      if (scanning && videoRef.current && videoRef.current.readyState === 4) {
        const result = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptor();

        if (result) {
          setDetection(result);
          // Compare with reference
          if (referenceDescriptor.current && result.descriptor) {
            const distance = faceapi.euclideanDistance(referenceDescriptor.current, result.descriptor);
            setIsMatched(distance < 0.6);
          } else {
            setIsMatched(true); // Default to true if no reference (first run)
          }

          // Get dominant emotion
          const expr = result.expressions;
          const best = Object.entries(expr).sort((a: any, b: any) => b[1] - a[1])[0];
          setEmotion(best[0].toUpperCase());
        } else {
          setDetection(null);
          setEmotion("No Face Detected");
          setIsMatched(null);
        }
      }
      animationId = requestAnimationFrame(runDetection);
    };
    if (scanning) runDetection();
    return () => cancelAnimationFrame(animationId);
  }, [scanning]);

  return (
    <>
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] pointer-events-none"
            style={{ 
              background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)" 
            }}
          />
        )}
      </AnimatePresence>

      <div className="glass-card p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 glow-text-cyan" />
            <h3 className="font-semibold text-sm">Focus Scanner</h3>
          </div>
          {scanning && (
            <button onClick={stopScan} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 py-2">
          {!scanning && !showResult && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={startScan}
              disabled={!modelsLoaded}
              className="glow-btn w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {modelsLoaded ? "Initialize Scanner" : "Loading Neural Models..."}
            </motion.button>
          )}

          {scanning && (
            <div className="w-full space-y-4">
               <div className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-2">
                    {emotion === "HAPPY" ? <Smile className="h-4 w-4 text-green-400" /> : 
                     emotion === "SAD" ? <Frown className="h-4 w-4 text-blue-400" /> : <Meh className="h-4 w-4 text-primary" />}
                    <span className="text-[10px] font-bold tracking-widest text-white/80">{emotion}</span>
                  </div>
                  {isMatched === true && <ShieldCheck className="h-4 w-4 text-green-500 animate-pulse" />}
                  {isMatched === false && <ShieldAlert className="h-4 w-4 text-red-500 animate-bounce" />}
               </div>
               <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{ transform: "scaleX(-1)" }}
                    onLoadedMetadata={() => videoRef.current?.play()}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
                  <div className="scanner-line bg-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.8)]" />
               </div>
               <p className="text-[9px] text-center text-muted-foreground uppercase tracking-widest animate-pulse">
                 {isMatched === false ? "Identity Mismatch Detected" : "Neural Focus Active"}
               </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


