import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../services/auth';
import api from '../../services/api';
import NeuralNetworkBackground from './NeuralNetworkBackground';

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credential: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/google', { credential });
      const { access_token, user } = res.data;
      login(access_token, user);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
       const message = err.message;
      setError(`Auth Sync Failure: ${detail || message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#020205] selection:bg-primary/30">
      <NeuralNetworkBackground />
      
      {/* Decorative Blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px] relative z-20 px-6"
      >
        <div className="glass-card p-12 relative overflow-hidden group shadow-[0_0_80px_rgba(0,0,0,0.6)] border-white/5 flex flex-col items-center bg-black/40 backdrop-blur-2xl">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="mb-10">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-4 rounded-3xl bg-primary/10 border border-primary/20 shadow-[0_0_30px_rgba(139,92,246,0.2)]"
            >
              <Brain className="h-10 w-10 text-primary" />
            </motion.div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-black tracking-tighter mb-2 text-white italic">
              Neuro<span className="text-primary not-italic">Flow</span>
            </h1>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.5em] ml-1">
              Neural Sync Protocol
            </p>
          </div>

          <div className="w-full space-y-8">
            <div className="flex justify-center">
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <span className="text-[11px] font-bold text-primary/60 uppercase tracking-widest animate-pulse">
                    Synchronizing...
                  </span>
                </div>
              ) : (
                <GoogleLogin 
                  onSuccess={(res) => res.credential && handleGoogleSuccess(res.credential)}
                  onError={() => setError('Google Authentication Failed')}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  width="300"
                />
              )}
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-10 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-4"
              >
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-red-100/70 leading-relaxed font-mono">
                  <span className="text-red-500 font-bold uppercase block mb-1">SYNC ERROR:</span>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-12 pt-8 border-t border-white/5 w-full">
            <div className="flex justify-between items-center opacity-30 text-[9px] font-mono uppercase tracking-widest">
              <span>Secure Link v2.0</span>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              </div>
            </div>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
