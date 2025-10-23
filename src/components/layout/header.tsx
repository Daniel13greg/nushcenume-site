"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Clapperboard, Menu, Globe, Search, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from '@/context/language-context';
import { Input } from '../ui/input';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Media } from '@/lib/types';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, translations } = useLanguage();

  const navLinks = [
    { href: '/', label: translations.nav.home },
    { href: '/movies', label: translations.nav.movies },
    { href: '/shows', label: translations.nav.shows },
    { href: '/watchlist', label: translations.nav.watchlist },
  ];

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Media[]>([]);
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const cacheRef = useRef<Map<string, Media[]>>(new Map());
  const controllerRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLFormElement | null>(null);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submitted = (formData.get('search') as string) || query;
    if (submitted) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(submitted)}`);
    }
  };

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setOpen(false);
      if (controllerRef.current) controllerRef.current.abort();
      return;
    }

    setIsLoading(true);
    setOpen(true);

    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = setTimeout(async () => {
      try {
        const key = `${language}:${query.trim().toLowerCase()}`;
        const cached = cacheRef.current.get(key);
        if (cached) {
          setSuggestions(cached.slice(0, 8));
          setOpen(true);
        } else {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&language=${language}`, {
            signal: controller.signal,
            cache: 'no-store',
          });
          const data = (await res.json()) as Media[];
          cacheRef.current.set(key, data);
          setSuggestions(data.slice(0, 6));
        }
      } catch (e) {
        if ((e as any)?.name !== 'AbortError') {
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, language]);

  const ensureSuggestions = async () => {
    const q = query.trim();
    if (q.length < 2) return;
    // Abort any in-flight
    if (controllerRef.current) controllerRef.current.abort();
    setIsLoading(true);
    setOpen(true);
    const key = `${language}:${q.toLowerCase()}`;
    const cached = cacheRef.current.get(key);
    if (cached) {
      setSuggestions(cached.slice(0, 6));
      setIsLoading(false);
    }
    try {
      const controller = new AbortController();
      controllerRef.current = controller;
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&language=${language}`, {
        signal: controller.signal,
        cache: 'no-store',
      });
      const data = (await res.json()) as Media[];
      cacheRef.current.set(key, data);
      setSuggestions(data.slice(0, 6));
    } catch (e) {
      if ((e as any)?.name !== 'AbortError') {
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions, open]);

  useEffect(() => {
    // Close suggestions on route change
    setOpen(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
  }, [pathname]);

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.1
      }}
    >
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 relative">
        <div className="mr-4 hidden items-center md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <Clapperboard className="h-6 w-6 text-primary transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-12" />
            <span className="hidden font-bold sm:inline-block text-xl transition-all duration-300 ease-out group-hover:text-primary">
              NushCeNume
            </span>
          </Link>
           <nav className="flex items-center space-x-6 text-sm font-medium">
              {navLinks.map(({ href, label }) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Link
                    href={href}
                    className={cn(
                      'transition-all duration-300 ease-out hover:text-primary relative',
                      pathname === href ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {label}
                    {pathname === href && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>
        </div>

        <div className="flex md:hidden items-center">
             <Sheet>
                <SheetTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
                      <Button variant="ghost" size="icon" className="transition-all duration-300 ease-out">
                          <Menu className="h-6 w-6" />
                          <span className="sr-only">Toggle Menu</span>
                      </Button>
                    </motion.div>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-xs bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-0">
                    <div className="p-4">
                        <Link href="/" className="flex items-center space-x-2 mb-8">
                            <Clapperboard className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl">NushCeNume</span>
                        </Link>
                        <nav className="flex flex-col space-y-4">
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className={cn(
                                        'text-lg transition-colors hover:text-primary',
                                        pathname === href ? 'text-primary' : 'text-muted-foreground'
                                    )}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-sm md:max-w-md lg:max-w-lg transition-all duration-300 ease-out focus-within:max-w-lg">
            <Popover
              open={open}
              onOpenChange={(next) => {
                const allow = query.trim().length >= 2 || (isLoading && query.trim().length >= 1)
                setOpen(allow ? next : false)
              }}
            >
              <PopoverTrigger asChild>
                <form onSubmit={handleSearch} className="w-full" ref={containerRef}>
                  <div className="relative group">
                    <Search className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-transform duration-300",
                      open || isFocused ? "text-primary scale-110" : "text-muted-foreground"
                    )} />
                    <Input
                      type="search"
                      name="search"
                      placeholder="Search for movies, shows..."
                      className="w-full pl-10 pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary focus:shadow-md"
                      autoComplete="off"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => {
                        setIsFocused(true)
                        if (query.trim().length >= 2) {
                          setOpen(true)
                          void ensureSuggestions()
                        }
                      }}
                      onClick={() => {
                        if (query.trim().length >= 2) {
                          setOpen(true)
                          void ensureSuggestions()
                        }
                      }}
                      onBlur={() => {
                        setIsFocused(false)
                      }}
                      onKeyDown={(e) => {
                        if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                          setOpen(true)
                        }
                        if (suggestions.length === 0) return;
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          setHighlightedIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
                        } else if (e.key === 'Enter') {
                          if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
                            e.preventDefault();
                            const item = suggestions[highlightedIndex];
                            setOpen(false);
                            setQuery('');
                            router.push(`/media/${item.type}-${item.id}`);
                          }
                        } else if (e.key === 'Escape') {
                          setOpen(false);
                          setHighlightedIndex(-1);
                        }
                      }}
                      aria-label="Search movies and TV shows"
                      role="combobox"
                      aria-expanded={open}
                      aria-controls="search-suggestions-list"
                      aria-autocomplete="list"
                    />
                    {isLoading && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </form>
              </PopoverTrigger>
              <PopoverContent
                align="center"
                sideOffset={8}
                className="p-0 w-[var(--radix-popover-trigger-width)]"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => {
                  // Keep open when interacting with the input container
                  const target = e.target as Node
                  if (containerRef.current && containerRef.current.contains(target)) {
                    e.preventDefault()
                    return
                  }
                  setOpen(false)
                }}
              >
                <div className="max-h-80 overflow-hidden">
                  {isLoading && (
                    <div className="p-3 text-sm text-muted-foreground">Searching...</div>
                  )}
                  {!isLoading && suggestions.length === 0 && (
                    <div className="p-3 text-sm text-muted-foreground">No results</div>
                  )}
                  <ul id="search-suggestions-list" role="listbox" className="divide-y">
                    {suggestions.map((item, index) => (
                      <li key={`${item.type}-${item.id}`} role="option" aria-selected={highlightedIndex === index}>
                        <button
                          type="button"
                          className={cn(
                            "w-full text-left p-3 transition-all duration-300 ease-out hover:translate-x-1",
                            highlightedIndex === index ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                          )}
                          onClick={() => {
                            setOpen(false);
                            setQuery('');
                            router.push(`/media/${item.type}-${item.id}`);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-14 rounded overflow-hidden bg-muted flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.posterUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{item.type.toUpperCase()} {item.year ? `• ${item.year}` : ''}</p>
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {suggestions.length > 0 && (
                    <div className="border-t">
                      <button
                        type="button"
                        className="w-full p-3 text-sm text-primary hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-out font-medium"
                        onClick={() => {
                          setOpen(false);
                          router.push(`/search?q=${encodeURIComponent(query)}`);
                        }}
                      >
                        View all results →
                      </button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
        </div>

        <div className="flex items-center gap-2 ml-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
                      <Button variant="ghost" size="icon" className="transition-all duration-300 ease-out">
                          <Globe className="h-5 w-5" />
                          <span className="sr-only">Change language</span>
                      </Button>
                    </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setLanguage('en')}>
                        English
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('ro')}>
                        Romanian
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
              <Button variant="ghost" size="icon" className="transition-all duration-300 ease-out">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
              </Button>
            </motion.div>
        </div>
      </div>
    </motion.header>
  );
}