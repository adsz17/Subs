'use client';
import { useEffect, useRef, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { applyThemePreference, detectPreferredTheme, persistThemePreference, readStoredTheme } from '@/lib/theme-client';
import type { ThemePreference } from '@/lib/theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>('light');
  const initialized = useRef(false);

  useEffect(() => {
    const stored = readStoredTheme();
    const preferred = stored ?? detectPreferredTheme();
    setTheme(preferred);
    applyThemePreference(preferred);
    initialized.current = true;
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    applyThemePreference(theme);
    persistThemePreference(theme);
  }, [theme]);

  const toggle = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'));

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
