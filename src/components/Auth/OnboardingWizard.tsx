import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { updateProfile } from '../../services/api';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS = ['Identity', 'Welcome', 'About You', 'Your Goals', 'Subjects'];
const SUBJECTS = ['DSA', 'Math', 'Machine Learning', 'Programming', 'Physics', 'Chemistry', 'History', 'Language', 'Data Science', 'Web Dev'];

export default function OnboardingWizard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [age, setAge] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [goalsText, setGoalsText] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [faceSnapshot, setFaceSnapshot] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [saving, setSaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const toggleSubject = (s: string) =>
    setSelectedSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const finish = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: name,
        age: age ? parseInt(age) : null,
        goals_text: goalsText,
        subjects: JSON.stringify(selectedSubjects),
        face_id_snapshot: faceSnapshot,
        onboarded: true,
      });
      updateUser({ onboarded: true });
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      console.error("Webcam failed", e);
    }
  };

  const captureSignature = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, -canvas.width, 0);
      const b64 = canvas.toDataURL("image/jpeg", 0.8);
      setFaceSnapshot(b64);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      setEnrolling(false);
    }
  };

  useEffect(() => {
    if (step === 0) startWebcam();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [step]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <div className="glass-card w-full max-w-lg p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <motion.div 
            className="h-full bg-primary shadow-[0_0_10px_hsl(263,70%,60%)]" 
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {step === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/20 p-2 rounded-lg"><Camera className="w-5 h-5 text-primary" /></div>
              <h2 className="text-xl font-bold tracking-tight glow-text font-mono">Neural Enrollment</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Register your neural signature. This allows the AI to uniquely identify you and lock focus sessions to your presence only.
            </p>
            
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
              {!faceSnapshot ? (
                <>
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[180px] h-[240px] border-2 border-dashed border-primary/40 rounded-[4rem]" />
                  </div>
                </>
              ) : (
                <img src={faceSnapshot} className="w-full h-full object-cover" alt="Signature" />
              )}
            </div>

            {!faceSnapshot ? (
              <button 
                className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-all glow-btn flex items-center justify-center gap-2"
                onClick={captureSignature}
              >
                Capture Signature
              </button>
            ) : (
              <div className="flex gap-4">
                <button 
                  className="px-6 py-3 rounded-xl bg-secondary text-muted-foreground font-medium hover:text-white transition-colors"
                  onClick={() => { setFaceSnapshot(null); startWebcam(); }}
                >
                  Retake
                </button>
                <button 
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-bold glow-btn"
                  onClick={() => setStep(1)}
                >
                  Proceed to Welcome
                </button>
              </div>
            )}
          </motion.div>
        )}

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-3xl font-bold tracking-tight glow-text">Welcome to NeuroFlow, {user?.name?.split(' ')[0] || 'Student'}!</h2>
            <p className="text-muted-foreground leading-relaxed">
              Neural Signature Verified. Your high-performance study environment is being initialized.
            </p>
            <div className="flex gap-4 pt-4">
               <button className="px-6 py-3 rounded-xl bg-secondary text-muted-foreground font-medium hover:text-white transition-colors" onClick={() => setStep(0)}>Back</button>
               <button 
                className="flex-1 py-4 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-all glow-btn flex items-center justify-center gap-2"
                onClick={() => setStep(2)}
              >
                Initialize Profile <span className="text-lg">→</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="text-5xl mb-4">🧑‍🎓</div>
            <h2 className="text-2xl font-bold glow-text">About You</h2>
            <p className="text-muted-foreground text-sm">Tell us a little about yourself to tailor the engine.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Display Name</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all placeholder:text-white/20" 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Your Age</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all placeholder:text-white/20" 
                  type="number" 
                  placeholder="e.g. 20" 
                  min="10" 
                  max="60" 
                  value={age} 
                  onChange={e => setAge(e.target.value)} 
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button className="px-6 py-3 rounded-xl bg-secondary text-muted-foreground font-medium hover:text-white transition-colors" onClick={() => setStep(1)}>Back</button>
              <button className="flex-1 py-3 rounded-xl bg-primary text-white font-bold glow-btn" onClick={() => setStep(3)}>Continue</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold glow-text-pink">Your Goals</h2>
            <p className="text-muted-foreground text-sm">What do you want to achieve? Your AI advisor will use this context.</p>
            
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:bg-white/10 transition-all placeholder:text-white/20 resize-none"
              placeholder="e.g. Crack GATE 2027, finish my research paper, learn Web Dev..."
              value={goalsText}
              onChange={e => setGoalsText(e.target.value)}
              rows={4}
            />

            <div className="flex gap-4 pt-6">
              <button className="px-6 py-3 rounded-xl bg-secondary text-muted-foreground font-medium hover:text-white transition-colors" onClick={() => setStep(2)}>Back</button>
              <button className="flex-1 py-3 rounded-xl bg-[hsl(330,80%,60%)] text-white font-bold shadow-[0_0_20px_hsl(330,80%,60%/0.3)]" onClick={() => setStep(4)}>Next Step</button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-2xl font-bold glow-text-cyan">Subjects of Mastery</h2>
            <p className="text-muted-foreground text-sm">Pick your focus areas — we'll tailor resources for you.</p>
            
            <div className="flex flex-wrap gap-2 py-4">
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                    selectedSubjects.includes(s) 
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                      : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/30'
                  }`}
                  onClick={() => toggleSubject(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-4 pt-6">
              <button className="px-6 py-3 rounded-xl bg-secondary text-muted-foreground font-medium hover:text-white transition-colors" onClick={() => setStep(step - 1)}>Back</button>
              <button 
                className="flex-1 py-3 rounded-xl bg-cyan-600 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50" 
                onClick={finish} 
                disabled={saving}
              >
                {saving ? 'Syncing Neural Profile...' : '🚀 Launch Dashboard!'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
