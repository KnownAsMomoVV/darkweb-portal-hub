
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeConfig } from '@/types/service';

export const themeOptions: ThemeConfig[] = [
  {
    name: 'Default',
    value: 'default',
    background: 'hsl(240 10% 3.9%)',
    primary: 'hsl(0 0% 98%)',
    secondary: 'hsl(240 3.7% 15.9%)',
    accent: 'hsl(240 3.7% 15.9%)'
  },
  {
    name: 'Blue',
    value: 'blue',
    background: 'hsl(214, 32%, 8%)',
    primary: 'hsl(214, 84%, 60%)',
    secondary: 'hsl(214, 32%, 18%)',
    accent: 'hsl(214, 84%, 60%)'
  },
  {
    name: 'Purple',
    value: 'purple',
    background: 'hsl(260, 32%, 8%)',
    primary: 'hsl(260, 84%, 60%)',
    secondary: 'hsl(260, 32%, 18%)',
    accent: 'hsl(260, 84%, 60%)'
  },
  {
    name: 'Green',
    value: 'green',
    background: 'hsl(160, 32%, 8%)',
    primary: 'hsl(160, 84%, 40%)',
    secondary: 'hsl(160, 32%, 18%)',
    accent: 'hsl(160, 84%, 40%)'
  },
  {
    name: 'Amber',
    value: 'amber',
    background: 'hsl(32, 32%, 8%)',
    primary: 'hsl(32, 84%, 50%)',
    secondary: 'hsl(32, 32%, 18%)',
    accent: 'hsl(32, 84%, 50%)'
  }
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentTheme: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'default',
  setTheme: () => {},
  currentTheme: themeOptions[0]
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('app-theme');
    return (savedTheme as Theme) || 'default';
  });

  const currentTheme = themeOptions.find(t => t.value === theme) || themeOptions[0];

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (themeValue: Theme) => {
    const theme = themeOptions.find(t => t.value === themeValue) || themeOptions[0];
    
    document.documentElement.style.setProperty('--background', theme.background);
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--accent', theme.accent);

    document.documentElement.classList.remove(...themeOptions.map(t => t.value));
    document.documentElement.classList.add(theme.value);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
