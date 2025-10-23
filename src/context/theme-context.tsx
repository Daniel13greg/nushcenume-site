"use client";

import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextType {
  theme: 'dark';
  resolvedTheme: 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run on client side to avoid SSR issues
    if (typeof window === 'undefined') return;

    // Always apply dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', resolvedTheme: 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}