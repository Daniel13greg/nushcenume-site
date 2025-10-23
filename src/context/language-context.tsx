"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'ro';
  setLanguage: (language: 'en' | 'ro') => void;
  translations: any;
}

const translations = {
  en: {
    nav: {
      home: 'Home',
      movies: 'Movies',
      shows: 'TV Shows',
      watchlist: 'My Watchlist',
    },
  },
  ro: {
    nav: {
      home: 'Acasă',
      movies: 'Filme',
      shows: 'Seriale TV',
      watchlist: 'Lista Mea',
    },
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getCookie(name: string): string | undefined {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

function setCookie(name: string, value: string, days: number) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}


export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'ro'>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedLanguage = getCookie('crimson-language') as 'en' | 'ro';
      if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'ro')) {
        setLanguage(storedLanguage);
      }
    } catch (error) {
      console.error("Failed to parse from cookie", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setCookie('crimson-language', language, 7);
    }
  }, [language, isLoaded]);

  const handleSetLanguage = (lang: 'en' | 'ro') => {
    setLanguage(lang);
    // We need to reload to make sure server components are re-rendered with the new language
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  const value = {
    language,
    setLanguage: handleSetLanguage,
    translations: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};