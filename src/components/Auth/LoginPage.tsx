import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../services/auth';
import { authGoogle, emailLogin, emailRegister } from '../../services/api';

const features = [
  { icon: '🧠', label: 'AI Study Advisor' },
  { icon: '😊', label: 'Face Mood Detection' },
  { icon: '🎵', label: 'Mood-Based Music' },
  { icon: '⏱️', label: 'Pomodoro Timer' },
  { icon: '📊', label: 'Contribution Graph' },
  { icon: '🎯', label: 'Goal Tracking' },
  { icon: '💻', label: 'Code Playground' },
  { icon: '📚', label: 'Study Resources' },
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
    <div className="login-page">
      <div className="login-bg" />

      {/* Animated background orbs */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${60 + i * 40}px`, height: `${60 + i * 40}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(99,102,241,${0.06 + i * 0.02}) 0%, transparent 70%)`,
          top: `${10 + i * 15}%`, left: `${5 + i * 14}%`,
          animation: `pulseRing ${3 + i}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
          pointerEvents: 'none',
        }} />
      ))}

      <div className="login-card glass-card fade-in">
        {/* Logo */}
        <div className="login-logo">🎓</div>
        <h1 className="login-title">
          <span className="gradient-text">AI Vityarthi</span>
        </h1>
        <p className="login-subtitle">
          Your AI-powered personal study companion.<br />
          Study smarter. Stay focused. Achieve more.
        </p>

        {/* Feature badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '32px' }}>
          {features.map(f => (
            <span key={f.label} className="badge badge-accent" style={{ fontSize: '12px', padding: '4px 10px' }}>
              {f.icon} {f.label}
            </span>
          ))}
        </div>

        {/* Email Sign-In Form */}
        <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '300px', margin: '0 auto 20px auto' }}>
          {isRegister && (
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              disabled={loading}
              className="w-full bg-secondary/50 border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            disabled={loading}
            className="w-full bg-secondary/50 border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            disabled={loading}
            className="w-full bg-secondary/50 border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium text-sm mt-2 hover:opacity-90 transition-opacity">
            {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-4">
          <button type="button" onClick={() => setIsRegister(!isRegister)} className="hover:text-foreground underline underline-offset-2">
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="flex items-center gap-3 w-full max-w-[300px] mx-auto mb-4">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px bg-border flex-1" />
        </div>

        {/* Google Sign-In button */}
        <button
          className="w-full max-w-[300px] mx-auto flex items-center justify-center gap-2 bg-secondary text-foreground py-2 rounded-md font-medium text-sm hover:bg-secondary/80 transition-colors"
          onClick={() => googleLogin()}
          disabled={loading}
          type="button"
        >
          {loading
            ? <span className="spinner" style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} />
            : <img src={GOOGLE_LOGO} alt="Google" style={{ width: 18, height: 18 }} />
          }
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 14, padding: '10px 14px', borderRadius: 'var(--r-md)',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: 'var(--danger)', fontSize: 13, lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        {/* Setup note */}
        <p style={{ marginTop: 20, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          🔒 Secure sign-in via Google. No passwords stored.<br />
          Make sure the backend is running:{' '}
          <code style={{ background: 'var(--bg-2)', padding: '1px 5px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            uvicorn main:app --reload --port 8000
          </code>
        </p>
      </div>
    </div>
  );
}
