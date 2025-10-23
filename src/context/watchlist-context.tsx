"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Media } from '@/lib/types';

export interface WatchProgress {
  mediaId: string;
  currentTime: number;
  duration: number;
  percentage: number;
  lastWatched: number; // timestamp
  title?: string;
  imageUrl?: string;
  type?: 'movie' | 'show';
  season?: number;
  episode?: number;
}

interface WatchlistContextType {
  watchlist: string[];
  viewedHistory: string[];
  continueWatching: WatchProgress[];
  addToWatchlist: (mediaId: string) => void;
  removeFromWatchlist: (mediaId: string) => void;
  addToViewed: (mediaId: string) => void;
  isMediaInWatchlist: (mediaId: string) => boolean;
  updateWatchProgress: (progress: WatchProgress) => void;
  getWatchProgress: (mediaId: string) => WatchProgress | undefined;
  removeFromContinueWatching: (mediaId: string) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [viewedHistory, setViewedHistory] = useState<string[]>([]);
  const [continueWatching, setContinueWatching] = useState<WatchProgress[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side to avoid SSR issues
    if (typeof window === 'undefined') return;

    try {
      const storedWatchlist = localStorage.getItem('crimson-watchlist');
      const storedViewedHistory = localStorage.getItem('crimson-viewed');
      const storedContinueWatching = localStorage.getItem('crimson-continue-watching');

      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
      if (storedViewedHistory) {
        setViewedHistory(JSON.parse(storedViewedHistory));
      }
      if (storedContinueWatching) {
        const parsed = JSON.parse(storedContinueWatching) as WatchProgress[];
        // Sort by last watched, most recent first
        setContinueWatching(parsed.sort((a, b) => b.lastWatched - a.lastWatched));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('crimson-watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist, isLoaded]);

  useEffect(() => {
    if(isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('crimson-viewed', JSON.stringify(viewedHistory));
    }
  }, [viewedHistory, isLoaded]);

  useEffect(() => {
    if(isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('crimson-continue-watching', JSON.stringify(continueWatching));
    }
  }, [continueWatching, isLoaded]);

  const addToWatchlist = (mediaId: string) => {
    setWatchlist((prev) => {
      if (prev.includes(mediaId)) {
        return prev;
      }
      return [...prev, mediaId];
    });
  };

  const removeFromWatchlist = (mediaId: string) => {
    setWatchlist((prev) => prev.filter((id) => id !== mediaId));
  };

  const addToViewed = (mediaId: string) => {
    setViewedHistory((prev) => {
      if (prev.includes(mediaId)) {
        return prev;
      }
      return [...prev, mediaId];
    });
  };

  const isMediaInWatchlist = (mediaId: string) => {
    return watchlist.includes(mediaId);
  };

  const updateWatchProgress = (progress: WatchProgress) => {
    setContinueWatching((prev) => {
      // Remove if percentage is > 95% (considered finished)
      if (progress.percentage > 95) {
        return prev.filter((p) => p.mediaId !== progress.mediaId);
      }

      // Remove if < 5% (just started, no need to continue)
      if (progress.percentage < 5) {
        return prev.filter((p) => p.mediaId !== progress.mediaId);
      }

      const existing = prev.findIndex((p) => p.mediaId === progress.mediaId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = progress;
        return updated.sort((a, b) => b.lastWatched - a.lastWatched);
      }
      return [progress, ...prev].slice(0, 12); // Keep max 12 items
    });
  };

  const getWatchProgress = (mediaId: string) => {
    return continueWatching.find((p) => p.mediaId === mediaId);
  };

  const removeFromContinueWatching = (mediaId: string) => {
    setContinueWatching((prev) => prev.filter((p) => p.mediaId !== mediaId));
  };

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      viewedHistory,
      continueWatching,
      addToWatchlist,
      removeFromWatchlist,
      addToViewed,
      isMediaInWatchlist,
      updateWatchProgress,
      getWatchProgress,
      removeFromContinueWatching
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};