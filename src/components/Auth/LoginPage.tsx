import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, ShieldCheck, Mail, Lock, User, LogIn, Github, Activity, LayoutDashboard, AlertCircle, Loader2 } from 'lucide-react';
import FloatingOrbs from '../FloatingOrbs';

const features = [
  { icon: <Brain className="h-4 w-4" />, label: 'AI Advisor' },
  { icon: <Activity className="h-4 w-4" />, label: 'Face Scan' },
  { icon: <Sparkles className="h-4 w-4" />, label: 'Smart Lofi' },
  { icon: <LayoutDashboard className="h-4 w-4" />, label: 'Daily Goals' },
];

const GOOGLE_LOGO = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI0ZGQzEwNyIgZD0iTTQzLjYxMSwyMC4wODNINDJWMjBIMjR2OGgxMS4zMDNjLTEuNjQ5LDQuNjU3LTYuMDgsMC04LTEyLjAzNyIvPjxwYXRoIGZpbGw9IiNGRjNEMDAiIGQ9Ik02LjMwNiwzMS42MzZsNi41NzEtNC44MThDMTQuNjU2LDMwLjE0LDE5LjA3OCwzMiwyNCwzMmM0Ljg3OSwwLDkuMjEtMS44MDgsMTIuNTI5LTQuNzM2bDYuODc0LDQuNjk2QzM5LjEyNCw0MS40MDgsMzIuMDE3LDQ0LDI0LDQ0QzE2LjM5OCw0NCw5LjY1Miw0MS4wMDYsNi4zMDYsMzEuNjM2eiIvPjxwYXRoIGZpbGw9IiM0Q0FGNTAiIGQ9Ik0yNCw0NGM3LjQ3NSwwLDEzLjkzLTIuNjY3LDE4LjgxNy02Ljk4bC03LjE4NC00Ljg5QzMzLjE5MSwzNS4xODksMjguNzI0LDM2LDI0LDM2Yy00Ljg0MywwLTkuMzctMS45MzYtMTIuNTQzLTUuMDE0TDUsMzUuNzdDOS41ODksNDAuNTQ2LDE2LjQxNiw0NCwyNCw0NHoiLz48cGF0aCBmaWxsPSIjMTU2NUMwIiBkPSJNNDMuNjExLDIwLjA4M0g0MlYyMEgyNHY4aDExLjMwM0MzMy40MDcsMzEuMzU5LDI5LjEzLDM0LDI0LDM0Yy02LjYyNywwLTEyLTUuMzczLTEyLTEyczUuMzczLTEyLDEyLTEyYzMuMDU5LDAsNS44NDIsMS4xNTQsNy45NjEsMy4wMzlsNS42NTctNS42NThDMzguNzQsOC4zNzUsMzEuNzA0LDUsMjQsNUMxMi45NSw1LDQsMTMuOTUsNCwyNXM4Ljk1LDIwLDIwLDIwYzExLjA0NSwwLDE4LjgxOS04LjU2NywxOC44MTktMjAuNjY5Yy0uMDAyLTEwLjAzNi04Ljc4Mi0xOS4zMTQtMTkuMjA4LTE5LjMxNHoiLz48L3N2Zz4=`;

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      return setError('Please fill all required fields.');
    }
    setLoading(true);
    setError('');
    try {
      const res = isRegister 
        ? await emailRegister({ email, password, name })
        : await emailLogin({ email, password });
      login(res.data.access_token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      setLoading(true);
      setError('');
      try {
        // Send the auth code to backend — backend exchanges it for user info
        const res = await authGoogle(codeResponse.code);
        const { access_token, user } = res.data;
        login(access_token, user);
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
        setError(msg || 'Login failed. Make sure the Python backend is running on port 8000.');
      } finally {
        setLoading(false);
      }
    },
    onError: (err) => {
      console.error('Google login error:', err);
      setError('Google sign-in was cancelled or failed. Please try again.');
    },
  });

  return (
    <div className="mesh-gradient-bg flex items-center justify-center p-4">
      <FloatingOrbs />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] relative z-20"
      >
        <div className="glass-card p-10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Logo Area */}
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
              className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 border border-primary/30"
            >
              <Brain className="h-8 w-8 glow-text" />
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tighter mb-2">
              <span className="gradient-text">AI Vityarthi</span>
            </h1>
            <p className="text-muted-foreground text-sm text-center">
              Elevate your focus with neural study patterns.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {features.map((f, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/30 text-[10px] uppercase tracking-widest font-bold text-muted-foreground"
              >
                {f.icon} {f.label}
              </motion.span>
            ))}
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
            {isRegister && (
              <div className="relative group">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  disabled={loading}
                  className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-secondary/80 transition-all"
                />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                disabled={loading}
                className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-secondary/80 transition-all"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                disabled={loading}
                className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-secondary/80 transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-primary hover:opacity-90 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(99,102,241,0.5)] glow-btn"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {loading ? 'Processing...' : (isRegister ? 'Create Scholar Account' : 'Authenticate')}
            </button>
          </form>

          <div className="text-center mb-8">
            <button 
              type="button" 
              onClick={() => setIsRegister(!isRegister)} 
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {isRegister ? 'Already registered? System Login' : 'New Scholar? Register Profile'}
            </button>
          </div>

          <div className="relative flex items-center gap-4 mb-8">
            <div className="h-px bg-border flex-1" />
            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">Neural Sync</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <button
            onClick={() => googleLogin()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-white/90 transition-all border border-white/20"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <img src={GOOGLE_LOGO} alt="Google" className="h-4 w-4" />}
            {loading ? 'Syncing...' : 'Continue with Google'}
          </button>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3"
              >
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-red-200 leading-relaxed">
                  {error.includes('redirect_uri') 
                    ? "Auth Error: Redirect URI Mismatch. Check your Google Console." 
                    : error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-[10px] text-muted-foreground/60 text-center uppercase tracking-widest leading-loose">
              Security Protocol 0.82-B ACTIVE<br/>
              No plaintext passwords stored.
            </p>
            <div className="flex gap-4">
              <Github className="h-3 w-3 text-muted-foreground hover:text-white cursor-pointer transition-colors" />
              <ShieldCheck className="h-3 w-3 text-muted-foreground hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
