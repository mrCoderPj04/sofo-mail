import { Injectable, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'sofomail_theme';
  readonly currentTheme = signal<AppTheme>(this.getSavedTheme());
  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    this.updateTheme(this.currentTheme());

    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.currentTheme() === 'system') {
          this.applyThemeToDOM('system');
        }
      });
    }
  }

  setTheme(theme: AppTheme) {
    this.currentTheme.set(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateTheme(theme);
  }

  private updateTheme(theme: AppTheme) {
    this.applyThemeToDOM(theme);
  }

  private applyThemeToDOM(theme: AppTheme) {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('theme-light', 'theme-dark', 'theme-system');
    body.classList.remove('theme-light', 'theme-dark', 'theme-system');

    let resolvedDark = false;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
      body.className = 'theme-system';
      resolvedDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      body.className = 'theme-dark';
      resolvedDark = true;
    } else {
      root.setAttribute('data-theme', 'light');
      body.className = 'theme-light';
      resolvedDark = false;
    }
    this.isDarkMode.set(resolvedDark);
  }

  private getSavedTheme(): AppTheme {
    if (typeof localStorage === 'undefined') return 'system';
    const saved = localStorage.getItem(this.STORAGE_KEY) as AppTheme;
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
  }
}
