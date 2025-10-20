"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Moon, Plus, Search, Sun } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

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

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-white px-4 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="rounded-md p-2 md:hidden" aria-label="Abrir menú">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="hidden text-lg font-semibold [font-family:var(--font-playfair)] md:block">Admin</h1>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            ref={inputRef}
            type="search"
            value={globalSearchValue}
            onChange={(event) => onGlobalSearch(event.target.value)}
            placeholder="Buscar en el panel..."
            className="pl-9 pr-16"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border px-2 py-0.5 text-xs text-gray-500">
            ⌘K
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.href} className="flex items-center gap-2">
            <Button asChild className="hidden sm:inline-flex">
              <Link href={shortcut.href}>
                <span className="mr-2 flex h-4 w-4 items-center justify-center">
                  {shortcut.icon ?? <Plus className="h-4 w-4" />}
                </span>
                {shortcut.label}
                {shortcut.shortcut && (
                  <span className="ml-2 hidden rounded border border-blue-200 bg-white/60 px-1 text-[10px] font-medium uppercase text-blue-600 sm:flex dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-200">
                    ⌘{shortcut.shortcut.toUpperCase()}
                  </span>
                )}
              </Link>
            </Button>
            <Button asChild size="icon" className="sm:hidden" aria-label={shortcut.label}>
              <Link href={shortcut.href}>
                {shortcut.icon ?? <Plus className="h-4 w-4" />}
              </Link>
            </Button>
          </div>
        ))}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-md p-2"
          aria-label="Cambiar tema"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-200 to-blue-500 dark:from-gray-700 dark:to-gray-500" />
      </div>
    </header>
  );
}

