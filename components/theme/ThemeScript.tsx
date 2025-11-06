const THEME_KEY = 'subs-theme';

export function ThemeScript() {
  const script = `(() => {
    try {
      const storageKey = '${THEME_KEY}';
      const stored = window.localStorage.getItem(storageKey);
      const themes = new Set(['light', 'dark']);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = themes.has(stored ?? '') ? stored : prefersDark ? 'dark' : 'light';
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      root.dataset.theme = theme ?? '';
    } catch (error) {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add('light');
      root.dataset.theme = 'light';
    }
  })();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
