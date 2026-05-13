import React, { createContext, useContext, useState, useEffect } from 'react';

export const themes = {
  green: {
    name: 'Forest Green',
    primary: '#22c55e',
    primaryDark: '#16a34a',
    primaryLight: '#dcfce7',
    accent: '#bbf7d0',
    dot: '#22c55e',
    vars: {
      '--c-primary': '#22c55e',
      '--c-primary-dark': '#16a34a',
      '--c-primary-light': '#dcfce7',
      '--c-accent': '#bbf7d0',
      '--c-hero-bg': '#f0fdf4',
    }
  },
  purple: {
    name: 'Royal Purple',
    primary: '#8b5cf6',
    primaryDark: '#7c3aed',
    primaryLight: '#ede9fe',
    accent: '#ddd6fe',
    dot: '#8b5cf6',
    vars: {
      '--c-primary': '#8b5cf6',
      '--c-primary-dark': '#7c3aed',
      '--c-primary-light': '#ede9fe',
      '--c-accent': '#ddd6fe',
      '--c-hero-bg': '#f5f3ff',
    }
  },
  blue: {
    name: 'Ocean Blue',
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    primaryLight: '#dbeafe',
    accent: '#bfdbfe',
    dot: '#3b82f6',
    vars: {
      '--c-primary': '#3b82f6',
      '--c-primary-dark': '#2563eb',
      '--c-primary-light': '#dbeafe',
      '--c-accent': '#bfdbfe',
      '--c-hero-bg': '#eff6ff',
    }
  },
  dark: {
    name: 'Midnight Dark',
    primary: '#f59e0b',
    primaryDark: '#d97706',
    primaryLight: '#fef3c7',
    accent: '#fde68a',
    dot: '#1f2937',
    vars: {
      '--c-primary': '#f59e0b',
      '--c-primary-dark': '#d97706',
      '--c-primary-light': '#fef3c7',
      '--c-accent': '#fde68a',
      '--c-hero-bg': '#111827',
    }
  }
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('ng_theme') || 'green';
  });

  const applyTheme = (key) => {
    const theme = themes[key];
    if (!theme) return;
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    localStorage.setItem('ng_theme', key);
    setActiveTheme(key);
  };

  useEffect(() => {
    applyTheme(activeTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ activeTheme, applyTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
