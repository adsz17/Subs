'use client';

import { THEME_STORAGE_KEY, type ThemePreference } from './theme';

function isTheme(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark';
}

export function readStoredTheme(): ThemePreference | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (isTheme(stored)) {
    return stored;
  }
  return null;
}

export function detectPreferredTheme(): ThemePreference {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function applyThemePreference(theme: ThemePreference) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.dataset.theme = theme;
}

export function persistThemePreference(theme: ThemePreference) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}
