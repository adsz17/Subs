"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Bell,
  Command,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
  X,
  Clock,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { applyThemePreference, detectPreferredTheme, persistThemePreference, readStoredTheme } from "@/lib/theme-client";
import type { ThemePreference } from "@/lib/theme";

export interface TopbarShortcut {
  label: string;
  href: string;
  shortcut?: string;
  icon?: ReactNode;
}

interface Props {
  onMenu: () => void;
  globalSearchValue: string;
  onGlobalSearch: (value: string) => void;
  shortcuts?: TopbarShortcut[];
}

export function Topbar({ onMenu, globalSearchValue, onGlobalSearch, shortcuts = [] }: Props) {
  const [theme, setTheme] = useState<ThemePreference>("light");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState(globalSearchValue);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const themeReady = useRef(false);
  const router = useRouter();

  const themeLabel = theme === "light" ? "Modo claro" : "Modo oscuro";

  useEffect(() => {
    const stored = readStoredTheme();
    const preferred = stored ?? detectPreferredTheme();
    setTheme(preferred);
    applyThemePreference(preferred);
    themeReady.current = true;
  }, []);

  useEffect(() => {
    if (!themeReady.current) return;
    applyThemePreference(theme);
    persistThemePreference(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem("subs-admin-recent-searches");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.filter((item): item is string => typeof item === "string"));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    setSearchValue(globalSearchValue);
  }, [globalSearchValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }

      shortcuts.forEach((shortcut) => {
        if (!shortcut.shortcut) return;
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === shortcut.shortcut.toLowerCase()) {
          event.preventDefault();
          router.push(shortcut.href);
        }
      });
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router, shortcuts]);

  const primaryShortcut = shortcuts[0];
  const secondaryShortcuts = useMemo(() => shortcuts.slice(1), [shortcuts]);

  const storeRecentSearches = (items: string[]) => {
    setRecentSearches(items);
    if (typeof window === "undefined") return;
    window.localStorage.setItem("subs-admin-recent-searches", JSON.stringify(items));
  };

  const handleSearchSubmit = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    const newRecents = [normalized, ...recentSearches.filter((item) => item !== normalized)].slice(0, 5);
    storeRecentSearches(newRecents);
  };

  const removeRecentSearch = (value: string) => {
    const updated = recentSearches.filter((item) => item !== value);
    storeRecentSearches(updated);
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <header className="relative z-20 flex flex-col border-b border-white/10 bg-white/70 px-4 py-4 backdrop-blur-xl transition-colors dark:bg-slate-950/60 sm:px-8">
      <div className="flex items-center gap-3">
        <Button
          onClick={onMenu}
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-xl bg-white/40 text-slate-700 hover:bg-white/70 dark:bg-slate-900/60 dark:text-white/80 md:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 rounded-xl border border-white/40 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-300">
          <Command className="h-3.5 w-3.5" />
          Panel Admin
        </div>
        <div className="ml-auto flex items-center gap-2">
          {primaryShortcut && (
            <Button asChild className="hidden sm:inline-flex">
              <Link href={primaryShortcut.href}>
                <span className="mr-2 flex h-4 w-4 items-center justify-center">
                  {primaryShortcut.icon ?? <Plus className="h-4 w-4" />}
                </span>
                {primaryShortcut.label}
                {primaryShortcut.shortcut && (
                  <span className="ml-2 hidden rounded border border-blue-200/70 bg-white/70 px-1 text-[10px] font-medium uppercase tracking-wide text-blue-700 sm:flex dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                    ⌘{primaryShortcut.shortcut.toUpperCase()}
                  </span>
                )}
              </Link>
            </Button>
          )}
          {secondaryShortcuts.map((shortcut) => (
            <Button key={shortcut.href} asChild variant="ghost" className="hidden sm:inline-flex text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
              <Link href={shortcut.href}>{shortcut.label}</Link>
            </Button>
          ))}
          {shortcuts.map((shortcut) => (
            <Button key={`mobile-${shortcut.href}`} asChild size="icon" className="sm:hidden" aria-label={shortcut.label}>
              <Link href={shortcut.href}>{shortcut.icon ?? <Plus className="h-4 w-4" />}</Link>
            </Button>
          ))}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleThemeToggle}
            className="rounded-xl bg-white/40 text-slate-600 hover:bg-white/70 dark:bg-slate-900/60 dark:text-slate-200"
            aria-label={`Cambiar a ${theme === "light" ? "modo oscuro" : "modo claro"}`}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-xl bg-white/40 text-slate-600 hover:bg-white/70 dark:bg-slate-900/60 dark:text-slate-200"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-white/30 bg-white/70 px-2 py-1.5 text-left shadow-sm transition hover:bg-white/90 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900/80"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Avatar className="h-9 w-9 border border-white/40">
                <AvatarImage src="/admin-avatar.png" alt="Administrador" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="hidden min-w-[120px] text-left text-xs font-semibold text-slate-600 sm:block dark:text-slate-200">
                <p className="truncate">Administrador</p>
                <p className="text-[10px] font-normal text-slate-500 dark:text-slate-400">{themeLabel}</p>
              </div>
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-30 mt-3 w-48 overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-2 text-sm text-slate-700 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-200"
              >
                <Link
                  href="/admin/ajustes"
                  className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-blue-50/80 dark:hover:bg-slate-800/70"
                  onClick={() => setMenuOpen(false)}
                >
                  Preferencias
                  <span className="text-[10px] uppercase text-blue-500">Ctrl+P</span>
                </Link>
                <button
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-blue-50/80 dark:hover:bg-slate-800/70"
                  onClick={() => {
                    setMenuOpen(false);
                    void signOut({ callbackUrl: "/login" });
                  }}
                >
                  Cerrar sesión
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <form
          className="relative"
          onSubmit={(event) => {
            event.preventDefault();
            onGlobalSearch(searchValue);
            handleSearchSubmit(searchValue);
          }}
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            ref={inputRef}
            type="search"
            value={searchValue}
            onChange={(event) => {
              const value = event.target.value;
              setSearchValue(value);
              onGlobalSearch(value);
            }}
            placeholder="Buscar en todo el panel..."
            className="h-12 rounded-2xl border border-white/40 bg-white/70 pl-12 pr-24 text-slate-700 shadow-sm ring-0 placeholder:text-slate-400 focus:border-blue-400 focus:ring focus:ring-blue-200/60 dark:border-slate-800/60 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full border border-white/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 shadow-sm dark:border-slate-700 dark:text-slate-400">
            ⌘K
          </span>
        </form>
        {recentSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
              <Clock className="h-3.5 w-3.5" /> Recientes
            </span>
            {recentSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSearchValue(item);
                  onGlobalSearch(item);
                }}
                className="group flex items-center gap-1 rounded-full border border-blue-200/60 bg-white/80 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800/80"
                title={`Buscar "${item}"`}
              >
                {item}
                <span
                  className="hidden rounded-full bg-blue-600/90 px-1 text-[10px] font-semibold uppercase text-white group-hover:inline"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeRecentSearch(item);
                  }}
                >
                  ×
                </span>
              </button>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              onClick={() => storeRecentSearches([])}
            >
              Limpiar
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

