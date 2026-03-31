import { createContext, useContext, useState, useEffect, createElement } from 'react';
import type { ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeCtx { theme: Theme; toggle: () => void; }

export const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('vityarthi_theme') as Theme) || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vityarthi_theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return createElement(ThemeContext.Provider, { value: { theme, toggle } }, children);
}

export const useTheme = () => useContext(ThemeContext);
