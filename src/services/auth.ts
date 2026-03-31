import { createContext, useContext, useState, useCallback, createElement } from 'react';
import type { ReactNode } from 'react';

export interface VUser {
  id: number;
  name: string;
  email: string;
  picture?: string;
  onboarded: boolean;
  is_admin?: boolean;
  subjects?: string[];
  xp?: number;
  level?: number;
  streak?: number;
  face_id_snapshot?: string;
}

interface AuthCtx {
  user: VUser | null;
  token: string | null;
  login: (token: string, user: VUser) => void;
  logout: () => void;
  updateUser: (partial: Partial<VUser>) => void;
}

export const AuthContext = createContext<AuthCtx>({
  user: null, token: null,
  login: () => {}, logout: () => {}, updateUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('vityarthi_token'));
  const [user, setUser] = useState<VUser | null>(() => {
    const u = localStorage.getItem('vityarthi_user');
    return u ? JSON.parse(u) : null;
  });

  const login = useCallback((t: string, u: VUser) => {
    setToken(t);
    setUser(u);
    localStorage.setItem('vityarthi_token', t);
    localStorage.setItem('vityarthi_user', JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vityarthi_token');
    localStorage.removeItem('vityarthi_user');
  }, []);

  const updateUser = useCallback((partial: Partial<VUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      localStorage.setItem('vityarthi_user', JSON.stringify(next));
      return next;
    });
  }, []);

  return createElement(AuthContext.Provider, { value: { user, token, login, logout, updateUser } }, children);
}

export const useAuth = () => useContext(AuthContext);
