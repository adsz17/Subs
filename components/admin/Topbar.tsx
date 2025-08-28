"use client";

import { Menu, Moon, Plus, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  onMenu: () => void;
}

export function Topbar({ onMenu }: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4 dark:bg-gray-900">
      <button onClick={onMenu} className="md:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-semibold [font-family:var(--font-playfair)]">Admin</h1>
      <div className="flex items-center gap-2">
        <input
          type="search"
          placeholder="Buscar..."
          className="hidden rounded-md border px-2 py-1 text-sm md:block"
        />
        <button className="hidden items-center rounded-md bg-blue-600 px-3 py-1 text-sm text-white sm:flex">
          <Plus className="mr-1 h-4 w-4" /> Nuevo
        </button>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-md p-2"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        <div className="h-8 w-8 rounded-full bg-gray-300" />
      </div>
    </header>
  );
}

