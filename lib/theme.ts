export type BackgroundType = 'clouds' | 'waves' | 'particles' | 'aurora' | 'none';

export type ColorPalette = 'cool-blue' | 'warm-sunset' | 'forest-green' | 'lavender' | 'ocean-deep';

export interface ThemeSettings {
  background: BackgroundType;
  colorPalette: ColorPalette;
  glassIntensity: 'light' | 'medium' | 'heavy';
  animationSpeed: 'slow' | 'medium' | 'fast';
}

const THEME_KEY = 'voiced_theme_settings';

export const DEFAULT_THEME: ThemeSettings = {
  background: 'waves',
  colorPalette: 'cool-blue',
  glassIntensity: 'medium',
  animationSpeed: 'slow',
};

export function getTheme(): ThemeSettings {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const data = localStorage.getItem(THEME_KEY);
  return data ? JSON.parse(data) : DEFAULT_THEME;
}

export function saveTheme(theme: ThemeSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_KEY, JSON.stringify(theme));
}

// Color palette configurations
export const COLOR_PALETTES: Record<ColorPalette, {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
}> = {
  'cool-blue': {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    accent: '#93c5fd',
    gradient: 'linear-gradient(135deg, #60a5fa 0%, #06b6d4 50%, #3b82f6 100%)',
  },
  'warm-sunset': {
    primary: '#f59e0b',
    secondary: '#fb923c',
    accent: '#fbbf24',
    gradient: 'linear-gradient(135deg, #fb923c 0%, #ec4899 50%, #a855f7 100%)',
  },
  'forest-green': {
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#6ee7b7',
    gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #14b8a6 100%)',
  },
  'lavender': {
    primary: '#a855f7',
    secondary: '#c084fc',
    accent: '#d8b4fe',
    gradient: 'linear-gradient(135deg, #c084fc 0%, #ec4899 50%, #6366f1 100%)',
  },
  'ocean-deep': {
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#22d3ee',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #4f46e5 100%)',
  },
};

// Glass intensity styles
export const GLASS_STYLES: Record<ThemeSettings['glassIntensity'], string> = {
  light: 'bg-white/10 backdrop-blur-sm',
  medium: 'bg-white/20 backdrop-blur-md',
  heavy: 'bg-white/30 backdrop-blur-lg',
};
