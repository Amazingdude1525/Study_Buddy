import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../services/auth';
import { analyzeSentiment, suggestMusic } from '../../services/api';
import { Camera, RefreshCw } from 'lucide-react';

const MOOD_EMOJIS: Record<string, string> = {
  happy: '😄', sad: '😢', angry: '😤', focused: '🧠', neutral: '😐', surprised: '😮',
};

const MOOD_COLORS: Record<string, string> = {
  happy: '#f59e0b', sad: '#6366f1', angry: '#ef4444', focused: '#10b981', neutral: '#6b7280',
};

interface Props {
  onMoodChange?: (mood: string) => void;
}

export default function FaceMoodWidget({ onMoodChange }: Props) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mood, setMood] = useState('focused');
  const [scanning, setScanning] = useState(false);
  const [camActive, setCamActive] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      if (videoRef.current) { videoRef.current.srcObject = stream; }
      setCamActive(true);
      setError('');
    } catch {
      setError('Camera access denied');
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamActive(false);
  };

  const scanMood = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    canvasRef.current.width = 320;
    canvasRef.current.height = 240;
    ctx.drawImage(videoRef.current, 0, 0, 320, 240);
    const b64 = canvasRef.current.toDataURL('image/jpeg', 0.7);
    setScanning(true);
    try {
      const res = await analyzeSentiment(b64);
      const { dominant_emotion, mood_category, scores: sc } = res.data;
      setMood(mood_category || dominant_emotion);
      setScores(sc || {});
      onMoodChange?.(mood_category || dominant_emotion);
    } catch {
      // Backend unavailable — mock
      setMood('focused');
    } finally {
      setScanning(false);
    }
  }, [onMoodChange]);

  // Auto-scan every 30s when camera is active
  useEffect(() => {
    if (!camActive) return;
    const id = setInterval(scanMood, 30000);
    return () => clearInterval(id);
  }, [camActive, scanMood]);

  const moodColor = MOOD_COLORS[mood] || 'var(--accent)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div className="mood-ring" style={{ borderColor: moodColor }}>
        {MOOD_EMOJIS[mood] || '🧠'}
      </div>
      <div className="mood-info" style={{ flex: 1 }}>
        <div className="mood-label" style={{ color: moodColor }}>
          {mood.charAt(0).toUpperCase() + mood.slice(1)}
        </div>
        <div className="mood-sub">
          {camActive ? 'Camera active · auto-scan every 30s' : 'Enable camera to detect mood'}
        </div>
        {Object.keys(scores).length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            {Object.entries(scores).slice(0, 3).map(([k, v]) => (
              <span key={k} className="badge badge-accent" style={{ fontSize: '10px' }}>
                {k}: {v.toFixed(0)}%
              </span>
            ))}
          </div>
        )}
        {error && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4 }}>{error}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {!camActive ? (
          <button className="btn btn-primary btn-sm" onClick={startCamera}>
            <Camera size={14} /> Scan
          </button>
        ) : (
          <>
            <button className="btn btn-primary btn-sm" onClick={scanMood} disabled={scanning}>
              <RefreshCw size={14} className={scanning ? 'spinner' : ''} />
              {scanning ? '...' : 'Scan'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={stopCamera}>Off</button>
          </>
        )}
      </div>
      <video ref={videoRef} autoPlay muted style={{ width: 0, height: 0, position: 'absolute' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
